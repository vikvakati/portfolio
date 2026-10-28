import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* =========================================================
   CONSTANTS
   ========================================================= */
const MAX_DIM = 640; // working resolution for live preview
const SAVE_MAX_DIM = 2560; // max resolution when saving processed image

const SPACE_NAMES = ["RGB", "HSV", "HLS", "LAB", "LUV", "YUV", "YCrCb", "XYZ"];

const CHANNEL_NAMES = {
	RGB: ["R", "G", "B"],
	HSV: ["H", "S", "V"],
	HLS: ["H", "L", "S"],
	LAB: ["L*", "a*", "b*"],
	LUV: ["L*", "u*", "v*"],
	YUV: ["Y", "U", "V"],
	YCrCb: ["Y", "Cr", "Cb"],
	XYZ: ["X", "Y", "Z"],
};

const CHANNEL_DESCRIPTION = {
	RGB: ["R: Red Intensity", "G: Green Intensity", "B: Blue Intensity"],
	HSV: ["H: Hue Angle", "S: Saturation", "V: Value"],
	HLS: ["H: Hue Angle", "L: Lightness", "S: Saturation"],
	LAB: ["L*: Lightness", "a*: Green - Red Axis", "b*: Blue - Yellow Axis"],
	LUV: ["L*: Lightness", "u*: Green - Red Axis", "v*: Blue - Yellow Axis"],
	YUV: [
		"Y: Luma",
		"U: Blue Chroma - Luma Difference",
		"V: Red Chroma - Luma Difference",
	],
	YCrCb: ["Y: Luma", "Cr: Red Chroma", "Cb: Blue Chroma"],
	XYZ: ["X: Green - Red Weighted", "Y: Luma", "Z: Yellow - Blue Weighted"],
};

const DEF_CHANNEL = { min: 0, max: 255, gamma: 100 };
const DEF_CLAHE = { on: false, tile: 8, clip: 40 };
const DEF_MORPH = {
	size: 5,
	shape: "Rectangle",
	iterations: 1,
	gaussian: false,
	erosion: false,
	dilation: false,
	opening: false,
	closing: false,
	gradient: false,
	tophat: false,
	blackhat: false,
};

const MORPH_OPS = [
	["gaussian", "5x5 Gaussian Blur"],
	["erosion", "Erosion"],
	["dilation", "Dilation"],
	["opening", "Opening"],
	["closing", "Closing"],
	["gradient", "Gradient"],
	["tophat", "Top Hat"],
	["blackhat", "Black Hat"],
];

/* =========================================================
   COLOR SPACE MATH (mirrors OpenCV 8-bit conversions)
   ========================================================= */
const clamp8 = (v) => (v < 0 ? 0 : v > 255 ? 255 : (v + 0.5) | 0);

