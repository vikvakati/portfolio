import { motion, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const LazyImage = ({ src, alt, className }) => {
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} className="w-full h-full">
			{visible && (
				<img
					src={src}
					alt={alt}
					className={`${className} select-none pointer-events-none`}
					loading="lazy"
					draggable={false}
				/>
			)}
		</div>
	);
};

const ProjectCard = ({ name, date, description, tags, image, source_code_link }) => (
	<div className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full flex-shrink-0 flex flex-col">
		<div className="relative w-full h-[230px]">
			<LazyImage
				src={image}
				alt={name}
				className="w-full h-full object-cover rounded-2xl"
			/>

			{/* Uncomment below if you want a source code link overlay like in the Tilt version */}
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

		{/* Tags pushed to the bottom */}
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

	// Measure a single card + gap
	useEffect(() => {
		if (scrollRef.current) {
			const card = scrollRef.current.querySelector(".flex-shrink-0");
			const gap = 28; // gap-7 in px
			if (card) setCardWidth(card.offsetWidth + gap);
		}
	}, []);

	// Infinite auto-scroll
	useEffect(() => {
		let frame;
		const speed = 0.15;
		const totalWidth = cardWidth * projects.length;

		const animate = () => {
			if (scrollRef.current && cardWidth > 0) {
				let nextX = x.get() - speed;

				// Loop forwards/backwards
				if (-nextX >= totalWidth) nextX += totalWidth;
				if (nextX >= 0) nextX -= totalWidth;

				x.set(nextX);
				frame = requestAnimationFrame(animate);
			}
		};

		animate();
		return () => cancelAnimationFrame(frame);
	}, [x, cardWidth]);

	// Only render previous, current, and next sets
	const renderProjects = () => {
		const totalWidth = cardWidth * projects.length || 1;

		const prevSet = projects.map((p, i) => (
			<ProjectCard key={`prev-${i}`} {...p} />
		));
		const mainSet = projects.map((p, i) => (
			<ProjectCard key={`main-${i}`} {...p} />
		));
		const nextSet = projects.map((p, i) => (
			<ProjectCard key={`next-${i}`} {...p} />
		));

		return [...prevSet, ...mainSet, ...nextSet];
	};

	return (
		<>
			<motion.div
				variants={textVariant()}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.1 }}
			>
				<h2 className={styles.sectionHeadText}>Work</h2>
				<p className={styles.sectionSubText}>
					Endless innovation.
				</p>
			</motion.div>

			<motion.div
				variants={fadeIn("up", "spring", 0, 0.75)}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.1 }}
				className="mt-20 relative overflow-hidden"
			>
				<motion.div
					ref={scrollRef}
					className="flex gap-7 py-5 cursor-grab"
					style={{ x }}
					drag="x"
					dragConstraints={{ left: -Infinity, right: Infinity }}
					dragElastic={0.1}
					onDragEnd={() => {
						if (!scrollRef.current || cardWidth === 0) return;
						const totalWidth = cardWidth * projects.length;

						if (-x.get() >= totalWidth) x.set(x.get() + totalWidth);
						if (x.get() >= 0) x.set(x.get() - totalWidth);
					}}
				>
					{renderProjects()}
				</motion.div>

				<style>{`
          ::-webkit-scrollbar { display: none; }
          .scroll-container { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
			</motion.div>
		</>
	);
};

export default SectionWrapper(Works, "work");
