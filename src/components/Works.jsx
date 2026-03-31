import React, { useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { github } from "../assets";

const LazyImage = ({ src, alt, className }) => (
	<img
		src={src}
		alt={alt}
		className={`${className} select-none pointer-events-none`}
		loading="lazy"
		draggable={false}
	/>
);

// Memoized card (prevents re-renders)
const ProjectCard = React.memo(
	({ name, date, description, tags, image, source_code_link }) => (
		<div className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full flex-shrink-0 flex flex-col">
			<div className="relative w-full h-[230px]">
				<LazyImage
					src={image}
					alt={name}
					className="w-full h-full object-cover rounded-2xl"
				/>

				{/* Optional: Source code overlay */}
				{/**
      <div className="absolute inset-0 flex justify-end m-3 card-img_hover opacity-75">
        <div
          onClick={() => window.open(source_code_link, "_blank")}
          title="Source Code"
          className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
        >
          <img src={github} alt="github" className="w-5 h-5" loading="lazy" />
        </div>
      </div>
      */}
			</div>

			<div className="mt-5">
				<h3 className="text-white font-bold text-[24px] h-[4.5rem]">{name}</h3>
				<p className="mt-1 text-secondary text-[14px] italic">{date}</p>
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

const Works = () => {
	const innerRef = useRef(null);

	// Duplicate once
	const projectList = useMemo(() => {
		return [...projects, ...projects].map((p, i) => (
			<ProjectCard key={i} {...p} />
		));
	}, []);

	// Pause when offscreen
	useEffect(() => {
		const el = innerRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				el.style.animationPlayState = entry.isIntersecting
					? "running"
					: "paused";
			},
			{ threshold: 0.1 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const pause = (el) => el && (el.style.animationPlayState = "paused");
	const resume = (el) => el && (el.style.animationPlayState = "running");

	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Work</h2>
				<p className={styles.sectionSubText}>Endless innovation.</p>
			</motion.div>

			<motion.div variants={fadeIn("", "", 0.1, 1)}>
				<div className="mt-10 relative overflow-hidden w-full">
					{/*
            - OUTER motion.div handles drag (transform: translateX from Framer)
            - INNER div handles CSS animation
          */}

					<motion.div
						className="cursor-grab active:cursor-grabbing"
						drag="x"
						dragElastic={0}
						dragMomentum={false}
						dragConstraints={{ left: -Infinity, right: Infinity }}
						onDragStart={() => pause(innerRef.current)}
						onDragEnd={() => setTimeout(() => resume(innerRef.current), 50)}
					>
						<div
							ref={innerRef}
							className="flex gap-7 py-5 will-change-transform"
							style={{
								width: "max-content",
								animation: "scrollLoop 80s linear infinite",
							}}
							onMouseEnter={(e) => pause(e.currentTarget)}
							onMouseLeave={(e) => resume(e.currentTarget)}
						>
							{projectList}
						</div>
					</motion.div>
				</div>
			</motion.div>

			<style>
				{`
          @keyframes scrollLoop {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}
			</style>
		</>
	);
};

export default SectionWrapper(Works, "work");