// sRGB -> linear lookup
const LIN = new Float32Array(256);
for (let i = 0; i < 256; i++) {
	const c = i / 255;
	LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
// linear -> sRGB (0..255) lookup
const ENC_N = 4096;
const ENC = new Float32Array(ENC_N + 1);
for (let i = 0; i <= ENC_N; i++) {
	const x = i / ENC_N;
	ENC[i] =
		255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}
const encode = (x) => ENC[x <= 0 ? 0 : x >= 1 ? ENC_N : (x * ENC_N + 0.5) | 0];

const hueFull = (r, g, b, mx, mn) => {
	const d = mx - mn;
	if (d === 0) return 0;
	let h;
	if (mx === r) h = (g - b) / d;
	else if (mx === g) h = 2 + (b - r) / d;
	else h = 4 + (r - g) / d;
	h *= 60;
	if (h < 0) h += 360;
	return (h * 255) / 360;
};

const labF = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
const labFinv = (f) => {
	const f3 = f * f * f;
	return f3 > 0.008856 ? f3 : (f - 16 / 116) / 7.787;
};

const xyzToRgb = (X, Y, Z, o) => {
	o[0] = encode(3.240479 * X - 1.53715 * Y - 0.498535 * Z);
	o[1] = encode(-0.969256 * X + 1.875992 * Y + 0.041556 * Z);
	o[2] = encode(0.055648 * X - 0.204043 * Y + 1.057311 * Z);
};

const hue2rgb = (t1, t2, t) => {
	t = ((t % 1) + 1) % 1;
	if (t < 1 / 6) return t1 + (t2 - t1) * 6 * t;
	if (t < 0.5) return t2;
	if (t < 2 / 3) return t1 + (t2 - t1) * (2 / 3 - t) * 6;
	return t1;
};

// Forward: RGB (0-255 ints) -> 3 floats written into o (0-255 scale)
const FWD = {
	RGB: (r, g, b, o) => {
		o[0] = r;
		o[1] = g;
		o[2] = b;
	},
	HSV: (r, g, b, o) => {
		const mx = Math.max(r, g, b);
		const mn = Math.min(r, g, b);
		o[0] = hueFull(r, g, b, mx, mn);
		o[1] = mx === 0 ? 0 : ((mx - mn) / mx) * 255;
		o[2] = mx;
	},
	HLS: (r, g, b, o) => {
		const mx = Math.max(r, g, b);
		const mn = Math.min(r, g, b);
		const sum = mx + mn;
		const d = mx - mn;
		o[0] = hueFull(r, g, b, mx, mn);
		o[1] = sum / 2;
		o[2] = d === 0 ? 0 : (sum <= 255 ? d / sum : d / (510 - sum)) * 255;
	},
	LAB: (r, g, b, o) => {
		const R = LIN[r],
			G = LIN[g],
			B = LIN[b];
		const X = (0.412453 * R + 0.35758 * G + 0.180423 * B) / 0.950456;
		const Y = 0.212671 * R + 0.71516 * G + 0.072169 * B;
		const Z = (0.019334 * R + 0.119193 * G + 0.950227 * B) / 1.088754;
		const fx = labF(X),
			fy = labF(Y),
			fz = labF(Z);
		o[0] = (116 * fy - 16) * 2.55;
		o[1] = 500 * (fx - fy) + 128;
		o[2] = 200 * (fy - fz) + 128;
	},
	LUV: (r, g, b, o) => {
		const R = LIN[r],
			G = LIN[g],
			B = LIN[b];
		const X = 0.412453 * R + 0.35758 * G + 0.180423 * B;
		const Y = 0.212671 * R + 0.71516 * G + 0.072169 * B;
		const Z = 0.019334 * R + 0.119193 * G + 0.950227 * B;
		const L = Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y;
		const d = X + 15 * Y + 3 * Z;
		const up = d ? (4 * X) / d : 0;
		const vp = d ? (9 * Y) / d : 0;
		const u = 13 * L * (up - 0.19793943);
		const v = 13 * L * (vp - 0.46831096);
		o[0] = L * 2.55;
		o[1] = ((u + 134) * 255) / 354;
		o[2] = ((v + 140) * 255) / 262;
	},
	YUV: (r, g, b, o) => {
		const Y = 0.299 * r + 0.587 * g + 0.114 * b;
		o[0] = Y;
		o[1] = (b - Y) * 0.492 + 128;
		o[2] = (r - Y) * 0.877 + 128;
	},
	YCrCb: (r, g, b, o) => {
		const Y = 0.299 * r + 0.587 * g + 0.114 * b;
		o[0] = Y;
		o[1] = (r - Y) * 0.713 + 128;
		o[2] = (b - Y) * 0.564 + 128;
	},
	XYZ: (r, g, b, o) => {
		const R = r / 255,
			G = g / 255,
			B = b / 255;
		o[0] = (0.412453 * R + 0.35758 * G + 0.180423 * B) * 255;
		o[1] = (0.212671 * R + 0.71516 * G + 0.072169 * B) * 255;
		o[2] = (0.019334 * R + 0.119193 * G + 0.950227 * B) * 255;
	},
};

// Inverse: 3 channel values (0-255) -> RGB floats (0-255) written into o
const INV = {
	RGB: (a, b, c, o) => {
		o[0] = a;
		o[1] = b;
		o[2] = c;
	},
	HSV: (H, S, V, o) => {
		const h = ((H * 360) / 255 / 60) % 6;
		const s = S / 255;
		const i = Math.floor(h);
		const f = h - i;
		const p = V * (1 - s);
		const q = V * (1 - s * f);
		const t = V * (1 - s * (1 - f));
		switch (i) {
			case 0:
				o[0] = V;
				o[1] = t;
				o[2] = p;
				break;
			case 1:
				o[0] = q;
				o[1] = V;
				o[2] = p;
				break;
			case 2:
				o[0] = p;
				o[1] = V;
				o[2] = t;
				break;
			case 3:
				o[0] = p;
				o[1] = q;
				o[2] = V;
				break;
			case 4:
				o[0] = t;
				o[1] = p;
				o[2] = V;
				break;
			default:
				o[0] = V;
				o[1] = p;
				o[2] = q;
		}
	},
	HLS: (H, L, S, o) => {
		const h = (H * 360) / 255 / 360;
		const l = L / 255;
		const s = S / 255;
		if (s === 0) {
			o[0] = o[1] = o[2] = L;
			return;
		}
		const t2 = l <= 0.5 ? l * (1 + s) : l + s - l * s;
		const t1 = 2 * l - t2;
		o[0] = hue2rgb(t1, t2, h + 1 / 3) * 255;
		o[1] = hue2rgb(t1, t2, h) * 255;
		o[2] = hue2rgb(t1, t2, h - 1 / 3) * 255;
	},
	LAB: (L8, a8, b8, o) => {
		const L = (L8 * 100) / 255;
		const fy = (L + 16) / 116;
		const fx = fy + (a8 - 128) / 500;
		const fz = fy - (b8 - 128) / 200;
		xyzToRgb(
			labFinv(fx) * 0.950456,
			labFinv(fy),
			labFinv(fz) * 1.088754,
			o
		);
	},
	LUV: (L8, u8, v8, o) => {
		const L = (L8 * 100) / 255;
		if (L <= 0) {
			o[0] = o[1] = o[2] = 0;
			return;
		}
		const u = (u8 * 354) / 255 - 134;
		const v = (v8 * 262) / 255 - 140;
		const up = u / (13 * L) + 0.19793943;
		const vp = v / (13 * L) + 0.46831096;
		const Y = L > 7.9996 ? Math.pow((L + 16) / 116, 3) : L / 903.3;
		if (vp === 0) {
			o[0] = o[1] = o[2] = 0;
			return;
		}
		const X = (Y * 9 * up) / (4 * vp);
		const Z = (Y * (12 - 3 * up - 20 * vp)) / (4 * vp);
		xyzToRgb(X, Y, Z, o);
	},
	YUV: (Y, U, V, o) => {
		const R = Y + (V - 128) / 0.877;
		const B = Y + (U - 128) / 0.492;
		o[0] = R;
		o[1] = (Y - 0.299 * R - 0.114 * B) / 0.587;
		o[2] = B;
	},
	YCrCb: (Y, Cr, Cb, o) => {
		const R = Y + (Cr - 128) / 0.713;
		const B = Y + (Cb - 128) / 0.564;
		o[0] = R;
		o[1] = (Y - 0.299 * R - 0.114 * B) / 0.587;
		o[2] = B;
	},
	XYZ: (X, Y, Z, o) => {
		const x = X / 255,
			y = Y / 255,
			z = Z / 255;
		o[0] = (3.240479 * x - 1.53715 * y - 0.498535 * z) * 255;
		o[1] = (-0.969256 * x + 1.875992 * y + 0.041556 * z) * 255;
		o[2] = (0.055648 * x - 0.204043 * y + 1.057311 * z) * 255;
	},
};

function convertAll(space, rgba, n) {
	const c1 = new Uint8Array(n);
	const c2 = new Uint8Array(n);
	const c3 = new Uint8Array(n);
	const o = new Float64Array(3);
	const f = FWD[space];
	for (let i = 0; i < n; i++) {
		const k = i * 4;
		f(rgba[k], rgba[k + 1], rgba[k + 2], o);
		c1[i] = clamp8(o[0]);
		c2[i] = clamp8(o[1]);
		c3[i] = clamp8(o[2]);
	}
	return [c1, c2, c3];
}

function channelsToRGBA(space, c1, c2, c3, n, mask) {
	const out = new Uint8ClampedArray(n * 4);
	const o = new Float64Array(3);
	const f = INV[space];
	for (let i = 0; i < n; i++) {
		const k = i * 4;
		out[k + 3] = 255;
		if (mask && !mask[i]) continue;
		f(c1[i], c2[i], c3[i], o);
		out[k] = o[0];
		out[k + 1] = o[1];
		out[k + 2] = o[2];
	}
	return out;
}

function grayToRGBA(gray, n, mask) {
	const out = new Uint8ClampedArray(n * 4);
	for (let i = 0; i < n; i++) {
		const k = i * 4;
		const v = !mask || mask[i] ? gray[i] : 0;
		out[k] = out[k + 1] = out[k + 2] = v;
		out[k + 3] = 255;
	}
	return out;
}

/* =========================================================
   IMAGE PROCESSING: gamma, CLAHE, morphology
   ========================================================= */
function applyGamma(ch, gamma) {
	const inv = 1 / Math.max(gamma, 1e-6);
	const lut = new Uint8Array(256);
	for (let i = 0; i < 256; i++) {
		lut[i] = Math.min(255, Math.floor(Math.pow(i / 255, inv) * 255 + 1e-9));
	}
	const out = new Uint8Array(ch.length);
	for (let i = 0; i < ch.length; i++) out[i] = lut[ch[i]];
	return out;
}

function applyClahe(src, w, h, clipLimit, tilesReq) {
	const tx = Math.max(1, Math.min(tilesReq, w));
	const ty = Math.max(1, Math.min(tilesReq, h));
	const tw = Math.ceil(w / tx);
	const th = Math.ceil(h / ty);
	const area = tw * th;
	const clip = Math.max(Math.floor((clipLimit * area) / 256), 1);
	const luts = new Uint8Array(tx * ty * 256);
	const hist = new Int32Array(256);

	for (let j = 0; j < ty; j++) {
		for (let i = 0; i < tx; i++) {
			hist.fill(0);
			const y0 = j * th,
				y1 = Math.min(y0 + th, h);
			const x0 = i * tw,
				x1 = Math.min(x0 + tw, w);
			for (let y = y0; y < y1; y++) {
				for (let x = x0; x < x1; x++) hist[src[y * w + x]]++;
			}
			let clipped = 0;
			for (let b = 0; b < 256; b++) {
				if (hist[b] > clip) {
					clipped += hist[b] - clip;
					hist[b] = clip;
				}
			}
			const batch = Math.floor(clipped / 256);
			let resid = clipped - batch * 256;
			for (let b = 0; b < 256; b++) hist[b] += batch;
			if (resid > 0) {
				const step = Math.max(Math.floor(256 / resid), 1);
				for (let b = 0; b < 256 && resid > 0; b += step, resid--) hist[b]++;
			}
			let sum = 0;
			const scale = 255 / area;
			const base = (j * tx + i) * 256;
			for (let b = 0; b < 256; b++) {
				sum += hist[b];
				luts[base + b] = Math.min(255, Math.round(sum * scale));
			}
		}
	}

	const xi1 = new Int32Array(w),
		xi2 = new Int32Array(w),
		xa = new Float32Array(w);
	for (let x = 0; x < w; x++) {
		const f = x / tw - 0.5;
		const a = Math.floor(f);
		xa[x] = f - a;
		xi1[x] = Math.max(a, 0);
		xi2[x] = Math.min(a + 1, tx - 1);
	}

	const out = new Uint8Array(w * h);
	for (let y = 0; y < h; y++) {
		const f = y / th - 0.5;
		const a = Math.floor(f);
		const ya = f - a;
		const r1 = Math.max(a, 0) * tx;
		const r2 = Math.min(a + 1, ty - 1) * tx;
		for (let x = 0; x < w; x++) {
			const v = src[y * w + x];
			const xf = xa[x];
			const top =
				(1 - xf) * luts[(r1 + xi1[x]) * 256 + v] +
				xf * luts[(r1 + xi2[x]) * 256 + v];
			const bot =
				(1 - xf) * luts[(r2 + xi1[x]) * 256 + v] +
				xf * luts[(r2 + xi2[x]) * 256 + v];
			out[y * w + x] = Math.round((1 - ya) * top + ya * bot);
		}
	}
	return out;
}

// Kernel represented as per-row horizontal half-widths (like OpenCV's structuring element)
function makeKernel(size, shape) {
	const r = size >> 1;
	const hw = new Array(size).fill(0);
	if (size === 1 || shape === "Rectangle") {
		hw.fill(r);
	} else if (shape === "Cross") {
		hw[r] = r;
	} else {
		for (let i = 0; i < size; i++) {
			const dy = i - r;
			const dx = Math.round(r * Math.sqrt((r * r - dy * dy) / (r * r)));
			hw[i] = Math.min(dx, r);
		}
	}
	return { r, hw };
}

function morphOnce(src, w, h, K, isMax) {
	const n = w * h;
	const op = isMax
		? (a, b) => (a > b ? a : b)
		: (a, b) => (a < b ? a : b);
	const maxHw = Math.max(...K.hw);
	const H = [src];
	for (let k = 1; k <= maxHw; k++) {
		const prev = H[k - 1];
		const cur = new Uint8Array(n);
		for (let y = 0; y < h; y++) {
			const row = y * w;
			for (let x = 0; x < w; x++) {
				let v = prev[row + x];
				if (x - k >= 0) v = op(v, src[row + x - k]);
				if (x + k < w) v = op(v, src[row + x + k]);
				cur[row + x] = v;
			}
		}
		H.push(cur);
	}
	const out = new Uint8Array(n).fill(isMax ? 0 : 255);
	for (let dy = -K.r; dy <= K.r; dy++) {
		const Hk = H[K.hw[dy + K.r]];
		for (let y = 0; y < h; y++) {
			const yy = y + dy;
			if (yy < 0 || yy >= h) continue;
			const ro = y * w,
				ri = yy * w;
			for (let x = 0; x < w; x++) out[ro + x] = op(out[ro + x], Hk[ri + x]);
		}
	}
	return out;
}

const erode = (m, w, h, K, it) => {
	for (let i = 0; i < it; i++) m = morphOnce(m, w, h, K, false);
	return m;
};
const dilate = (m, w, h, K, it) => {
	for (let i = 0; i < it; i++) m = morphOnce(m, w, h, K, true);
	return m;
};
const subtract = (a, b) => {
	const out = new Uint8Array(a.length);
	for (let i = 0; i < a.length; i++) out[i] = a[i] > b[i] ? a[i] - b[i] : 0;
	return out;
};

function gaussian5(src, w, h) {
	const k = [1, 4, 6, 4, 1];
	const refl = (i, n) => {
		if (n === 1) return 0;
		if (i < 0) return -i;
		if (i >= n) return 2 * (n - 1) - i;
		return i;
	};
	const tmp = new Float32Array(w * h);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			let s = 0;
			for (let j = -2; j <= 2; j++) s += k[j + 2] * src[y * w + refl(x + j, w)];
			tmp[y * w + x] = s;
		}
	}
	const out = new Uint8Array(w * h);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			let s = 0;
			for (let j = -2; j <= 2; j++) s += k[j + 2] * tmp[refl(y + j, h) * w + x];
			out[y * w + x] = Math.round(s / 256);
		}
	}
	return out;
}

