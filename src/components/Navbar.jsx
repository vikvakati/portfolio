import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close, resume } from "../assets";

const Navbar = () => {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);
	const ignoreScroll = useRef(false);

	// Update URL hash without causing a jump
	const updateHash = (sectionTitle) => {
		if (sectionTitle) {
			const currentId = navLinks.find((n) => n.title === sectionTitle)?.id;
			if (currentId) {
				history.replaceState(null, "", `#${currentId}`);
			}
		} else {
			history.replaceState(null, "", window.location.pathname);
		}
	};

	useEffect(() => {
		const sections = navLinks
			.map((n) => document.getElementById(n.id))
			.filter(Boolean);

		if (sections.length === 0) return;

		const handleScroll = () => {
			if (ignoreScroll.current) return;

			let currentSection = "";

			for (let i = 0; i < sections.length; i++) {
				const rect = sections[i].getBoundingClientRect();
				if (rect.top <= 100) {
					currentSection = navLinks[i].title;
				} else {
					break;
				}
			}

			if (currentSection !== active) {
				setActive(currentSection);
				updateHash(currentSection);
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, [active]);

	const handleNavClick = (title) => {
		setActive(title);
		ignoreScroll.current = true;
		setTimeout(() => {
			ignoreScroll.current = false;
		}, 500); // re-enable scroll updates after smooth scroll
	};

	const renderNavLinks = (isMobile = false) =>
		navLinks.map((link) => (
			<li
				key={link.id}
				className={`${
					active === link.title ? "text-white" : "text-secondary"
				} hover:text-white ${
					isMobile
						? "font-poppins font-medium text-[16px]"
						: "text-[18px] font-medium"
				} cursor-pointer`}
				onClick={() => {
					if (isMobile) setToggle(false);
					handleNavClick(link.title);
				}}
			>
				<a href={`#${link.id}`}>{link.title}</a>
			</li>
		));

	return (
		<nav
			className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}
		>
			<div className="w-full flex justify-between items-center max-w-7xl mx-auto">
				<Link
					to="/"
					className="flex items-center gap-2"
					onClick={() => {
						handleNavClick("");
						window.scrollTo(0, 0);
					}}
				>
					<img src={logo} alt="logo" className="w-14 h-14 object-contain" />
					<p className="text-white text-[18px] font-bold cursor-pointer flex">
						Vikranth &nbsp;<span className="sm:block hidden">Vakati</span>
					</p>
				</Link>

				{/* Desktop menu */}
				<ul className="list-none hidden sm:flex flex-row gap-10">
					{renderNavLinks()}
					<li
						className={`${
							active === "Resume" ? "text-white" : "text-secondary"
						} hover:text-white text-[18px] font-medium cursor-pointer`}
						onClick={() => handleNavClick("Resume")}
					>
						<a href={resume} target="_blank" rel="noopener noreferrer">
							Resume
						</a>
					</li>
				</ul>

				{/* Mobile menu toggle */}
				<div className="sm:hidden flex flex-1 justify-end items-center">
					<img
						src={toggle ? close : menu}
						alt="menu"
						className="w-[28px] h-[28px] object-contain cursor-pointer"
						onClick={() => setToggle((prev) => !prev)}
					/>

					{/* Mobile menu dropdown */}
					<div
						className={`${
							!toggle ? "hidden" : "flex"
						} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
					>
						<ul className="list-none flex justify-end items-start flex-col gap-4">
							{renderNavLinks(true)}
							<li
								className={`${
									active === "Resume" ? "text-white" : "text-secondary"
								} hover:text-white font-poppins font-medium cursor-pointer text-[16px]`}
								onClick={() => {
									setToggle(false);
									handleNavClick("Resume");
								}}
							>
								<a href={resume} target="_blank" rel="noopener noreferrer">
									Resume
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
