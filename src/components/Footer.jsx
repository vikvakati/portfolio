import { socials } from "../constants";

const Footer = ({ resumeActive }) => {
	const SocialIcon = ({ social }) => (
		<button
			onClick={() => window.open(social.link, "_blank", "noopener,noreferrer")}
			className="w-12 h-12 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform"
			title={social.name}
			aria-label={social.name}
		>
			<img
				src={social.icon}
				alt={social.alt}
				className="w-10 h-10"
				loading="lazy"
				decoding="async"
			/>
		</button>
	);

	return (
		<footer
			id="contact"
			className="text-[12px] py-4 flex flex-col items-center gap-2"
		>
			<div className="flex flex-row justify-center mt-2 opacity-90 space-x-4">
				{socials.map((social) => (
					<SocialIcon key={social.name} social={social} />
				))}
			</div>

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
