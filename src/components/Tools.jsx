import { styles } from "../styles";
import { useState, Suspense, lazy } from "react";
import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion";
import { slideIn, textVariant } from "../utils/motion";

// Lazy loader wrapper for tools
const LazyTool = ({ importFunc }) => {
	const Tool = lazy(importFunc);
	return (
		<Suspense fallback={<div className="text-white">Loading...</div>}>
			<Tool />
		</Suspense>
	);
};

const Tools = () => {
	const [activeTab, setActiveTab] = useState("convert");

	return (
		<>
			<motion.div variants={textVariant()} className="mb-10">
				<h2 className={styles.sectionHeadText}>Image Tools</h2>
				<p className={styles.sectionSubText}>Tame your pixels.</p>
			</motion.div>

			<motion.div variants={slideIn("up", "tween", 0.2, 1)}>
				<div className="flex flex-col items-center gap-10 w-full">
					<div className="w-full max-w-5xl bg-tertiary p-8 rounded-2xl min-h-[500px] mx-auto">
						{/* Tabs */}
						<div className="flex space-x-6 border-b border-gray-700">
							<button
								className={`pb-2 px-4 transition-colors ${
									activeTab === "compress"
										? "text-white border-b-2 border-blue-500"
										: "text-secondary hover:text-white"
								}`}
								onClick={() => setActiveTab("compress")}
							>
								Compress
							</button>
							<button
								className={`pb-2 px-4 transition-colors ${
									activeTab === "convert"
										? "text-white border-b-2 border-blue-500"
										: "text-secondary hover:text-white"
								}`}
								onClick={() => setActiveTab("convert")}
							>
								Convert
							</button>
							<button
								className={`pb-2 px-4 transition-colors ${
									activeTab === "plot"
										? "text-white border-b-2 border-blue-500"
										: "text-secondary hover:text-white"
								}`}
								onClick={() => setActiveTab("plot")}
							>
								Digitize Plot
							</button>
						</div>

						{/* Tool Content */}
						<div className="mt-8">
                            {activeTab === "compress" && (
                                <LazyTool importFunc={() => import("./tools/CompressImage")} />
                            )}
							{activeTab === "convert" && (
								<LazyTool importFunc={() => import("./tools/ConvertImage")} />
							)}
							{activeTab === "plot" && (
								<LazyTool importFunc={() => import("./tools/DigitizePlot")} />
							)}
						</div>
					</div>
				</div>
			</motion.div>
		</>
	);
};

// Add proper ID so navbar updates on scroll
export default SectionWrapper(Tools, "tools");
