import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close, resume } from "../assets"; // logo removed

const Navbar = ({ onActiveChange }) => {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);
	const ignoreScroll = useRef(false);
	const activeRef = useRef(active);

	useEffect(() => {
		activeRef.current = active;
		if (onActiveChange) onActiveChange(active);
	}, [active, onActiveChange]);

	const updateHash = (sectionTitle) => {
		if (sectionTitle) {
			const currentId = navLinks.find((n) => n.title === sectionTitle)?.id;
			if (currentId) history.replaceState(null, "", `#${currentId}`);
		} else {
			history.replaceState(null, "", window.location.pathname);
		}
	};

	useEffect(() => {
		const sections = navLinks
			.map((n) => document.getElementById(n.id))
			.filter(Boolean);
		if (!sections.length) return;

		let ticking = false;

		const handleScroll = () => {
			if (ignoreScroll.current) return;

			if (!ticking) {
				window.requestAnimationFrame(() => {
					let currentSection = "";
					for (let i = 0; i < sections.length; i++) {
						const rect = sections[i].getBoundingClientRect();
						if (rect.top <= 100) currentSection = navLinks[i].title;
						else break;
					}

					if (currentSection !== activeRef.current) {
						setActive(currentSection);
						updateHash(currentSection);
					}
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleNavClick = (title) => {
		setActive(title);
		ignoreScroll.current = true;

		const targetId = navLinks.find((n) => n.title === title)?.id;
		if (targetId) {
			document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
		}

		setTimeout(() => {
			ignoreScroll.current = false;
		}, 500);
	};

	const ResumeLink = ({ isMobile = false }) => (
		<li
			className={`${
				active === "Resume" ? "text-white" : "text-secondary"
			} hover:text-white ${
				isMobile
					? "font-poppins font-medium text-[16px]"
					: "text-[18px] font-medium"
			} cursor-pointer`}
			onClick={() => {
				handleNavClick("Resume");
				window.open(resume, "_blank", "noopener,noreferrer");
			}}
		>
			<div
				className={`${
					isMobile ? "px-[2px] py-[3px]" : "p-[2px]"
				} rounded-lg blue-purple-gradient`}
			>
				<span
					className={`p-[2px] rounded-lg ${
						isMobile ? "black-gradient" : "bg-primary"
					}`}
				>
					Resume
				</span>
			</div>
		</li>
	);

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

	// Animate SVG paths dynamically
	useEffect(() => {
		const svg = document.querySelector(".handwriting");
		const paths = svg?.querySelectorAll("path") || [];

		const animate = () => {
			paths.forEach((path, index) => {
				const length = path.getTotalLength();
				path.style.strokeDasharray = length;
				path.style.strokeDashoffset = length;

				// reset animation
				path.style.animation = "none";
				// force reflow (flush styles)
				void path.getBoundingClientRect();

				// re-apply animation
				path.style.animation = `draw 1.5s ease forwards ${index * 0.15}s`;
			});
		};

		// run once on page load
		animate();

		// re-run on hover
		if (svg) {
			svg.addEventListener("mouseenter", animate);
		}

		return () => {
			if (svg) svg.removeEventListener("mouseenter", animate);
		};
	}, []);

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
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}
				>
					{/* Animated SVG Logo */}
					<svg
						viewBox="0 0 274 135"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="handwriting w-32 h-15"
					>
						<path
							d="M42.4858 46.3208C44.4644 42.779 46.3209 39.3971 47.4459 38.447C47.9249 38.0425 48.6998 38.6769 49.0065 39.8191C49.3132 40.9614 49.2516 42.8176 48.5395 45.4788C47.8275 48.14 46.4668 51.5501 40.8776 60.9856C35.2884 70.4211 25.512 85.7787 19.0085 96.485C12.5051 107.191 9.57107 112.781 7.45765 117.496C5.34422 122.21 4.14036 125.881 3.92614 128.361C3.71193 130.842 4.52383 132.022 6.66949 131.757C8.81515 131.491 12.27 129.744 39.4204 109.642C66.5709 89.5396 117.312 51.1349 143.715 31.0883C170.118 11.0416 170.644 10.5166 170.073 10.5192C169.501 10.5217 167.816 11.0677 152.176 19.0718C136.537 27.076 106.995 42.5218 88.9874 52.5534C70.9802 62.5849 65.4032 66.734 61.0324 70.5659C56.6616 74.3979 53.6659 77.7869 52.0247 80.7443C50.3835 83.7017 50.1875 86.1249 52.2395 87.7763C54.2915 89.4277 58.5974 90.234 77.0286 86.599C95.4597 82.9639 127.886 74.863 161.175 65.4341C194.465 56.0052 227.635 45.4938 261.811 34.6639"
							stroke="#3781E5"
							strokeWidth="6"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M172.054 33.7722C172.212 33.215 172.369 32.6579 172.467 32.5055C172.564 32.3531 172.596 32.6222 172.531 33.0777C172.374 34.1795 171.577 36.0048 169.025 40.567C167.11 43.99 163.619 49.4793 161.553 52.7587C159.486 56.0381 158.869 56.8945 158.67 56.783C158.47 56.6714 158.706 55.566 158.95 54.4271"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M177.395 22.9074C177.244 22.7502 177.093 22.593 176.9 22.5742C176.708 22.5555 176.478 22.68 176.261 22.9466C176.045 23.2132 175.849 23.6182 175.606 24.3745"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M185.692 26.6153C186.061 25.6847 186.454 24.8985 186.84 24.3612C187.012 24.1222 187.181 23.9862 187.223 24.0557C187.265 24.1252 187.186 24.4132 184.839 28.6795C182.492 32.9458 177.879 41.1818 175.427 45.6471C172.975 50.1125 172.825 50.5577 172.946 50.6562C173.371 50.9995 175.295 48.6794 179.175 44.2431C181.676 41.3838 185.104 37.1583 187.718 34.1873C190.331 31.2162 191.988 29.5939 192.625 28.7808C193.262 27.9677 192.83 28.013 192.194 28.4092C190.621 29.3901 188.816 31.5758 186.296 34.9809C184.754 37.0654 183.042 40.1328 182.026 42.1049C181.009 44.0771 180.833 44.9272 180.991 45.5645C181.15 46.2017 181.648 46.6004 182.457 46.8221C183.267 47.0438 184.374 47.0765 185.449 47.0217C186.524 46.9668 187.533 46.8235 188.573 46.6758"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M197.191 32.1259C197.191 31.9234 197.191 31.7209 196.067 34.1022C194.944 36.4836 192.697 41.4548 191.428 44.1692C190.159 46.8836 189.936 47.1904 189.936 46.9794C189.936 46.7683 190.166 46.0301 190.71 44.5671C191.254 43.104 192.106 40.9384 193.93 37.3404C195.754 33.7423 198.524 28.7773 200.636 25.3984C202.748 22.0195 204.118 20.3771 205.164 19.3317C206.21 18.2862 206.891 17.8876 207.366 17.757C207.842 17.6265 208.092 17.7762 208.178 18.184C208.264 18.5918 208.178 19.2533 207.931 20.1663C207.684 21.0793 207.278 22.2237 206.86 23.4028"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M216.987 23.8791C216.953 23.5257 216.92 23.1723 216.634 22.9312C216.349 22.69 215.812 22.5718 215.185 22.7272C214.558 22.8826 213.858 23.3153 213.087 24.0254C212.316 24.7356 211.496 25.7102 210.579 26.938C209.661 28.1657 208.672 29.6169 207.737 31.2581C206.801 32.8992 205.949 34.6862 205.272 36.3916C204.594 38.0969 204.116 39.6664 203.971 40.8836C203.826 42.1008 204.029 42.9182 204.439 43.284C204.849 43.6498 205.459 43.5391 206.464 42.8866C207.47 42.2342 208.851 41.0432 210.195 39.6085C211.539 38.1738 212.803 36.5314 213.956 34.8842C216.192 31.6895 217.512 28.9705 218.075 27.1989C218.312 26.4529 218.284 25.9694 218.084 25.766C217.884 25.5627 217.47 25.6419 216.962 26.0519C216.454 26.4618 215.866 27.2 215.372 28.0512C214.879 28.9025 214.498 29.8444 214.355 30.7811C214.212 31.7179 214.317 32.6208 214.709 33.4136C215.1 34.2063 215.774 34.8615 216.698 35.2443C217.622 35.6271 218.776 35.7177 219.965 35.811"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M224.273 29.7479C224.81 28.7267 226.082 26.6174 226.367 26.5701C228.037 26.2924 223.205 32.8095 221.854 35.3733C220.503 37.9372 220.326 38.2189 221.601 36.1852C222.876 34.1515 225.609 29.794 227.796 26.5582C229.984 23.3224 231.544 21.3405 233.041 19.6882C235.796 16.6488 238.031 15.0536 239.152 14.4027C239.587 14.1501 239.796 14.1379 239.809 14.321C239.822 14.5042 239.644 14.9041 238.544 16.9839C237.444 19.0637 235.427 22.8113 234.139 25.3669C232.85 27.9226 232.352 29.1726 232.046 30.2121C231.74 31.2515 231.641 32.0426 231.539 33.2158"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M253.759 8.61277C253.759 8.33861 253.759 8.06446 252.872 9.84671C251.984 11.629 250.208 15.4759 248.746 18.4091C247.284 21.3422 246.189 23.2449 245.048 25.4745C243.907 27.7042 242.753 30.203 241.565 32.7775"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M241.885 24.1345C241.675 24.0301 241.466 23.9257 241.377 23.7738C241.288 23.622 241.327 23.4258 241.776 23.1021C243.006 22.2153 245.435 21.2345 248.484 19.9697C250.066 19.3451 251.717 18.7553 253.095 18.3766C254.474 17.9979 255.528 17.8483 256.615 17.6941"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M266.107 3.85678C266.336 3.01922 266.566 2.18167 266.212 3.42845C265.859 4.67524 264.915 8.03174 263.281 12.1874C261.648 16.343 259.354 21.196 258.032 24.0627C256.709 26.9293 256.428 27.6625 256.397 27.9452C256.367 28.228 256.597 28.0381 257.682 26.5468C258.767 25.0556 260.7 22.2688 262.279 20.1792C263.857 18.0896 265.023 16.7817 266.181 15.6207C268.383 13.4122 270.349 12.0155 271.584 11.3696C272.046 11.128 272.283 11.3072 272.26 11.7215C272.237 12.1358 271.976 12.8425 271.248 14.551C270.521 16.2594 269.335 18.9481 268.541 20.9576C267.746 22.9671 267.379 24.2159 267.18 25.1045C266.981 25.993 266.961 26.4835 266.94 26.9888"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M140.129 81.0689C140.297 80.664 140.482 80.1611 140.639 79.6109C140.711 79.3585 140.71 79.1461 140.445 79.1757C139.587 79.2714 137.451 81.3904 134.505 84.476C133.148 85.8977 132.224 87.1693 131.256 88.5683C130.288 89.9672 129.344 91.4914 128.563 93.0424C127.047 96.0556 126.338 98.9849 126.045 101.064C125.934 101.855 126.173 102.138 126.648 102.162C127.122 102.186 127.895 101.951 128.991 101.159C130.087 100.367 131.482 99.025 132.964 97.3886C134.447 95.7523 135.974 93.8621 137.364 92.0182C138.754 90.1742 139.959 88.4337 140.905 86.919C142.588 84.2217 143.382 82.1285 143.61 80.8373C143.701 80.3197 143.426 80.0504 143.103 79.9515C142.779 79.8526 142.335 79.9242 141.899 80.2265C141.463 80.5288 141.049 81.0595 140.639 81.856C139.72 83.6434 139.23 86.2621 139.028 89.1274C138.93 90.5041 139.238 91.7374 139.765 92.7571C140.292 93.7768 141.13 94.5489 142.096 95.0347C143.062 95.5205 144.13 95.6966 145.231 95.878"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M162.049 72.1896C162.14 72.0714 162.231 71.9532 162.234 72.0558C162.238 72.1583 162.153 72.4853 161.493 74.1195C160.834 75.7536 159.603 78.6851 157.731 82.501C155.858 86.3169 153.382 90.9285 151.939 93.5104C150.497 96.0923 150.163 96.5048 150.659 95.7521C151.155 94.9994 152.492 93.069 154.045 91.1395C155.598 89.2101 157.326 87.34 160.006 85.0254C162.686 82.7108 166.264 80.0082 168.225 78.5116C170.185 77.015 170.42 76.8062 170.342 76.6201C170.263 76.434 169.864 76.2768 169.363 76.3297C168.862 76.3827 168.272 76.6505 167.116 77.865C165.96 79.0795 164.257 81.2325 162.642 83.5778C161.028 85.9232 159.554 88.3956 158.65 90.1402C157.747 91.8848 157.458 92.8268 157.421 93.5837C157.384 94.3405 157.607 94.8838 158.191 95.131C158.774 95.3782 159.712 95.3128 161.675 94.4478C163.639 93.5829 166.6 91.9203 169.651 90.2074"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M187.958 71.7323C188.137 71.3788 188.499 70.7108 188.561 70.3904C188.587 70.2556 188.084 70.3517 187.666 70.6436C187.248 70.9356 186.797 71.465 185.575 73.2525C184.352 75.04 182.372 78.0696 181.103 80.232C179.178 83.5106 178.529 85.8452 178.071 87.7374C177.859 88.6122 177.879 89.3542 178.082 89.8721C178.284 90.39 178.717 90.6717 179.421 90.6075C180.125 90.5432 181.088 90.1244 182.206 89.1334C183.325 88.1423 184.571 86.5917 186.304 84.0298C188.036 81.4679 190.218 77.9416 191.551 75.7194C192.884 73.4973 193.304 72.6862 193.552 72.0954C193.801 71.5046 193.866 71.1588 193.74 70.9643C193.613 70.7697 193.293 70.7371 192.833 70.9359C191.709 71.4218 190.512 72.7625 189.224 74.4157C188.549 75.2812 188.027 76.3443 187.649 77.3873C187.271 78.4303 187.101 79.4578 187.152 80.3694C187.202 81.281 187.477 82.0456 188.041 82.7702C189.45 84.1564 191.376 85.3145 193.147 86.0568C193.864 86.3225 194.211 86.3627 194.569 86.4042"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M210.158 66.2027C210.262 65.745 210.44 65.0514 210.605 64.554C210.716 64.2192 210.356 66.0429 209.847 67.7083C209.559 68.6494 209.116 69.7548 207.607 73.154C206.097 76.5531 203.51 82.2047 202.249 85.0413C200.988 87.8779 201.133 87.7283 201.281 87.5741"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M201.179 76.5912C201.173 76.6163 201.166 76.6415 201.055 76.6255C200.945 76.6095 200.73 76.5517 200.888 76.2861C201.045 76.0205 201.582 75.5489 202.327 75.116C203.072 74.6832 204.009 74.3034 206.717 73.4211C209.424 72.5388 213.872 71.1655 218.455 69.7506"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M225.244 70.3261C225.277 70.1425 225.311 69.9589 225.394 69.7731C225.476 69.5873 225.607 69.405 225.658 69.4613C225.896 69.7272 225.353 71.0371 224.568 73.2127C224.105 74.4929 223.366 76.0749 222.346 77.983C221.326 79.891 220.01 82.0629 219.168 83.5055C218.327 84.9482 218 85.5959 217.521 86.4613"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M228.186 60.2158C228.172 60.2221 228.159 60.2284 228.054 60.3234C227.949 60.4185 227.753 60.6021 227.551 60.9475"
							stroke="#3781E5"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</Link>

				{/* Desktop */}
				<ul className="list-none hidden sm:flex flex-row gap-10">
					{renderNavLinks()}
					<ResumeLink />
				</ul>

				{/* Mobile */}
				<div className="sm:hidden flex flex-1 justify-end items-center">
					<img
						src={toggle ? close : menu}
						alt="menu"
						className="w-[28px] h-[28px] object-contain cursor-pointer"
						onClick={() => setToggle((prev) => !prev)}
					/>
					<div
						className={`${
							!toggle ? "hidden" : "flex"
						} p-4 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
					>
						<ul className="list-none flex justify-end items-start flex-col gap-4">
							{renderNavLinks(true)}
							<ResumeLink isMobile />
						</ul>
					</div>
				</div>
			</div>

			{/* CSS Animation */}
			<style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
		</nav>
	);
};

export default Navbar;
