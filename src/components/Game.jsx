import React from "react";
import { motion } from "framer-motion";
import { slideIn } from "../utils/motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";


function Game() {
	return (
		<div className="xl:mt-12 xl:flex-row flex justify-center gap-10 flex-col items-center">
			<motion.div
				variants={slideIn("up", "tween", 0.2, 1)}
				className="flex-[0.75] w-full bg-black-100 p-8 rounded-2xl"
			>
				<p className={styles.sectionSubText}>Stay A While</p>
				<h3 className={styles.sectionHeadText}>Asteroids.</h3>
				<iframe
					src="https://chriz001.github.io/Reacteroids/"
					title="Asteroids Game"
					className="rounded-2xl h-[600px] w-full flex justify-center"
				></iframe>
			</motion.div>
		</div>
	);
}
 
export default SectionWrapper(Game, "");