function applyMorph(mask, w, h, m) {
	const K = makeKernel(m.size, m.shape);
	const it = m.iterations;
	if (m.gaussian) mask = gaussian5(mask, w, h);
	if (m.erosion) mask = erode(mask, w, h, K, it);
	if (m.dilation) mask = dilate(mask, w, h, K, it);
	if (m.opening) mask = dilate(erode(mask, w, h, K, it), w, h, K, it);
	if (m.closing) mask = erode(dilate(mask, w, h, K, it), w, h, K, it);
	if (m.gradient)
		mask = subtract(dilate(mask, w, h, K, it), erode(mask, w, h, K, it));
	if (m.tophat)
		mask = subtract(mask, dilate(erode(mask, w, h, K, it), w, h, K, it));
	if (m.blackhat)
		mask = subtract(erode(dilate(mask, w, h, K, it), w, h, K, it), mask);
	return mask;
}

/* =========================================================
   MAIN PIPELINE
   ========================================================= */
function runPipeline(img, s) {
	const { width: w, height: h, data } = img;
	const n = w * h;

	// Convert to selected color space
	const conv = convertAll(s.space, data, n);

	// CLAHE + gamma per channel
	const proc = conv.map((ch, i) => {
		let c = ch;
		if (s.clahe.on) c = applyClahe(c, w, h, s.clahe.clip / 10, s.clahe.tile);
		return applyGamma(c, s.channels[i].gamma / 100);
	});

	// Per-channel masks + histograms
	const masks = [];
	const hists = [];
	for (let i = 0; i < 3; i++) {
		const lo = s.channels[i].min;
		const hi = s.channels[i].max;
		const m = new Uint8Array(n);
		const hist = new Float32Array(256);
		const c = proc[i];
		for (let p = 0; p < n; p++) {
			const v = c[p];
			hist[v]++;
			m[p] = v >= lo && v <= hi ? 255 : 0;
		}
		masks.push(m);
		hists.push(hist);
	}

	// Combined mask + morphology
	let mask = new Uint8Array(n);
	for (let p = 0; p < n; p++) mask[p] = masks[0][p] & masks[1][p] & masks[2][p];
	mask = applyMorph(mask, w, h, s.morph);

	return {
		w,
		h,
		conv,
		convProc: proc,
		hists,
		rawRGBA: data,
		maskRGBA: grayToRGBA(mask, n, null),
		procRGBA: channelsToRGBA(
			s.space,
			proc[0],
			proc[1],
			proc[2],
			n,
			s.applyFilter ? mask : null
		),
		chanRGBA: [0, 1, 2].map((i) => grayToRGBA(proc[i], n, masks[i])),
	};
}

