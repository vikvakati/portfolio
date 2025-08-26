// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { slideIn } from "../utils/motion";
// import { styles } from "../styles";
// import { SectionWrapper } from "../hoc";
// import { logo } from "../assets";

// const LunarLander = () => {
// 	const canvasRef = useRef(null);
// 	const landerRef = useRef(null);
// 	const gameStateRef = useRef("waiting");
// 	const [gameState, setGameState] = useState("waiting");
// 	const fuelRef = useRef(200);
// 	const scoreRef = useRef(0);
// 	const highScoreRef = useRef(
// 		parseInt(localStorage.getItem("landerHighScore") || "0")
// 	);
// 	const crashTimerRef = useRef(null);
// 	const flashStateRef = useRef(false);
// 	const successFlashRef = useRef(false);
// 	const landedBufferRef = useRef(false);
// 	const flagProgressRef = useRef(0);
// 	const keys = useRef({});
// 	const flagAnimRef = useRef(null);
// 	const logoImgRef = useRef(new Image());

// 	const MAX_FUEL = 200;
// 	logoImgRef.current.src = logo;

// 	useEffect(() => {
// 		const canvas = canvasRef.current;
// 		const ctx = canvas.getContext("2d");
// 		const gravity = 0.0002;
// 		const thrustPower = 0.0005;
// 		const rotationSpeed = 0.002;

// 		// Lunar surface with multipliers (x positions, y will be recalculated)
// 		const lunarSurface = [
// 			{ x: 50, y: 0, width: 60, multiplier: 2 },
// 			{ x: 120, y: 0, width: 120, multiplier: 1 },
// 			{ x: 260, y: 0, width: 80, multiplier: 1.5 },
// 			{ x: 360, y: 0, width: 100, multiplier: 1 },
// 		];

// 		const landingPad = () => {
// 			return lunarSurface.find(
// 				(pad) =>
// 					landerRef.current?.x > pad.x &&
// 					landerRef.current?.x < pad.x + pad.width
// 			);
// 		};

// 		// Responsive canvas
// 		const resizeCanvas = () => {
// 			const width = Math.min(window.innerWidth * 0.95, 500);
// 			const height = Math.min(window.innerHeight * 0.6, 500);
// 			canvas.width = width;
// 			canvas.height = height;

// 			// Recalculate pad positions
// 			const padYFractions = [0.9, 0.85, 0.88, 0.87]; // fractions of canvas height
// 			lunarSurface.forEach((pad, i) => {
// 				pad.y = canvas.height * padYFractions[i];
// 				pad.x = Math.min(pad.x, canvas.width - pad.width - 10);
// 			});

// 			if (landerRef.current) {
// 				landerRef.current.x = canvas.width / 2;
// 				landerRef.current.y = 100;
// 			}
// 		};
// 		resizeCanvas();
// 		window.addEventListener("resize", resizeCanvas);

// 		let lastTime = performance.now();
// 		let animationId;
// 		let lastTouchX = null;

// 		const initLander = (keepFuel = true) => {
// 			landerRef.current = {
// 				x: canvas.width / 2,
// 				y: 100,
// 				vx: 0,
// 				vy: 0,
// 				angle: 0,
// 				fuel: keepFuel ? fuelRef.current : MAX_FUEL,
// 				alive: true,
// 				landed: false,
// 			};
// 			fuelRef.current = landerRef.current.fuel;
// 		};
// 		initLander();

// 		const resetAfterCrash = () => {
// 			if (crashTimerRef.current) clearInterval(crashTimerRef.current);
// 			fuelRef.current = MAX_FUEL;
// 			scoreRef.current = 0;
// 			keys.current = {};
// 			lastTime = performance.now();
// 			gameStateRef.current = "waiting";
// 			setGameState("waiting");
// 			landedBufferRef.current = false;
// 			flagProgressRef.current = 0;
// 			flashStateRef.current = false;
// 			successFlashRef.current = false;
// 			initLander(false);
// 		};

// 		const startGameIfWaiting = () => {
// 			if (landedBufferRef.current) return;
// 			if (
// 				gameStateRef.current === "waiting" ||
// 				gameStateRef.current === "landed"
// 			) {
// 				lastTime = performance.now();
// 				gameStateRef.current = "playing";
// 				setGameState("playing");
// 				flagProgressRef.current = 0;
// 				successFlashRef.current = false;
// 				initLander(true);
// 			}
// 		};

// 		// Keyboard
// 		const handleKeyDown = (e) => {
// 			if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.code)) {
// 				keys.current[e.code] = true;
// 				e.preventDefault();
// 			}
// 		};
// 		const handleKeyUp = (e) => {
// 			if (["ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.code)) {
// 				keys.current[e.code] = false;
// 				e.preventDefault();
// 			}
// 		};

