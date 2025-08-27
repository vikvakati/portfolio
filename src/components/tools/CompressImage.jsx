import { useState, useEffect, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";

const CompressImage = () => {
	const [originalFile, setOriginalFile] = useState(null);
	const [compressedFile, setCompressedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [quality, setQuality] = useState(1.0);
	const [reduction, setReduction] = useState(null);
	const [isInitialLoading, setIsInitialLoading] = useState(false);
	const [isSliderCompressing, setIsSliderCompressing] = useState(false);

	const fileInputRef = useRef(null);
	const currentPreviewUrl = useRef(null);
	const compressionAbort = useRef(0);
	const sliderTimeout = useRef(null);

	const setSafePreview = useCallback((file) => {
		if (!file) return;
		if (currentPreviewUrl.current)
			URL.revokeObjectURL(currentPreviewUrl.current);
		currentPreviewUrl.current = URL.createObjectURL(file);
		setPreviewUrl(currentPreviewUrl.current);
	}, []);

	const compressFile = useCallback(async (file, q) => {
		if (!file) return null;
		return await imageCompression(file, {
			maxSizeMB: 2,
			maxWidthOrHeight: 2048,
			useWebWorker: true,
			initialQuality: q,
		});
	}, []);

	const findMaxQuality = useCallback(
		async (file) => {
			let low = 0.1,
				high = 1.0,
				best = 0.1;

			while (high - low > 0.05) {
				const mid = (low + high) / 2;
				const compressed = await compressFile(file, mid);
				if (compressed.size <= file.size) {
					best = mid;
					low = mid;
				} else {
					high = mid;
				}
			}

			low = Math.max(best - 0.05, 0.1);
			high = Math.min(best + 0.05, 1.0);
			while (high - low > 0.01) {
				const mid = (low + high) / 2;
				const compressed = await compressFile(file, mid);
				if (compressed.size <= file.size) {
					best = mid;
					low = mid;
				} else {
					high = mid;
				}
			}

			const finalTest = await compressFile(file, 1.0);
			if (finalTest.size <= file.size) best = 1.0;

			return best;
		},
		[compressFile]
	);

	const updateCompression = useCallback(
		async (file, q) => {
			if (!file) return;
			const id = ++compressionAbort.current;

			try {
				const compressed = await compressFile(file, q);
				if (id === compressionAbort.current) {
					setCompressedFile(compressed);
					setSafePreview(compressed);
					const percent = ((file.size - compressed.size) / file.size) * 100;
					setReduction(percent.toFixed(0));
				}
			} catch (err) {
				console.error("Compression error:", err);
			}
		},
		[compressFile, setSafePreview]
	);

	const handleNewFile = useCallback(
		async (file) => {
			if (!file) return;
			setIsInitialLoading(true);
			setOriginalFile(file);

			try {
				const bestQuality = await findMaxQuality(file);
				setQuality(bestQuality);
				await updateCompression(file, bestQuality);
			} finally {
				setIsInitialLoading(false);
			}
		},
		[findMaxQuality, updateCompression]
	);

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const allowed = ["image/jpeg", "image/png", "image/gif"];
		if (!allowed.includes(file.type)) {
			alert("Only JPG, PNG, or GIF allowed.");
			return;
		}

		handleNewFile(file);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer?.files?.[0];
		if (file) handleNewFile(file);
	};

	const handleDragOver = (e) => e.preventDefault();

	const downloadCompressed = () => {
		if (
			!compressedFile ||
			!originalFile ||
			compressedFile.size >= originalFile.size
		)
			return;
		const url = URL.createObjectURL(compressedFile);
		const link = document.createElement("a");
		link.href = url;
		link.download = `compressed_${originalFile.name}`;
		link.click();
		URL.revokeObjectURL(url);
	};

	const canDownload =
		compressedFile && originalFile && compressedFile.size < originalFile.size;

	useEffect(() => {
		if (!originalFile) return;
		if (sliderTimeout.current) clearTimeout(sliderTimeout.current);

		setIsSliderCompressing(true);

		sliderTimeout.current = setTimeout(async () => {
			try {
				await updateCompression(originalFile, quality);
			} finally {
				setIsSliderCompressing(false);
			}
		}, 150);

		return () => clearTimeout(sliderTimeout.current);
	}, [quality, originalFile, updateCompression]);

	const isCompressing = isInitialLoading || isSliderCompressing;

	return (
		<div className="flex flex-col items-center mt-2 w-full max-w-5xl">
			<input
				type="file"
				accept=".jpg,.jpeg,.png,.gif"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
			/>

			<div className="flex flex-col md:flex-row w-full min-h-[500px]">
				<div className="flex flex-1 flex-col items-center justify-center">
					{previewUrl ? (
						<div
							className="relative w-full rounded-2xl overflow-hidden flex items-center justify-center bg-gray-900 cursor-pointer"
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onClick={() => fileInputRef.current?.click()}
						>
							{isCompressing && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
									<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
								</div>
							)}
							<img
								src={previewUrl}
								alt="Preview"
								className="max-h-[550px] w-auto object-contain rounded-lg pointer-events-none"
							/>
						</div>
					) : (
						<div
							className="relative w-full h-[300px] rounded-2xl border-2 border-dashed border-gray-600 bg-gray-800/50 flex items-center justify-center cursor-pointer"
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onClick={() => fileInputRef.current?.click()}
						>
							{isCompressing && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
									<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
								</div>
							)}
							<p className="text-secondary text-center">
								Drag & drop an image here, or click to select
								<br />
								(JPG, PNG, GIF)
							</p>
						</div>
					)}

					{originalFile && (
						<div className="flex flex-col items-center w-full mt-6">
							<span className="text-white text-sm mb-1">
								Quality: {(quality * 100).toFixed(0)}%
							</span>
							<input
								type="range"
								min="0.1"
								max="1"
								step="0.01"
								value={quality}
								onChange={(e) => setQuality(parseFloat(e.target.value))}
								className="w-full"
							/>
						</div>
					)}
				</div>

				{compressedFile && originalFile && (
					<div className="flex flex-row items-center justify-center md:justify-end w-full md:w-[220px] text-white text-sm">
						<div className="flex flex-col items-center">
							<div className="space-y-1 mb-6 text-center">
								<p>Original: {(originalFile.size / 1024).toFixed(2)} KB</p>
								<p>Compressed: {(compressedFile.size / 1024).toFixed(2)} KB</p>
							</div>
							<button
								onClick={downloadCompressed}
								disabled={!canDownload}
								className={`px-6 py-2 rounded transition font-medium ${
									canDownload
										? "bg-blue-500 hover:bg-blue-600"
										: "bg-gray-600 cursor-not-allowed"
								}`}
							>
								Download {canDownload ? `(-${reduction}%)` : "(N/A)"}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CompressImage;
