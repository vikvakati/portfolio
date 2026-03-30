import { motion, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const LazyImage = ({ src, alt, className }) => (
	<img
		src={src}
		alt={alt}
		className={`${className} select-none pointer-events-none`}
		loading="lazy"
		decoding="async"
		draggable={false}
	/>
);

const ProjectCard = ({
	name,
	date,
	description,
	tags,
	image,
	source_code_link,
}) => (
	<div className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full flex-shrink-0 flex flex-col">
		<div className="relative w-full h-[230px]">
			<LazyImage
				src={image}
				alt={name}
				decoding="async"
				className="w-full h-full object-cover rounded-2xl"
			/>

			{/* Uncomment if you want a source code overlay */}
			{/*
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
);

const Works = () => {
	const scrollRef = useRef(null);
	const x = useMotionValue(0);
	const [cardWidth, setCardWidth] = useState(0);

	const isPaused = useRef(false);
	const isDragging = useRef(false);

	useEffect(() => {
		if (scrollRef.current) {
			const card = scrollRef.current.querySelector(".flex-shrink-0");
			const gap = 28;
			if (card) setCardWidth(card.offsetWidth + gap);
		}
	}, []);

	useEffect(() => {
		if (cardWidth > 0) {
			const offset = -(cardWidth * projects.length);
			x.set(offset);
		}
	}, [cardWidth, x]);

	useEffect(() => {
		let frame;
		const speed = 0.12;
		const totalWidth = cardWidth * projects.length;

		const animate = () => {
			if (scrollRef.current && cardWidth > 0) {
				// Pause on hover / drag
				if (!isPaused.current && !isDragging.current) {
					let nextX = x.get() - speed;

					// ✅ Early wrap → fixes "wait until off screen" issue
					if (-nextX >= totalWidth) nextX += totalWidth;
					if (nextX >= 0) nextX -= totalWidth;

					x.set(nextX);
				}

				frame = requestAnimationFrame(animate);
			}
		};

		animate();
		return () => cancelAnimationFrame(frame);
	}, [x, cardWidth]);

	const renderProjects = () => {
		const mainSet = projects.map((p, i) => (
			<ProjectCard key={`main-${i}`} {...p} />
		));
		const nextSet = projects.map((p, i) => (
			<ProjectCard key={`next-${i}`} {...p} />
		));
		return [...mainSet, ...nextSet];
	};

	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Work</h2>
				<p className={styles.sectionSubText}>Endless innovation.</p>
			</motion.div>

			<motion.div variants={fadeIn("", "", 0.1, 1)}>
				<div className="mt-10 relative overflow-hidden w-full">
					<motion.div
						ref={scrollRef}
						className="flex gap-7 py-5 cursor-grab active:cursor-grabbing"
						style={{ x }}
						drag="x"
						dragConstraints={{ left: -Infinity, right: Infinity }}
						dragElastic={0.1}
						onMouseEnter={() => (isPaused.current = true)}
						onMouseLeave={() => (isPaused.current = false)}
						onDragStart={() => (isDragging.current = true)}
						onDragEnd={() => {
							isDragging.current = false;

							if (!scrollRef.current || cardWidth === 0) return;
							const totalWidth = cardWidth * projects.length;

							let current = x.get();
							if (-current >= totalWidth) current += totalWidth;
							if (current >= 0) current -= totalWidth;

							x.set(current);
						}}
					>
						{renderProjects()}
					</motion.div>
				</div>
			</motion.div>
		</>
	);
};

export default SectionWrapper(Works, "work");
