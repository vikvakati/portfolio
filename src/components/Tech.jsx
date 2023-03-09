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
			<motion.div variants={textVariant()} className="flex justify-center">
				<p className="text-white text-[24px] font-semibold">
					Take It For A Spin
				</p>
			</motion.div>
			<div className="flex flex-row flex-wrap justify-center gap-10">
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
