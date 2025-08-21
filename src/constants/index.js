import {
	javascript,
	cpp,
	html_css,
	reactjs,
	python,
	nodejs,
	image_processing,
	git,
	matlab,
	windows_linux,
	wiring,
	embedded,
	wit_seal,
	delta_magnetics,
	farm,
	// antikythera,
	// deblur,
	hr_detection,
	// antenna_controller,
	// plc_hopper,
	security_cam,
	energy_monitor,
	github,
	linkedin,
	gmail,
	bodkin_design,
	Rad_Calc_demo,
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
	// {
	// 	id: "tools",
	// 	title: "Tools",
	// },
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
		name: "Spectral Imaging",
		icon: spectral,
	},
	{
		name: "Electrical Wiring",
		icon: wiring,
	},
	{
		name: "Image Processing",
		icon: image_processing,
	},
	{
		name: "Embedded Systems",
		icon: embedded,
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
		name: "MATLAB",
		icon: matlab,
	},
	{
		name: "Node JS",
		icon: nodejs,
	},
	{
		name: "React JS",
		icon: reactjs,
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
		title: "Embedded Systems Engineer",
		company_name: "Bodkin Design & Engineering",
		icon: bodkin_design,
		iconBg: "#081741",
		date: "May 2025 - Present",
		points: [
			"Design software for image acquisition, visualization, and control.",
			"Integrate optical components with detectors and electronics.",
			"Investigate areas of new research and development.",
		],
	},
	{
		title: "Master of Science",
		company_name: "Wentworth Institute of Technology",
		icon: wit_seal,
		iconBg: "#383E56",
		date: "Jan 2023 - April 2024",
		points: [
			"M.S. Computer Engineering.",
			"Concentration in Internet of Things.",
		],
	},
	{
		title: "Electrical Systems Test Engineer",
		company_name: "Delta Magnetics and Controls",
		icon: delta_magnetics,
		iconBg: "#081741",
		date: "January 2021 - January 2023",
		points: [
			"Wired and assembled control panels following IEC standard schematics.",
			"Conducted visual, point-to-point, and operational testing on systems to ensure functionality.",
			"Deployed over 1000 control panel systems, adhering to quality and functionality requirements.",
		],
	},
	{
		title: "Bachelor of Science",
		company_name: "Wentworth Institute of Technology",
		icon: wit_seal,
		iconBg: "#383E56",
		date: "September 2018 - August 2022",
		points: [
			"B.S. Computer Engineering.",
			"Minors in Electrical Engineering and Math.",
		],
	},
];

const projects = [
	{
		name: "Spectral Radiance Calculator",
		date: "July 2025",
		description:
			"Interactive web-based tool to compute spectral radiance using Planck’s law. Features real-time plotting, peak calculations, and band integration. Designed for scientific and engineering use, with responsive layout and intuitive controls.",
		tags: [
			{
				name: "JavaScript",
				color: "yellow-text-gradient",
			},
			{
				name: "HTML/CSS",
				color: "blue-text-gradient",
			},
		],
		image: Rad_Calc_demo,
		source_code_link:
			"https://www.bodkindesign.com/reference-library/blackbody-spectral-radiance-calculator/",
	},
	{
		name: "Real Time Energy Monitoring",
		date: "March 2024",
		description:
			"Real time energy monitoring system to optimize university campus power generation. Implemented using a Raspberry Pi to aggregate data from legacy and modern systems for monitoring historical and real time power metrics on a user-friendly web interface. Designed for administrative use, with insightful plots and low cost.",
		tags: [
			{
				name: "Python",
				color: "green-text-gradient",
			},
			{
				name: "JavaScript",
				color: "yellow-text-gradient",
			},
		],
		image: energy_monitor,
	},
	{
		name: "Web Enabled Security Camera",
		date: "February 2024",
		description:
			"Security camera using the ESP32-CAM microcontroller. The system is capable of motion detection and has live streaming capabilities over Wi-Fi. Designed to be low power and low cost, while still providing high reliability and security.",
		tags: [
			{
				name: "C++",
				color: "blue-text-gradient",
			},
			{
				name: "ESP32-CAM",
				color: "pink-text-gradient",
			},
		],
		image: security_cam,
	},
	{
		name: "Optical Heart Rate Detection",
		date: "April 2023",
		description:
			"Non-invasive heart rate detection algorithm utilizing optimal color channels and targeted regions for signal extraction. The algorithm employs signal processing techniques to analyze frequency domain changes related to the cardiac cycle, achieving a robust 95% accuracy through extensive testing and optimization.",
		tags: [
			{
				name: "Matlab",
				color: "orange-text-gradient",
			},
		],
		image: hr_detection,
	},
	{
		name: "Rural Farm Monitoring Network",
		date: "September 2023",
		description:
			"Offline mesh network to monitor vital information on farms. Data is sent to a server node which displays all vital information in a web interface. The network is designed to be low power and low cost, while still providing high reliability and security.",
		tags: [
			{
				name: "C++",
				color: "blue-text-gradient",
			},
			{
				name: "ESP32",
				color: "pink-text-gradient",
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
];
export { technologies, experiences, projects, socials };
