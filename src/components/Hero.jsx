import { useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";

const Hero = () => {
	// state variable to toggle cursor on click event
	const [isGrabbing, setIsGrabbing] = useState(false);
	function handleMouseDown() {
		setIsGrabbing(true);
	}

	function handleMouseUp() {
		setIsGrabbing(false);
	}
	return (
		<section className="relative w-full h-screen mx-auto">
			<div
				className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}
			>
				<div>
					<h1 className={`${styles.heroHeadText} text-white`}>
						Hi, I'm <span className="text-[#3781e5]">Vik</span>
					</h1>
					<p className={`${styles.heroSubText} mt-2 text-white-100`}>
						Lets Build The Internet of Things
					</p>
				</div>
			</div>

			<div
				className={`w-full h-full relative group ${
					isGrabbing ? "cursor-grabbing" : "cursor-grab"
				}`}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
			>
				<EarthCanvas />
			</div>

			<div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
				<a href="#about">
					<div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2.5">
						<motion.div
							animate={{ y: [0, 24, 0] }}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								repeatType: "loop",
							}}
							className="w-3 h-3 rounded-full bg-secondary mb-1"
						/>
					</div>
				</a>
			</div>
		</section>
	);
};

export default Hero;
