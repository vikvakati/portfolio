import { styles } from "../styles";
import { useState, Suspense, lazy } from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

// Lazy load BallCanvas so it only loads when rendered
const BallCanvas = lazy(() =>
	import("./canvas").then((module) => ({ default: module.BallCanvas }))
);

const Tech = () => {
	// toggle cursor style on click/drag
	const [isGrabbing, setIsGrabbing] = useState(false);

	const handleMouseDown = () => setIsGrabbing(true);
	const handleMouseUp = () => setIsGrabbing(false);

	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Skills & Services</h2>
				<p className={styles.sectionSubText}>Take them for a spin.</p>
			</motion.div>

			<motion.div variants={fadeIn("", "", 0.1, 1)}>
				<div className="py-10 flex flex-row flex-wrap justify-center gap-10">
					{technologies.map((technology, index) => (
						<div
							key={index}
							className={`w-28 h-28 relative group ${
								isGrabbing ? "cursor-grabbing" : "cursor-grab"
							}`}
							onMouseDown={handleMouseDown}
							onMouseUp={handleMouseUp}
						>
							<Suspense
								fallback={
									<div className="w-28 h-28 bg-gray-800 rounded-full" />
								}
							>
								<BallCanvas
									icon={technology.icon}
									imgProps={{ loading: "lazy" }} // pass down lazy loading prop to img
								/>
							</Suspense>
							<p className="text-white-100 text-[14px] pl-1 tracking-wider text-center hidden group-hover:block">
								{technology.name}
							</p>
						</div>
					))}
				</div>
			</motion.div>
		</>
	);
};

export default SectionWrapper(Tech, "");
