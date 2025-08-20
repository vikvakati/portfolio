import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { portrait } from "../assets"; // import portrait image

const About = () => {
	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Overview</h2>
				<p className={styles.sectionSubText}>A little bit about myself.</p>
			</motion.div>

			<motion.div
				variants={fadeIn("", "", 0.1, 1)}
				className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]"
			>
				<div className="w-full blue-purple-gradient p-[1px] rounded-lg shadow-card">
					<div
						options={{ max: 45, scale: 1, speed: 450 }}
						className="bg-tertiary rounded-lg py-8 px-8 min-h-[200px] flex flex-col md:flex-row items-center gap-10"
					>
						{/* Portrait image with lazy loading */}
						<img
							src={portrait}
							alt="Portrait"
							loading="lazy"
							className="w-64 h-64 rounded-full object-cover shadow-lg"
						/>

						{/* Text */}
						<p className="flex-1">
							Embedded systems engineer based in Boston, MA with a M.S. in
							Computer Engineering. I am committed to advancing the Internet of
							Things by exploring and implementing cutting-edge technologies
							that enable seamless data exchange and dynamic user experiences.
							<br />
							<br />
							<strong>
								Passionate about technology, curious by nature, and always
								building
							</strong>
							<br />
							whether it's electronics in my workshop or memories outdoors.
						</p>
					</div>
				</div>
			</motion.div>
		</>
	);
};

export default SectionWrapper(About, "about");