// 		// Mouse/touch
// 		const handlePressStart = (e) => {
// 			if (!landedBufferRef.current) startGameIfWaiting();
// 			keys.current["ArrowUp"] = true;
// 			e.preventDefault();
// 		};
// 		const handlePressEnd = () => (keys.current["ArrowUp"] = false);
// 		const handleClick = () => {
// 			if (!landedBufferRef.current) startGameIfWaiting();
// 		};

// 		// Mobile drag rotation
// 		const handleTouchMove = (e) => {
// 			if (!landerRef.current) return;
// 			const touch = e.touches[0];
// 			if (lastTouchX !== null) {
// 				const deltaX = touch.clientX - lastTouchX;
// 				landerRef.current.angle += deltaX * 0.01; // increased sensitivity
// 			}
// 			lastTouchX = touch.clientX;
// 			e.preventDefault();
// 		};
// 		const handleTouchEndRotate = () => {
// 			lastTouchX = null;
// 		};

// 		const update = (delta) => {
// 			const lander = landerRef.current;
// 			if (
// 				!lander ||
// 				!lander.alive ||
// 				lander.landed ||
// 				gameStateRef.current !== "playing"
// 			)
// 				return;

// 			if (keys.current["ArrowLeft"]) lander.angle -= rotationSpeed * delta;
// 			if (keys.current["ArrowRight"]) lander.angle += rotationSpeed * delta;

// 			if (keys.current["ArrowUp"] && lander.fuel > 0) {
// 				lander.vx += Math.sin(lander.angle) * thrustPower * delta;
// 				lander.vy -= Math.cos(lander.angle) * thrustPower * delta;
// 				lander.fuel -= 0.05 * delta;
// 				fuelRef.current = lander.fuel;
// 			}

// 			lander.vy += gravity * delta;
// 			lander.x += lander.vx * delta;
// 			lander.y += lander.vy * delta;

// 			const pad = landingPad();
// 			if (!pad) return;
// 			const shipBottomY = lander.y + 10;

// 			if (shipBottomY >= pad.y) {
// 				if (Math.abs(lander.vy) < 0.1) {
// 					lander.landed = true;
// 					lander.y = pad.y - 10;
// 					lander.vy = 0;
// 					scoreRef.current += pad.multiplier;
// 					if (scoreRef.current > highScoreRef.current) {
// 						highScoreRef.current = scoreRef.current;
// 						localStorage.setItem("landerHighScore", highScoreRef.current);
// 					}

// 					gameStateRef.current = "landed";
// 					setGameState("landed");
// 					successFlashRef.current = true;

// 					landedBufferRef.current = true;
// 					flagProgressRef.current = 0;
// 					const startTime = performance.now();
// 					const animateFlag = (time) => {
// 						const elapsed = time - startTime;
// 						flagProgressRef.current = Math.min(elapsed / 500, 0.5);
// 						if (elapsed < 500) {
// 							flagAnimRef.current = requestAnimationFrame(animateFlag);
// 						} else {
// 							flagAnimRef.current = null;
// 							landedBufferRef.current = false;
// 						}
// 					};
// 					flagAnimRef.current = requestAnimationFrame(animateFlag);
// 				} else {
// 					lander.alive = false;
// 					gameStateRef.current = "crashed";
// 					setGameState("crashed");
// 					crashTimerRef.current = setInterval(
// 						() => (flashStateRef.current = !flashStateRef.current),
// 						150
// 					);
// 					landedBufferRef.current = true;

// 					setTimeout(() => {
// 						clearInterval(crashTimerRef.current);
// 						crashTimerRef.current = null;
// 						resetAfterCrash();
// 					}, 3000);
// 				}
// 			}
// 		};

// 		const draw = () => {
// 			ctx.fillStyle = "black";
// 			ctx.fillRect(0, 0, canvas.width, canvas.height);

// 			// Draw lunar surface and multipliers
// 			ctx.fillStyle = "white";
// 			lunarSurface.forEach((pad) => {
// 				ctx.fillRect(pad.x, pad.y, pad.width, 5);
// 				ctx.fillStyle = "yellow";
// 				ctx.font = "14px Arial";
// 				ctx.fillText(
// 					`x${pad.multiplier}`,
// 					pad.x + pad.width / 2 - 10,
// 					pad.y + 20
// 				);
// 				ctx.fillStyle = "white";
// 			});

// 			if (gameStateRef.current === "landed" && logoImgRef.current.complete) {
// 				const pad = landingPad();
// 				if (pad) {
// 					const logoWidth = 80;
// 					const logoHeight = 80;
// 					const yOffset = 50 * flagProgressRef.current;
// 					ctx.drawImage(
// 						logoImgRef.current,
// 						pad.x + pad.width / 2 - logoWidth / 2,
// 						pad.y - logoHeight - yOffset,
// 						logoWidth,
// 						logoHeight
// 					);
// 				}
// 			}

// 			const lander = landerRef.current;
// 			if (lander) {
// 				ctx.save();
// 				ctx.translate(lander.x, lander.y);
// 				ctx.rotate(lander.angle);
// 				ctx.fillStyle =
// 					gameStateRef.current === "crashed"
// 						? flashStateRef.current
// 							? "white"
// 							: "red"
// 						: successFlashRef.current
// 						? "green"
// 						: "white";

