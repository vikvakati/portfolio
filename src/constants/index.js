import {
	javascript,
	cpp,
	html_css,
	math,
	python,
	it,
	image_processing,
	git,
	matlab,
	windows_linux,
	wiring,
	embedded,
	wit_seal,
	delta_magnetics,
	farm,
	hr_detection,
	brdf,
	energy_monitor,
	github,
	linkedin,
	gmail,
	dropbox,
	bodkin_design,
	radiance_calculator,
	spectral,
} from "../assets";

export const navLinks = [
	{
		id: "about",
		title: "About",
	},
	{
		id: "work",
		title: "Work",
	},
	{
		id: "tools",
		title: "Tools",
	},
	{
		id: "contact",
		title: "Contact",
	},
];

const technologies = [
	{
		name: "Python",
		icon: python,
	},
	{
		name: "C/C++",
		icon: cpp,
	},
	{
		name: "Embedded Systems",
		icon: embedded,
	},
	{
		name: "Mathematical Modeling",
		icon: math,
	},
	{
		name: "Spectral Imaging",
		icon: spectral,
	},
	{
		name: "Image Processing",
		icon: image_processing,
	},
	{
		name: "JavaScript",
		icon: javascript,
	},
	{
		name: "Web Development",
		icon: html_css,
	},
	{
		name: "Electrical Wiring",
		icon: wiring,
	},
	{
		name: "Information Technology",
		icon: it,
	},
	{
		name: "MATLAB",
		icon: matlab,
	},
	{
		name: "git",
		icon: git,
	},
	{
		name: "Windows/Linux",
		icon: windows_linux,
	},
];

const experiences = [
	{
		title: "Systems Engineer",
		company_name: "Bodkin Design & Engineering",
		description:
			"Electro-optical imaging solutions design for industrial and research communities.",
		icon: bodkin_design,
		iconBg: "#353e42",
		date: "May 2025 - Present",
		points: [
			"Lead development of software for system control and image analysis.",
			"Integrate software and hardware components using wired and wireless communication protocols.",
			"Enhance system performance by evaluating and implementing emerging technologies.",
		],
	},
	{
		title: "Master of Science",
		company_name: "Wentworth Institute of Technology",
		icon: wit_seal,
		iconBg: "#353e42",
		date: "Jan 2023 - April 2024",
		points: [
			"M.S. Computer Engineering.",
			"Concentration in Internet of Things.",
		],
	},
	{
		title: "Electrical Test Engineer",
		company_name: "Delta Magnetics and Controls",
		description:
			"Custom control panel design and fabrication for process automation.",
		icon: delta_magnetics,
		iconBg: "#353e42",
		date: "January 2021 - January 2023",
		points: [
			"Wired and assembled control panels following industry standard IEC schematics.",
			"Conducted visual and point-to-point testing to verify system functionality.",
			"Deployed over 1000 control panel systems adhering to operational requirements.",
		],
	},
	{
		title: "Bachelor of Science",
		company_name: "Wentworth Institute of Technology",
		icon: wit_seal,
		iconBg: "#353e42",
		date: "September 2018 - August 2022",
		points: [
			"B.S. Computer Engineering.",
			"Minors in Electrical Engineering and Applied Math.",
		],
	},
];

const projects = [
	{
		name: "Spacecraft Materials Testing",
		date: "April 2026",
		description:
			"Automated system to measure BRDF and characterize material degradation over time in a simulated space environment. Synchronizes motor positioning and image acquisition to generate reflectance profiles and track surface changes over time.",
		tags: [
			{
				name: "Image Processing",
				color: "text-white",
			},
			{
				name: "Python",
				color: "text-secondary",
			},
			{
				name: "I2C",
				color: "text-secondary",
			},
		],
		image: brdf,
	},
	{
		name: "Spectral Radiance Calculator",
		date: "July 2025",
		description:
			"Web-based tool to compute spectral radiance using Planck's law. Designed for scientific use, featuring real-time plotting, peak calculations, and band integration with a responsive layout and intuitive controls.",
		tags: [
			{
				name: "Modeling",
				color: "text-white",
			},
			{
				name: "JavaScript",
				color: "text-secondary",
			},
			{
				name: "HTML/CSS",
				color: "text-secondary",
			},
		],
		image: radiance_calculator,
		source_code_link:
			"https://www.bodkindesign.com/reference-library/blackbody-spectral-radiance-calculator/",
	},
	{
		name: "Optimizing Power Generation",
		date: "March 2024",
		description:
			"Real time energy monitoring system designed for administrative use to monitor power trends and optimize power generation. Implemented using a Raspberry Pi to aggregate data from modern and legacy systems.",
		tags: [
			{
				name: "Data Management",
				color: "text-white",
			},
			{
				name: "Python",
				color: "text-secondary",
			},
			{
				name: "SQL",
				color: "text-secondary",
			},
		],
		image: energy_monitor,
	},
	{
		name: "Optical Heart Rate Detection",
		date: "April 2023",
		description:
			"Non-invasive heart rate detection algorithm utilizing a standard 8-bit RGB webcam. The algorithm tracks color variations under stable lighting conditions and isolates cardiac changes in the frequency domain, achieving a robust 95% accuracy.",
		tags: [
			{
				name: "Image Processing",
				color: "text-white",
			},
			{
				name: "MATLAB",
				color: "text-secondary",
			},
		],
		image: hr_detection,
	},
	{
		name: "Real Time Farm Monitoring Network",
		date: "September 2023",
		description:
			"Mesh network to monitor soil conditions on rural farms. Sensor data is sent wirelessly to a server node which displays all information in a GUI. The network is designed to operate reliably in areas lacking power and communication infrastructure.",
		tags: [
			{
				name: "Mesh Networking",
				color: "text-white",
			},
			{
				name: "C++",
				color: "text-secondary",
			},
			{
				name: "Wi-Fi",
				color: "text-secondary",
			},
		],
		image: farm,
		source_code_link: "https://github.com/vikvakati/monitor-soil",
	},
];

const socials = [
	{
		name: "GitHub",
		alt: "github",
		icon: github,
		link: "https://github.com/vikvakati",
	},
	{
		name: "LinkedIn",
		alt: "linkedin",
		icon: linkedin,
		link: "http://linkedin.com/in/vikvakati",
	},
	{
		name: "Gmail",
		alt: "gmail",
		icon: gmail,
		link: "mailto:vikvakati@gmail.com",
	},
	{
		name: "Dropbox",
		alt: "dropbox",
		icon: dropbox,
		link: "https://www.dropbox.com/request/7N80WimUb1gfvzObQCHl",
	},
];
export { technologies, experiences, projects, socials };
