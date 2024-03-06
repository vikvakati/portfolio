import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close, resume } from "../assets";


//TODO- update active link on scroll

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
		<nav
			className={`${
				styles.paddingX
			} w-full flex items-center py-5 fixed top-0 z-20 ${
				scrolled ? "bg-primary" : "bg-primary"
			}`}
		>
			<div className="w-full flex justify-between items-center max-w-7xl mx-auto">
				<Link
					to="/"
					className="flex items-center gap-2"
					onClick={() => {
						setActive("");
						window.scrollTo(0, 0);
					}}
				>
					<img src={logo} alt="logo" className="w-14 h-14 object-contain" />
					<p className="text-white text-[18px] font-bold cursor-pointer flex ">
						Vikranth &nbsp;<span className="sm:block hidden">Vakati</span>
					</p>
				</Link>

				<ul className="list-none hidden sm:flex flex-row gap-10">
					{navLinks.map((nav) => (
						<li
							key={nav.id}
							className={`${
								active === nav.title ? "text-white" : "text-secondary"
							} hover:text-white text-[18px] font-medium cursor-pointer`}
							onClick={() => setActive(nav.title)}
						>
							<a href={`#${nav.id}`}>{nav.title}</a>
						</li>
					))}
					<li
						className={`${
							active === "Resume" ? "text-white" : "text-secondary"
						} hover:text-white text-[18px] font-medium cursor-pointer`}
						onClick={() => setActive("Resume")}
					>
						<a href={resume} target="_blank" rel="noopener noreferrer">
							Resume
						</a>
					</li>
				</ul>

				<div className="sm:hidden flex flex-1 justify-end items-center">
					<img
						src={toggle ? close : menu}
						alt="menu"
						className="w-[28] h-[28] object-contain cursor-pointer"
						onClick={() => setToggle(!toggle)}
					/>

					<div
						className={`${
							!toggle ? "hidden" : "flex"
						} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
					>
						<ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
							{navLinks.map((nav) => (
								<li
									key={nav.id}
									className={` hover:text-white font-poppins font-medium cursor-pointer text-[16px] ${
										active === nav.title ? "text-white" : "text-secondary"
									}`}
									onClick={() => {
										setToggle(!toggle);
										setActive(nav.title);
									}}
								>
									<a href={`#${nav.id}`}>{nav.title}</a>
								</li>
							))}
							<li
								className={`${
									active === "Resume" ? "text-white" : "text-secondary"
								} hover:text-white font-poppins font-medium cursor-pointer text-[16px]`}
								onClick={() => {
									setToggle(!toggle);
									setActive("Resume");
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
