import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const LazyIcon = ({ src, alt }) => {
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
		<div ref={ref} className="flex justify-center items-center w-full h-full">
			{visible && (
				<img
					src={src}
					alt={alt}
					className="w-[60%] h-[60%] object-contain"
					loading="lazy"
				/>
			)}
		</div>
	);
};

const ExperienceCard = ({ experience }) => (
	<VerticalTimelineElement
		contentStyle={{ background: "#1d1836", color: "#fff" }}
		contentArrowStyle={{ borderRight: "7px solid #232631" }}
		date={experience.date}
		iconStyle={{ background: experience.iconBg }}
		icon={<LazyIcon src={experience.icon} alt={experience.company_name} />}
	>
		<div>
			<h3 className="text-white text-[24px] font-bold">{experience.title}</h3>
			<p
				className="text-secondary text-[16px] font-semibold"
				style={{ margin: 0 }}
			>
				{experience.company_name}
			</p>
		</div>
		<ul className="mt-5 list-disc ml-5 space-y-2">
			{experience.points.map((point, index) => (
				<li
					key={`experience-point-${index}`}
					className="text-white-100 text-[14px] pl-1 tracking-wider"
				>
					{point}
				</li>
			))}
		</ul>
	</VerticalTimelineElement>
);

const Experience = () => {
	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Experience & Education</h2>
				<p className={styles.sectionSubText}>My journey.</p>
			</motion.div>

			<div className="mt-10 flex flex-col">
				<VerticalTimeline>
					{experiences.map((experience, index) => (
						<ExperienceCard key={index} experience={experience} />
					))}
				</VerticalTimeline>
			</div>
		</>
	);
};

export default SectionWrapper(Experience, "");
