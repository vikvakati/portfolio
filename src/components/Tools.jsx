import { styles } from "../styles";
import { useState } from "react";
import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { Suspense, lazy } from "react";

// Predefined lazy components
const CompressImageLazy = lazy(() => import("./tools/CompressImage"));
const DigitizeImageLazy = lazy(() => import("./tools/DigitizeImage"));

const LazyToolWrapper = ({ children }) => (
	<Suspense fallback={<div className="text-white">Loading...</div>}>
		{children}
	</Suspense>
);

const Tools = () => {
	const [activeTab, setActiveTab] = useState("compress");

	return (
		<>
			<motion.div variants={textVariant()}>
				<h2 className={styles.sectionHeadText}>Image Tools</h2>
				<p className={styles.sectionSubText}>Tame your pixels.</p>
			</motion.div>

			<motion.div variants={fadeIn("", "", 0.1, 1)}>
				<div className="mt-10 flex flex-col items-center gap-10 w-full">
					<div className="w-full max-w-5xl bg-tertiary p-8 rounded-2xl min-h-[600px] mx-auto flex flex-col">
						{/* Tabs */}
						<div className="w-full flex justify-center sm:justify-start border-b border-gray-700 mb-6">
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
									activeTab === "plot"
										? "text-white border-b-2 border-blue-500"
										: "text-secondary hover:text-white"
								}`}
								onClick={() => setActiveTab("plot")}
							>
								Digitize
							</button>
						</div>

						{/* Tool Content */}
						<div className="flex-1">
							{activeTab === "compress" && (
								<LazyToolWrapper>
									<CompressImageLazy />
								</LazyToolWrapper>
							)}
							{activeTab === "plot" && (
								<LazyToolWrapper>
									<DigitizeImageLazy />
								</LazyToolWrapper>
							)}
						</div>
					</div>
				</div>
			</motion.div>
		</>
	);
};

export default SectionWrapper(Tools, "tools");
