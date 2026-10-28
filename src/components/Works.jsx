import React, {
	useRef,
	useEffect,
	useMemo,
	useState,
	useCallback,
} from "react";

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// -------------------------------------------------
// SETTINGS
// -------------------------------------------------

const SCROLL_SPEED = 35;

// -------------------------------------------------
// Lazy Image
// -------------------------------------------------

const LazyImage = React.memo(({ src, alt, className }) => (
	<img
		src={src}
		alt={alt}
		className={`${className} select-none pointer-events-none`}
		loading="lazy"
		decoding="async"
		draggable={false}
	/>
));

// -------------------------------------------------
// Project Card
// -------------------------------------------------

const ProjectCard = React.memo(
	({ name, date, description, tags, image, source_code_link }) => (
		<div
			className="
				bg-tertiary
				p-3 sm:p-4 lg:p-5
				rounded-2xl
				w-[calc(100vw-3rem)]
				max-w-[360px]
				sm:w-[340px]
				lg:w-[360px]
				flex-shrink-0
				flex flex-col
			"
		>
			<div className="relative w-full h-[160px] sm:h-[200px] lg:h-[230px]">
				<LazyImage
					src={image}
					alt={name}
					className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
				/>
			</div>

			<div className="mt-3 sm:mt-5">
				<h3
					className="
						text-white font-bold
						text-lg sm:text-xl lg:text-2xl
						min-h-[3.5rem] sm:min-h-[4rem] lg:min-h-[4.5rem]
					"
				>
					{name}
				</h3>

				<div className="mt-1 flex flex-wrap items-center justify-between gap-2">
					<p className="text-secondary text-xs sm:text-sm italic">
						{date}
					</p>

					{source_code_link && (
						<a
							href={source_code_link}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm"
						>
							Explore more...
						</a>
					)}
				</div>

				<p className="mt-2 text-secondary text-xs sm:text-sm leading-relaxed">
					{description}
				</p>
			</div>

			<div className="mt-auto pt-4 sm:pt-4 flex flex-wrap gap-5">
				{tags.map((tag) => (
					<p key={tag.name} className={`text-xs sm:text-sm ${tag.color}`}>
						{tag.name}
					</p>
				))}
			</div>
		</div>
	),
);

// -------------------------------------------------
// Works
// -------------------------------------------------

const Works = () => {
	const containerRef = useRef(null);
	const trackRef = useRef(null);
	const halfWidthRef = useRef(0);

	const x = useMotionValue(0);

	const [isHovered, setIsHovered] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	const pointerStartX = useRef(0);
	const dragStartX = useRef(0);

	// -------------------------------------------------
	// Duplicate projects
	// -------------------------------------------------

	const projectList = useMemo(
		() =>
			[...projects, ...projects].map((p, i) => (
				<ProjectCard key={`${p.name}-${i}`} {...p} />
			)),
		[],
	);

	// -------------------------------------------------
	// Measure track
	// -------------------------------------------------

	const updateWidth = useCallback(() => {
		const track = trackRef.current;

		if (!track) return;

		halfWidthRef.current = track.scrollWidth / 2;
	}, []);

	useEffect(() => {
		updateWidth();

		const resizeObserver = new ResizeObserver(updateWidth);

		if (trackRef.current) {
			resizeObserver.observe(trackRef.current);
		}

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		window.addEventListener("resize", updateWidth);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", updateWidth);
		};
	}, [updateWidth]);

	// -------------------------------------------------
	// Visibility
	// -------------------------------------------------

	useEffect(() => {
		const element = containerRef.current;

		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{ threshold: 0.1 },
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, []);

	// -------------------------------------------------
	// Infinite wrapping
	// -------------------------------------------------

	const wrapX = useCallback((value) => {
		const width = halfWidthRef.current;

		if (!width) return value;

		if (value <= -width) return value + width;

		if (value >= 0) return value - width;

		return value;
	}, []);

	// -------------------------------------------------
	// Automatic scrolling
	// -------------------------------------------------

	useAnimationFrame((_, delta) => {
		if (isHovered || isDragging || !isVisible) return;

		const movement = (SCROLL_SPEED * delta) / 1000;

		x.set(wrapX(x.get() - movement));
	});

	// -------------------------------------------------
	// Pointer handlers
	// -------------------------------------------------

	const handlePointerDown = (event) => {
		if (event.pointerType === "mouse" && event.button !== 0) {
			return;
		}

		setIsDragging(true);
		pointerStartX.current = event.clientX;
		dragStartX.current = x.get();

		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const handlePointerMove = (event) => {
		if (!isDragging) return;

		const deltaX = event.clientX - pointerStartX.current;

		x.set(wrapX(dragStartX.current + deltaX));
	};

	const handlePointerUp = (event) => {
		if (!isDragging) return;

		setIsDragging(false);

		try {
			event.currentTarget.releasePointerCapture(event.pointerId);
		} catch {
			// Pointer capture may already be released.
		}
	};

	const handlePointerCancel = () => {
		setIsDragging(false);
	};

	// -------------------------------------------------
	// Render
	// -------------------------------------------------

	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Work</h2>

				<p className={styles.sectionSubText}>
					Endless innovation.
				</p>
			</motion.div>

			<motion.div variants={fadeIn("", "", 0.1, 1)}>
				<div
					ref={containerRef}
					className="mt-6 sm:mt-10 relative overflow-hidden w-full"
				>
					<motion.div
						ref={trackRef}
						className={`
							work-track
							flex items-stretch
							gap-3 sm:gap-5 lg:gap-7
							py-3 sm:py-5
							select-none
							${isDragging ? "cursor-grabbing" : "cursor-grab"}
						`}
						style={{
							x,
							width: "max-content",
							willChange: "transform",
							transform: "translateZ(0)",
							backfaceVisibility: "hidden",
						}}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerCancel}
					>
						{projectList}
					</motion.div>
				</div>
			</motion.div>

			<style>
				{`
					.work-track {
						backface-visibility: hidden;
						-webkit-backface-visibility: hidden;
						touch-action: pan-y;
					}

					.work-track > * {
						contain: layout paint;
					}
				`}
			</style>
		</>
	);
};

export default SectionWrapper(Works, "work");
