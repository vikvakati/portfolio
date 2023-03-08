import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
	return (
		<div className="flex flex-row flex-wrap justify-center gap-10">
			{technologies.map((technology) => (
				<div className="w-28 h-28 relative group">
					<BallCanvas icon={technology.icon} />

					{/* dynamic technology.name that only shows on hover*/}
					<p className="text-white-100 text-[14px] pl-1 tracking-wider text-center hidden group-hover:block">
						{technology.name}
					</p>
				</div>
			))}
		</div>
	);
};

export default SectionWrapper(Tech, "");
