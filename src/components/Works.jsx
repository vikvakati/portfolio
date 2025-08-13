import Tilt from "react-tilt";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

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
				<img src={src} alt={alt} className={className} loading="lazy" />
			)}
		</div>
	);
};

const ProjectCard = ({
	index,
	name,
	description,
	tags,
	image,
	source_code_link,
}) => {
	return (
		<motion.div variants={fadeIn("up", "spring", index * 0.65, 0.75)}>
			<Tilt
				options={{ max: 45, scale: 1, speed: 450 }}
				className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
			>
				<div className="relative w-full h-[230px]">
					<LazyImage
						src={image}
						alt={name}
						className="w-full h-full object-cover rounded-2xl"
					/>
					{/* Uncomment if you want source code link overlay */}
					{/* <div className="absolute inset-0 flex justify-end m-3 card-img_hover opacity-75">
						<div
							onClick={() => window.open(source_code_link, "_blank")}
							title="Source Code"
							className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
						>
							<img src={github} alt="github" className="w-5 h-5" loading="lazy" />
						</div>
					</div> */}
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
	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Projects</h2>
				<p className={styles.sectionSubText}>Tilt it to your favor.</p>
			</motion.div>

			<div className="mt-20 flex flex-wrap gap-7 justify-center">
				{projects.map((project, index) => (
					<ProjectCard key={`${index}`} index={index} {...project} />
				))}
			</div>
		</>
	);
};

export default SectionWrapper(Works, "work");
