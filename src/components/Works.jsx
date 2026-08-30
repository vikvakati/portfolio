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

// Pixels per second
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
		<div className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full flex-shrink-0 flex flex-col">
			<div className="relative w-full h-[230px]">
				<LazyImage
					src={image}
					alt={name}
					className="w-full h-full object-cover rounded-2xl"
				/>
			</div>

			<div className="mt-5">
				<h3 className="text-white font-bold text-[24px] h-[4.5rem]">{name}</h3>

				<div className="mt-1 flex items-center justify-between">
					<p className="text-secondary text-[14px] italic">{date}</p>

					{source_code_link && (
						<a
							href={source_code_link}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:text-blue-300 transition-colors text-[14px]"
						>
							Explore more...
						</a>
					)}
				</div>

				<p className="mt-2 text-secondary text-[14px]">{description}</p>
			</div>

			<div className="mt-auto pt-4 flex flex-wrap gap-2">
				{tags.map((tag) => (
					<p key={tag.name} className={`text-[14px] ${tag.color}`}>
						{tag.name}&emsp;
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
	// -------------------------------------------------
	// Refs
	// -------------------------------------------------

	const containerRef = useRef(null);
	const trackRef = useRef(null);

	const halfWidthRef = useRef(0);

	// -------------------------------------------------
	// Motion value
	// -------------------------------------------------

	/*
	 * THIS is the only thing controlling horizontal
	 * position.
	 */
	const x = useMotionValue(0);

	// -------------------------------------------------
	// State
	// -------------------------------------------------

	const [isHovered, setIsHovered] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	// -------------------------------------------------
	// Drag tracking
	// -------------------------------------------------

	const pointerStartX = useRef(0);
	const dragStartX = useRef(0);

	// -------------------------------------------------
	// Duplicate projects
	// -------------------------------------------------

	const projectList = useMemo(() => {
		return [...projects, ...projects].map((p, i) => (
			<ProjectCard key={`${p.name}-${i}`} {...p} />
		));
	}, []);

	// -------------------------------------------------
	// Measure track
	// -------------------------------------------------

	const updateWidth = useCallback(() => {
		const track = trackRef.current;

		if (!track) return;

		/*
		 * Since projects are duplicated:
		 *
		 * total width / 2
		 *
		 * is the distance of one complete set.
		 */
		halfWidthRef.current = track.scrollWidth / 2;
	}, []);

	useEffect(() => {
		updateWidth();

		const resizeObserver = new ResizeObserver(updateWidth);

		if (trackRef.current) {
			resizeObserver.observe(trackRef.current);
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
			{
				threshold: 0.1,
			},
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, []);

	// -------------------------------------------------
	// Infinite wrapping
	// -------------------------------------------------

	const wrapX = useCallback((value) => {
		const width = halfWidthRef.current;

		if (!width) {
			return value;
		}

		/*
		 * Moving left past one complete set.
		 */
		if (value <= -width) {
			return value + width;
		}

		/*
		 * Moving right past the starting point.
		 */
		if (value >= 0) {
			return value - width;
		}

		return value;
	}, []);

	// -------------------------------------------------
	// Automatic scrolling
	// -------------------------------------------------

	useAnimationFrame((_, delta) => {
		/*
		 * STOP automatic scrolling when:
		 *
		 * 1. Mouse is over carousel
		 * 2. User is dragging
		 * 3. Carousel isn't visible
		 */
		if (isHovered || isDragging || !isVisible) {
			return;
		}

		const currentX = x.get();

		/*
		 * Convert pixels/second into movement
		 * for this frame.
		 */
		const movement = (SCROLL_SPEED * delta) / 1000;

		const nextX = currentX - movement;

		/*
		 * Update the SAME motion value used
		 * by the rendered transform.
		 */
		x.set(wrapX(nextX));
	});

	// -------------------------------------------------
	// Mouse enter
	// -------------------------------------------------

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	// -------------------------------------------------
	// Mouse leave
	// -------------------------------------------------

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	// -------------------------------------------------
	// Pointer down
	// -------------------------------------------------

	const handlePointerDown = (event) => {
		/*
		 * Only respond to primary mouse button.
		 */
		if (event.pointerType === "mouse" && event.button !== 0) {
			return;
		}

		setIsDragging(true);

		pointerStartX.current = event.clientX;

		dragStartX.current = x.get();

		/*
		 * Capture the pointer so dragging continues
		 * even if the cursor leaves the element.
		 */
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	// -------------------------------------------------
	// Pointer move
	// -------------------------------------------------

	const handlePointerMove = (event) => {
		if (!isDragging) {
			return;
		}

		const deltaX = event.clientX - pointerStartX.current;

		const nextX = dragStartX.current + deltaX;

		/*
		 * Apply wrapping while dragging.
		 */
		x.set(wrapX(nextX));
	};

	// -------------------------------------------------
	// Pointer up
	// -------------------------------------------------

	const handlePointerUp = (event) => {
		if (!isDragging) {
			return;
		}

		setIsDragging(false);

		try {
			event.currentTarget.releasePointerCapture(event.pointerId);
		} catch {
			// Pointer capture may already be released.
		}
	};

	// -------------------------------------------------
	// Pointer cancel
	// -------------------------------------------------

	const handlePointerCancel = () => {
		setIsDragging(false);
	};

	// -------------------------------------------------
	// Render
	// -------------------------------------------------

	return (
		<>
			{/* ------------------------------------------- */}
			{/* Section Header */}
			{/* ------------------------------------------- */}

			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Work</h2>

				<p className={styles.sectionSubText}>Endless innovation.</p>
			</motion.div>

			{/* ------------------------------------------- */}
			{/* Carousel */}
			{/* ------------------------------------------- */}

			<motion.div variants={fadeIn("", "", 0.1, 1)}>
				<div
					ref={containerRef}
					className="mt-10 relative overflow-hidden w-full"
				>
					<motion.div
						ref={trackRef}
						className={`
              flex
              gap-7
              py-5
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
						/*
						 * Hover pauses ONLY the automatic
						 * scrolling.
						 *
						 * Dragging still works.
						 */
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						/*
						 * Manual pointer dragging.
						 */
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerCancel}
					>
						{projectList}
					</motion.div>
				</div>
			</motion.div>

			{/* ------------------------------------------- */}
			{/* Performance CSS */}
			{/* ------------------------------------------- */}

			<style>
				{`

          .work-track {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }


          /*
           * Don't let the browser interpret horizontal
           * dragging as page scrolling.
           *
           * Vertical page scrolling is still allowed.
           */
          .work-track {
            touch-action: pan-y;
          }


          /*
           * Isolate cards from unnecessary layout
           * calculations.
           */
          .work-track > * {
            contain: layout paint;
          }

        `}
			</style>
		</>
	);
};

export default SectionWrapper(Works, "work");
