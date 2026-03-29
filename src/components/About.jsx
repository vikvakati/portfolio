import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { portrait } from "../assets";
import { MapPin } from "lucide-react";

const About = () => {
	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Overview</h2>
				<p className={styles.sectionSubText}>A little bit about myself.</p>
			</motion.div>

			<motion.div
				variants={fadeIn("", "", 0.1, 1)}
				className="mt-10 text-secondary text-[17px] leading-[30px] flex flex-col items-center gap-10 w-full max-w-5xl mx-auto"
			>
				<div className="w-full blue-purple-gradient p-[1px] rounded-lg shadow-card">
					<div
						options={{ max: 45, scale: 1, speed: 450 }}
						className="bg-tertiary rounded-lg p-8 min-h-[200px] flex flex-col md:flex-row items-center gap-10"
					>
						<div className="flex flex-col items-center">
							<img
								src={portrait}
								alt="Portrait"
								loading="lazy"
								className="w-64 h-64 rounded-full object-cover shadow-lg"
							/>

							<div className="flex items-center gap-1 mt-3 text-secondary text-sm">
								<MapPin size={17} />
								<span>Boston, MA</span>
							</div>
						</div>

						<p className="flex-1">
							Systems engineer with experience in software and electrical
							engineering, focused on embedded systems and spectral imaging.
							Proven track record of developing systems with seamless data
							exchange and dynamic control.
							<br />
							<br />
							<strong>Greatest innovations in history?</strong>
							<br />
							The wheel, mechanical watches, microcontrollers, ...and whatever I
							build next.
						</p>
					</div>
				</div>
			</motion.div>
		</>
	);
};

export default SectionWrapper(About, "about");
