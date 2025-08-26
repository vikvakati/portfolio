import { useState, useRef, useEffect } from "react";
import Tilt from "react-tilt";
import { socials } from "../constants";

const Footer = ({ resumeActive }) => {
	// Lazy loader for social icons
	const LazySocialIcon = ({ social }) => {
		const ref = useRef(null);
		const [visible, setVisible] = useState(false);

		useEffect(() => {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						setVisible(true);
						observer.disconnect();
					}
				},
				{ threshold: 0.1 }
			);
			if (ref.current) observer.observe(ref.current);
			return () => observer.disconnect();
		}, []);

		return (
			<div
				ref={ref}
				onClick={() => window.open(social.link, "_blank")}
				className="w-12 h-12 rounded-full flex justify-center items-center cursor-pointer"
				title={social.name}
			>
				{visible && (
					<Tilt>
						<img
							src={social.icon}
							alt={social.alt}
							className="w-10 h-10"
							loading="lazy"
						/>
					</Tilt>
				)}
			</div>
		);
	};

	return (
		<footer
			id="contact" // <-- make footer the target for navbar
			className="text-[12px] py-4 flex flex-col items-center gap-2"
		>
			{/* Social icons row */}
			<div className="flex flex-row justify-center mt-2 opacity-90 space-x-4">
				{socials.map((social) => (
					<LazySocialIcon key={social.name} social={social} />
				))}
			</div>

			{/* Footer name / source code */}
			{resumeActive ? (
				<a
					href="https://github.com/vikvakati/portfolio"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-white text-secondary transition-colors mt-1"
				>
					Vikranth Vakati © 2025
				</a>
			) : (
				<span className="text-secondary select-none cursor-not-allowed opacity-70 mt-1">
					Vikranth Vakati © 2025
				</span>
			)}
		</footer>
	);
};

export default Footer;
