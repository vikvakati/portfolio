import Tilt from "react-tilt";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant, staggerContainer } from "../utils/motion";

const ProjectCard = ({
	index,
	name,
	description,
	tags,
	image,
	source_code_link,
}) => {
	// Detect mobile
	const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

	return (
		<motion.div
			variants={fadeIn("up", "spring", isMobile ? 0 : index * 0.65, 0.75)}
			className="flex-shrink-0"
		>
			<Tilt
				options={{ max: 45, scale: 1, speed: 450 }}
				className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
			>
				<div className="relative w-full h-[230px]">
					<img
						src={image}
						alt={name}
						className="w-full h-full object-cover rounded-2xl"
						loading="lazy"
					/>
				</div>
				<div className="mt-5">
					<h3 className="text-white font-bold text-[24px]">{name}</h3>
					<p className="mt-2 text-secondary text-[14px]">{description}</p>
				</div>
				<div className="mt-4 flex flex-wrap gap-2">
					{tags.map((tag) => (
						<p key={tag.name} className={`text-[14px] ${tag.color}`}>
							{tag.name}&emsp;
						</p>
					))}
				</div>
			</Tilt>
		</motion.div>
	);
};

const Works = () => {
	// Detect mobile for container animation
	const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Projects</h2>
				<p className={styles.sectionSubText}>Tilt it to your favor.</p>
			</motion.div>

			<motion.div
				variants={staggerContainer()}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.25 }}
				className="mt-20 flex flex-wrap gap-7 justify-center h-auto"
			>
				{projects.map((project, index) => (
					<ProjectCard key={index} index={index} {...project} />
				))}
			</motion.div>
		</>
	);
};

export default SectionWrapper(Works, "work");