// 				ctx.beginPath();
// 				ctx.moveTo(0, -10);
// 				ctx.lineTo(6, 10);
// 				ctx.lineTo(-6, 10);
// 				ctx.closePath();
// 				ctx.fill();

// 				if (
// 					keys.current["ArrowUp"] &&
// 					lander.fuel > 0 &&
// 					lander.alive &&
// 					!lander.landed
// 				) {
// 					ctx.fillStyle = "orange";
// 					ctx.beginPath();
// 					ctx.moveTo(-4, 10);
// 					ctx.lineTo(0, 18 + Math.random() * 4);
// 					ctx.lineTo(4, 10);
// 					ctx.closePath();
// 					ctx.fill();
// 				}
// 				ctx.restore();

// 				ctx.fillStyle = "yellow";
// 				ctx.fillRect(10, 10, (Math.max(0, lander.fuel) / MAX_FUEL) * 200, 10);
// 				ctx.strokeStyle = "white";
// 				ctx.strokeRect(10, 10, 200, 10);

// 				ctx.fillStyle = "white";
// 				ctx.font = "16px Arial";
// 				ctx.fillText(`Score: ${scoreRef.current}`, 10, 40);
// 				ctx.fillText(`High Score: ${highScoreRef.current}`, 10, 60);
// 			}

// 			ctx.fillStyle = "white";
// 			ctx.font = "16px Arial";
// 			if (gameStateRef.current === "waiting")
// 				ctx.fillText(
// 					"TAP / CLICK TO START",
// 					canvas.width / 2 - 80,
// 					canvas.height / 2
// 				);
// 			else if (gameStateRef.current === "landed")
// 				ctx.fillText(
// 					"LANDED! TAP / CLICK TO CONTINUE",
// 					canvas.width / 2 - 110,
// 					canvas.height / 2
// 				);
// 			else if (gameStateRef.current === "crashed")
// 				ctx.fillText("CRASHED!", canvas.width / 2 - 40, canvas.height / 2);
// 		};

// 		const loop = (time) => {
// 			const delta = time - lastTime;
// 			lastTime = time;
// 			update(delta);
// 			draw();
// 			animationId = requestAnimationFrame(loop);
// 		};
// 		loop(lastTime);

// 		// Event listeners
// 		document.addEventListener("keydown", handleKeyDown);
// 		document.addEventListener("keyup", handleKeyUp);
// 		canvas.addEventListener("touchstart", handlePressStart);
// 		canvas.addEventListener("touchend", handlePressEnd);
// 		canvas.addEventListener("mousedown", handlePressStart);
// 		canvas.addEventListener("mouseup", handlePressEnd);
// 		canvas.addEventListener("click", handleClick);
// 		canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
// 		canvas.addEventListener("touchcancel", handleTouchEndRotate);

// 		return () => {
// 			document.removeEventListener("keydown", handleKeyDown);
// 			document.removeEventListener("keyup", handleKeyUp);
// 			canvas.removeEventListener("touchstart", handlePressStart);
// 			canvas.removeEventListener("touchend", handlePressEnd);
// 			canvas.removeEventListener("mousedown", handlePressStart);
// 			canvas.removeEventListener("mouseup", handlePressEnd);
// 			canvas.removeEventListener("click", handleClick);
// 			canvas.removeEventListener("touchmove", handleTouchMove);
// 			canvas.removeEventListener("touchcancel", handleTouchEndRotate);
// 			cancelAnimationFrame(animationId);
// 			if (crashTimerRef.current) clearInterval(crashTimerRef.current);
// 			if (flagAnimRef.current) cancelAnimationFrame(flagAnimRef.current);
// 			window.removeEventListener("resize", resizeCanvas);
// 		};
// 	}, []);

// 	return (
// 		<div className="xl:mt-12 xl:flex-row flex justify-center gap-10 flex-col items-center">
// 			<motion.div
// 				variants={slideIn("up", "tween", 0.2, 1)}
// 				className="flex-[0.75] w-full bg-black-100 p-8 rounded-2xl"
// 			>
// 				<h3 className={styles.sectionHeadText}>Lunar Lander</h3>
// 				<p className={styles.sectionSubText}>Stay a while.</p>
// 				<div className="flex justify-center w-full">
// 					<canvas
// 						ref={canvasRef}
// 						className="rounded-2xl border border-gray-500 cursor-pointer w-full max-w-[500px]"
// 					/>
// 				</div>
// 				<p className="text-center text-white mt-2">
// 					Controls: ← → Rotate, ↑ Thrust, Drag to rotate on mobile, Tap / Click
// 					to Start
// 				</p>
// 			</motion.div>
// 		</div>
// 	);
// };

// export default SectionWrapper(LunarLander, "lunar-lander");