/* =========================================================
   HELPERS
   ========================================================= */
let scratch = null;
function grab(source, sw, sh, maxDim) {
	const sc = Math.min(1, maxDim / Math.max(sw, sh));
	const w = Math.max(1, Math.round(sw * sc));
	const h = Math.max(1, Math.round(sh * sc));
	if (!scratch) scratch = document.createElement("canvas");
	scratch.width = w;
	scratch.height = h;
	const ctx = scratch.getContext("2d", { willReadFrequently: true });
	ctx.drawImage(source, 0, 0, w, h);
	return ctx.getImageData(0, 0, w, h);
}

function downloadCanvas(canvas, name, format) {
	const mime = format === "jpg" ? "image/jpeg" : "image/png";
	canvas.toBlob(
		(blob) => {
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${name}.${format}`;
			a.click();
			URL.revokeObjectURL(url);
		},
		mime,
		0.95
	);
}

function drawHistogram(canvas, hist, lo, hi) {
	if (!canvas) return;
	const ctx = canvas.getContext("2d");
	const W = canvas.width,
		H = canvas.height;
	ctx.fillStyle = "rgb(25,25,25)";
	ctx.fillRect(0, 0, W, H);
	let max = 1;
	for (let i = 0; i < 256; i++) if (hist[i] > max) max = hist[i];
	for (let i = 0; i < 256; i++) {
		const bh = (hist[i] / max) * H;
		ctx.fillStyle = i >= lo && i <= hi ? "rgb(0,255,0)" : "rgb(80,80,80)";
		ctx.fillRect(i, H - bh, 1, bh);
	}
	ctx.strokeStyle = "rgb(255,255,0)";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(lo + 0.5, 0);
	ctx.lineTo(lo + 0.5, H);
	ctx.moveTo(hi + 0.5, 0);
	ctx.lineTo(hi + 0.5, H);
	ctx.stroke();
}

/* =========================================================
   SMALL UI PIECES
   ========================================================= */
const inputCls =
	"bg-gray-800 text-white rounded px-2 py-1 border border-gray-600 focus:border-blue-500 outline-none";
const btnCls =
	"px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-white text-sm";
const boxCls = "border border-gray-600 rounded-xl p-3";

const NumInput = ({ value, min, max, onChange, className = "w-16" }) => (
	<input
		type="number"
		min={min}
		max={max}
		value={value}
		onChange={(e) => {
			const v = parseInt(e.target.value, 10);
			if (Number.isNaN(v)) return;
			onChange(Math.max(min, Math.min(max, v)));
		}}
		className={`${inputCls} ${className}`}
	/>
);

const PAD = 8;

// Low / high thresholds plus a gamma marker, all on one track
const RangeSlider = ({ low, high, gamma, onChange }) => {
	const ref = useRef(null);
	const active = useRef(null);

	const ratioFromEvent = (e) => {
		const rect = ref.current.getBoundingClientRect();
		const usable = rect.width - 2 * PAD;
		return Math.max(0, Math.min(1, (e.clientX - rect.left - PAD) / usable));
	};

	const apply = (which, ratio) => {
		if (which === "low") onChange({ min: Math.min(Math.round(ratio * 255), high) });
		else if (which === "high")
			onChange({ max: Math.max(Math.round(ratio * 255), low) });
		else onChange({ gamma: Math.max(1, Math.min(300, Math.round(1 + ratio * 299))) });
	};

	const onDown = (e) => {
		const r = ratioFromEvent(e);
		const dLow = Math.abs(r - low / 255);
		const dHigh = Math.abs(r - high / 255);
		const dGamma = Math.abs(r - (gamma - 1) / 299);
		const min = Math.min(dLow, dHigh, dGamma);
		if (min === dGamma) active.current = "gamma";
		else if (dLow === dHigh) active.current = r > low / 255 ? "high" : "low";
		else active.current = min === dLow ? "low" : "high";
		e.currentTarget.setPointerCapture(e.pointerId);
		apply(active.current, r);
	};

	const onMove = (e) => {
		if (!active.current) return;
		apply(active.current, ratioFromEvent(e));
	};

	const onUp = () => (active.current = null);

	const pos = (ratio) => `calc(${PAD}px + (100% - ${2 * PAD}px) * ${ratio})`;

	return (
		<div
			ref={ref}
			className="relative h-10 w-full touch-none select-none cursor-pointer"
			onPointerDown={onDown}
			onPointerMove={onMove}
			onPointerUp={onUp}
			onPointerCancel={onUp}
		>
			<div
				className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-white/30"
				style={{ left: PAD, right: PAD }}
			/>
			<div
				className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-blue-500"
				style={{
					left: pos(low / 255),
					width: `calc((100% - ${2 * PAD}px) * ${(high - low) / 255})`,
				}}
			/>
			<div
				className="absolute top-1/2 w-3 h-3 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"
				style={{ left: pos(low / 255) }}
			/>
			<div
				className="absolute top-1/2 w-3 h-3 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"
				style={{ left: pos(high / 255) }}
			/>
			<div
				className="absolute top-1/2 w-[3px] h-5 bg-white -translate-x-1/2 -translate-y-1/2"
				title="Gamma"
				style={{ left: pos((gamma - 1) / 299) }}
			/>
		</div>
	);
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
const ColorSpaceTool = () => {
	const [space, setSpace] = useState("RGB");
	const [applyFilter, setApplyFilter] = useState(true);
	const [channels, setChannels] = useState(() => [
		{ ...DEF_CHANNEL },
		{ ...DEF_CHANNEL },
		{ ...DEF_CHANNEL },
	]);
	const [clahe, setClahe] = useState(DEF_CLAHE);
	const [morph, setMorph] = useState(DEF_MORPH);
	const [mode, setMode] = useState("none"); // none | image | camera
	const [readouts, setReadouts] = useState({ 0: undefined, 2: undefined });
	const [saveFormat, setSaveFormat] = useState("png");

	// Refs (processing loop reads these so it never goes stale)
	const settings = useMemo(
		() => ({ space, applyFilter, channels, clahe, morph }),
		[space, applyFilter, channels, clahe, morph]
	);
	const settingsRef = useRef(settings);
	const dirty = useRef(true);
	const modeRef = useRef("none");
	const srcRef = useRef(null); // working-res ImageData
	const fullRef = useRef(null); // full-res canvas (static image)
	const fileNameRef = useRef("image");
	const resultRef = useRef(null);
	const canvasRefs = useRef([]);
	const histRefs = useRef([]);
	const videoRef = useRef(null);
	const streamRef = useRef(null);
	const fileInputRef = useRef(null);
	const posRef = useRef({ 0: null, 2: null });
	const frozenRef = useRef({ 0: null, 2: null });
	const readoutKey = useRef("");

	useEffect(() => {
		settingsRef.current = settings;
		dirty.current = true;
	}, [settings]);

	// Changing space invalidates stored (frozen) values
	useEffect(() => {
		[0, 2].forEach((i) => {
			if (frozenRef.current[i]) frozenRef.current[i].vals = null;
		});
	}, [space]);

	/* ---------- readouts ---------- */
	const updateReadouts = useCallback(() => {
		const res = resultRef.current;
		const next = {};
		[0, 2].forEach((idx) => {
			if (!res) {
				next[idx] = undefined;
				return;
			}
			const arrs = idx === 0 ? res.conv : res.convProc;
			const read = (x, y) => {
				const p = y * res.w + x;
				return [arrs[0][p], arrs[1][p], arrs[2][p]];
			};
			const fz = frozenRef.current[idx];
			if (fz) {
				if (!fz.vals) fz.vals = read(fz.x, fz.y);
				next[idx] = fz.vals;
			} else if (posRef.current[idx]) {
				const { x, y } = posRef.current[idx];
				next[idx] = x < res.w && y < res.h ? read(x, y) : null;
			} else next[idx] = null;
		});
		const key = JSON.stringify(next);
		if (key !== readoutKey.current) {
			readoutKey.current = key;
			setReadouts(next);
		}
	}, []);

	/* ---------- drawing ---------- */
	const draw = useCallback((res) => {
		const imgs = [res.rawRGBA, res.maskRGBA, res.procRGBA, ...res.chanRGBA];
		imgs.forEach((arr, i) => {
			const c = canvasRefs.current[i];
			if (!c) return;
			if (c.width !== res.w || c.height !== res.h) {
				c.width = res.w;
				c.height = res.h;
			}
			const ctx = c.getContext("2d");
			ctx.putImageData(new ImageData(arr, res.w, res.h), 0, 0);
			const fz = (i === 0 || i === 2) && frozenRef.current[i];
			if (fz) {
				const scale = Math.min(c.clientWidth / res.w, c.clientHeight / res.h) || 1;
				const size = 5 / scale;
				ctx.strokeStyle = "rgb(0,255,0)";
				ctx.lineWidth = 1 / scale;
				ctx.beginPath();
				ctx.moveTo(fz.x + 0.5 - size, fz.y + 0.5);
				ctx.lineTo(fz.x + 0.5 + size, fz.y + 0.5);
				ctx.moveTo(fz.x + 0.5, fz.y + 0.5 - size);
				ctx.lineTo(fz.x + 0.5, fz.y + 0.5 + size);
				ctx.stroke();
			}
		});
		const s = settingsRef.current;
		for (let i = 0; i < 3; i++) {
			drawHistogram(histRefs.current[i], res.hists[i], s.channels[i].min, s.channels[i].max);
		}
	}, []);

	/* ---------- main loop ---------- */
	useEffect(() => {
		let raf;
		let last = 0;
		const tick = (t) => {
			raf = requestAnimationFrame(tick);
			if (modeRef.current === "camera") {
				const v = videoRef.current;
				if (t - last < 30 || !v || v.readyState < 2 || !v.videoWidth) return;
				last = t;
				srcRef.current = grab(v, v.videoWidth, v.videoHeight, MAX_DIM);
				dirty.current = true;
			}
			if (!dirty.current || !srcRef.current) return;
			dirty.current = false;
			const res = runPipeline(srcRef.current, settingsRef.current);
			resultRef.current = res;
			draw(res);
			updateReadouts();
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [draw, updateReadouts]);

	/* ---------- source handling ---------- */
	const stopCamera = useCallback(() => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((t) => t.stop());
			streamRef.current = null;
		}
		if (videoRef.current) videoRef.current.srcObject = null;
	}, []);

	useEffect(() => stopCamera, [stopCamera]);

	const resetHover = () => {
		posRef.current = { 0: null, 2: null };
		frozenRef.current = { 0: null, 2: null };
	};

	const loadFile = (file) => {
		if (!file || !file.type.startsWith("image/")) return;
		stopCamera();
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const full = document.createElement("canvas");
			full.width = img.naturalWidth;
			full.height = img.naturalHeight;
			full.getContext("2d").drawImage(img, 0, 0);
			fullRef.current = full;
			fileNameRef.current = file.name.replace(/\.[^.]+$/, "");
			srcRef.current = grab(full, full.width, full.height, MAX_DIM);
			resetHover();
			modeRef.current = "image";
			setMode("image");
			dirty.current = true;
			URL.revokeObjectURL(url);
		};
		img.src = url;
	};

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			stopCamera();
			streamRef.current = stream;
			const v = videoRef.current;
			v.srcObject = stream;
			await v.play();
			fullRef.current = null;
			fileNameRef.current = "camera";
			resetHover();
			modeRef.current = "camera";
			setMode("camera");
		} catch {
			alert("ERROR: No Camera Detected.");
		}
	};

	/* ---------- saving ---------- */
	const snapshotCanvas = () => {
		if (modeRef.current === "image") return fullRef.current;
		const v = videoRef.current;
		if (modeRef.current === "camera" && v?.videoWidth) {
			const c = document.createElement("canvas");
			c.width = v.videoWidth;
			c.height = v.videoHeight;
			c.getContext("2d").drawImage(v, 0, 0);
			return c;
		}
		return null;
	};

	const saveRaw = () => {
		const snap = snapshotCanvas();
		if (!snap) return;
		downloadCanvas(snap, `${fileNameRef.current}_raw`, saveFormat);
	};

	const saveProcessed = () => {
		const snap = snapshotCanvas();
		if (!snap) return;
		const src = grab(snap, snap.width, snap.height, SAVE_MAX_DIM);
		const res = runPipeline(src, settingsRef.current);
		const out = document.createElement("canvas");
		out.width = res.w;
		out.height = res.h;
		out.getContext("2d").putImageData(new ImageData(res.procRGBA, res.w, res.h), 0, 0);
		downloadCanvas(out, `${fileNameRef.current}_processed`, saveFormat);
	};

	/* ---------- hover / freeze ---------- */
	const toImgCoords = (e, idx) => {
		const res = resultRef.current;
		const c = canvasRefs.current[idx];
		if (!res || !c) return null;
		const rect = c.getBoundingClientRect();
		const scale = Math.min(rect.width / res.w, rect.height / res.h);
		const offX = (rect.width - res.w * scale) / 2;
		const offY = (rect.height - res.h * scale) / 2;
		const x = Math.floor((e.clientX - rect.left - offX) / scale);
		const y = Math.floor((e.clientY - rect.top - offY) / scale);
		return {
			x: Math.max(0, Math.min(x, res.w - 1)),
			y: Math.max(0, Math.min(y, res.h - 1)),
		};
	};

	const onImgMove = (e, idx) => {
		if (frozenRef.current[idx]) return;
		const p = toImgCoords(e, idx);
		if (p) {
			posRef.current[idx] = p;
			updateReadouts();
		}
	};

	const onImgClick = (e, idx) => {
		if (!resultRef.current) return;
		if (frozenRef.current[idx]) {
			frozenRef.current[idx] = null;
		} else {
			const p = toImgCoords(e, idx);
			if (!p) return;
			posRef.current[idx] = p;
			frozenRef.current[idx] = { ...p, vals: null };
		}
		dirty.current = true;
		updateReadouts();
	};

	/* ---------- state helpers ---------- */
	const changeSpace = (s) => {
		setSpace(s);
		setChannels((ch) => ch.map((c) => ({ ...c, min: 0, max: 255 })));
	};
	const patchChannel = (i, patch) =>
		setChannels((ch) => ch.map((c, k) => (k === i ? { ...c, ...patch } : c)));
	const patchMorph = (patch) => setMorph((m) => ({ ...m, ...patch }));

	const resetAll = () => {
		setChannels([{ ...DEF_CHANNEL }, { ...DEF_CHANNEL }, { ...DEF_CHANNEL }]);
		setClahe(DEF_CLAHE);
		setMorph(DEF_MORPH);
	};

	const titleFor = (idx, base) => {
		const r = readouts[idx];
		if (r === undefined) return base;
		const n = CHANNEL_NAMES[space];
		const v = (k) => (r ? Math.round(r[k]) : "--");
		return `${base}   ${n[0]}:${v(0)}  ${n[1]}:${v(1)}  ${n[2]}:${v(2)}`;
	};

	const titles = [
		titleFor(0, "RAW"),
		"FILTER",
		titleFor(2, "PROCESSED"),
		...CHANNEL_DESCRIPTION[space],
	];

	const hasSource = mode !== "none";

	/* ---------- render ---------- */
	return (
		<div className="w-full flex flex-col gap-4 text-white text-sm">
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					loadFile(e.target.files?.[0]);
					e.target.value = "";
				}}
			/>
			<video
				ref={videoRef}
				muted
				playsInline
				className="absolute w-px h-px opacity-0 pointer-events-none"
			/>

			{/* Top bar */}
			<div className={`${boxCls} flex flex-wrap items-center gap-3`}>
				<label className="flex items-center gap-2">
					Select Color Space:
					<select
						value={space}
						onChange={(e) => changeSpace(e.target.value)}
						className={inputCls}
					>
						{SPACE_NAMES.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</label>
				<div className="flex-1" />
				<button className={btnCls} onClick={() => fileInputRef.current?.click()}>
					Load Image
				</button>
				<button className={btnCls} onClick={startCamera}>
					{mode === "camera" ? "Restart Camera" : "Connect Camera"}
				</button>
				<select
					value={saveFormat}
					onChange={(e) => setSaveFormat(e.target.value)}
					className={inputCls}
					title="Save format"
				>
					<option value="png">PNG</option>
					<option value="jpg">JPG</option>
				</select>
				<button className={btnCls} onClick={saveRaw} disabled={!hasSource}>
					Save Raw Image
				</button>
				<button className={btnCls} onClick={saveProcessed} disabled={!hasSource}>
					Save Processed Image
				</button>
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						checked={applyFilter}
						onChange={(e) => setApplyFilter(e.target.checked)}
						className="accent-blue-500"
					/>
					Apply Filter
				</label>
			</div>

			{/* 2x3 image grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{[0, 1, 2, 3, 4, 5].map((i) => {
					const interactive = i === 0 || i === 2;
					const ch = i - 3;
					return (
						<div key={i} className="flex flex-col gap-1 min-w-0">
							<div className="text-center font-bold text-[13px] min-h-[20px] whitespace-pre truncate">
								{titles[i]}
							</div>
							<div
								className="relative bg-black rounded-lg overflow-hidden"
								onDragOver={i === 0 ? (e) => e.preventDefault() : undefined}
								onDrop={
									i === 0
										? (e) => {
												e.preventDefault();
												loadFile(e.dataTransfer?.files?.[0]);
										  }
										: undefined
								}
							>
								<canvas
									ref={(el) => (canvasRefs.current[i] = el)}
									className={`block w-full h-[200px] object-contain ${
										interactive ? "cursor-crosshair" : ""
									}`}
									onMouseMove={interactive ? (e) => onImgMove(e, i) : undefined}
									onClick={interactive ? (e) => onImgClick(e, i) : undefined}
								/>
								{i === 0 && !hasSource && (
									<button
										onClick={() => fileInputRef.current?.click()}
										className="absolute inset-0 flex items-center justify-center text-center text-secondary px-4 border-2 border-dashed border-gray-600 rounded-lg"
									>
										Drag & drop an image here, or click to select
										<br />
										or connect a camera
									</button>
								)}
							</div>

							{i >= 3 && (
								<div className="flex flex-col gap-1">
									<canvas
										ref={(el) => (histRefs.current[ch] = el)}
										width={256}
										height={60}
										className="w-full h-[60px] rounded bg-[#191919]"
									/>
									<RangeSlider
										low={channels[ch].min}
										high={channels[ch].max}
										gamma={channels[ch].gamma}
										onChange={(p) => patchChannel(ch, p)}
									/>
									<div className="flex items-end justify-between gap-2">
										<label className="flex items-center gap-1">
											Min
											<NumInput
												value={channels[ch].min}
												min={0}
												max={channels[ch].max}
												onChange={(v) => patchChannel(ch, { min: v })}
											/>
										</label>
										<label className="flex flex-col items-center gap-0.5">
											Gamma
											<NumInput
												value={channels[ch].gamma}
												min={1}
												max={300}
												onChange={(v) => patchChannel(ch, { gamma: v })}
											/>
										</label>
										<label className="flex items-center gap-1">
											<NumInput
												value={channels[ch].max}
												min={channels[ch].min}
												max={255}
												onChange={(v) => patchChannel(ch, { max: v })}
											/>
											Max
										</label>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* CLAHE */}
			<div className={`${boxCls} flex flex-col gap-2`}>
				<div className="text-center font-bold text-[13px]">
					Histogram Equalization (CLAHE)
				</div>
				<div className="flex flex-wrap items-center gap-x-5 gap-y-2">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={clahe.on}
							onChange={(e) => setClahe({ ...clahe, on: e.target.checked })}
							className="accent-blue-500"
						/>
						Apply CLAHE
					</label>
					<label className="flex items-center gap-2">
						Grid Size:
						<select
							value={clahe.tile}
							onChange={(e) => setClahe({ ...clahe, tile: +e.target.value })}
							className={inputCls}
						>
							{[1, 2, 4, 8, 16, 32, 64].map((t) => (
								<option key={t} value={t}>
									{t}x{t}
								</option>
							))}
						</select>
					</label>
					<div className="flex items-center gap-2 flex-1 min-w-[220px]">
						Clip Limit:
						<NumInput
							value={clahe.clip}
							min={1}
							max={100}
							onChange={(v) => setClahe({ ...clahe, clip: v })}
							className="w-20"
						/>
						<input
							type="range"
							min={1}
							max={100}
							value={clahe.clip}
							onChange={(e) => setClahe({ ...clahe, clip: +e.target.value })}
							className="flex-1 accent-blue-500"
						/>
					</div>
				</div>
			</div>

			{/* Morphology */}
			<div className={`${boxCls} flex flex-col gap-2`}>
				<div className="text-center font-bold text-[13px]">
					Morphological Operators (For Binary Filter)
				</div>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
					<div className="flex flex-wrap items-center gap-2">
						Kernel Shape:
						<select
							value={morph.size}
							onChange={(e) => patchMorph({ size: +e.target.value })}
							className={inputCls}
						>
							{[1, 3, 5, 7, 9, 11, 13, 15].map((k) => (
								<option key={k} value={k}>
									{k}x{k}
								</option>
							))}
						</select>
						<select
							value={morph.shape}
							onChange={(e) => patchMorph({ shape: e.target.value })}
							className={inputCls}
						>
							{["Rectangle", "Ellipse", "Cross"].map((s) => (
								<option key={s}>{s}</option>
							))}
						</select>
						<span className="ml-2">Iterations:</span>
						<NumInput
							value={morph.iterations}
							min={1}
							max={10}
							onChange={(v) => patchMorph({ iterations: v })}
							className="w-16"
						/>
					</div>
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1">
						{MORPH_OPS.map(([key, label]) => (
							<label key={key} className="flex items-center gap-1.5 cursor-pointer">
								<input
									type="checkbox"
									checked={morph[key]}
									onChange={(e) => patchMorph({ [key]: e.target.checked })}
									className="accent-blue-500"
								/>
								{label}
							</label>
						))}
					</div>
				</div>
			</div>

			<button className={`${btnCls} py-2`} onClick={resetAll}>
				Reset
			</button>
		</div>
	);
};

export default ColorSpaceTool;
