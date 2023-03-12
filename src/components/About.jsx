import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ServiceCard = ({ index, title, icon }) => {
	return (
		<motion.div
			variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
			className="w-[250px] h-full"
		>
			<div className="w-full blue-purple-gradient p-[1px] rounded-full shadow-card">
				<div
					options={{ max: 45, scale: 1, speed: 450 }}
					className="bg-tertiary rounded-full py-5 px-12 min-h-[200px] flex justify-evenly items-center flex-col"
				>
					<img src={icon} alt={title} className="w-16 h-16 object-contain" />
				</div>
			</div>
			<h3 className="text-white text-[20px] font-bold text-center w-[250px]">
				{title}
			</h3>
		</motion.div>
	);
};
const About = () => {
	return (
		<>
			<motion.div variants={textVariant()}>
				<p className={styles.sectionSubText}>Introduction</p>
				<h2 className={styles.sectionHeadText}>Overview.</h2>
			</motion.div>

			<motion.p
				variants={fadeIn("", "", 0.1, 1)}
				className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
			>
				I'm a computer engineering masters student at Wentworth Institute of
				Technology with software development experience in a variety of
				languages and frameworks as well as experience in electrical
				engineering. I am a quick learner and eager to solve real-world problems
				using cyber-physical systems.
			</motion.p>
			<div className="mt-20 flex flex-wrap gap-10 justify-center">
				{services.map((service, index) => (
					<ServiceCard key={service.title} index={index} {...service} />
				))}
			</div>
		</>
	);
};

export default SectionWrapper(About, "about");
