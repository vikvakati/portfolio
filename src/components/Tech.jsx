import { styles } from "../styles";

import { useState } from "react";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

const Tech = () => {
	// state variable and event handlers to toggle cursor on click event
	const [isGrabbing, setIsGrabbing] = useState(false);
	function handleMouseDown() {
		setIsGrabbing(true);
	}

	function handleMouseUp() {
		setIsGrabbing(false);
	}

	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={`${styles.sectionHeadText}`}>Skills.</h2>
				<p className={`${styles.sectionSubText}`}>Lets go for a spin</p>
			</motion.div>
			<div className="py-10 flex flex-row flex-wrap justify-center gap-10">
				{technologies.map((technology) => (
					<div
						className={`w-28 h-28 relative group ${
							isGrabbing ? "cursor-grabbing" : "cursor-grab"
						}`}
						// react event that triggers when mouse is pressed
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
					>
						<BallCanvas icon={technology.icon} />

						{/* dynamic technology.name that only shows on hover*/}
						<p className="text-white-100 text-[14px] pl-1 tracking-wider text-center hidden group-hover:block">
							{technology.name}
						</p>
					</div>
				))}
			</div>
		</>
	);
};

export default SectionWrapper(Tech, "");
