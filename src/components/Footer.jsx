const Footer = ({ resumeActive }) => {
	return (
		<footer className="text-[12px] py-4 flex flex-col items-center">
			{resumeActive ? (
				<a
					href="https://github.com/vikvakati/portfolio"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-white text-secondary transition-colors"
				>
					Vikranth Vakati © 2025
				</a>
			) : (
				// same look, not clickable
				<span className="text-secondary select-none cursor-not-allowed opacity-70">
					Vikranth Vakati © 2025
				</span>
			)}
		</footer>
	);
};

export default Footer;
