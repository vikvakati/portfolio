import {
	iot,
	backend,
	engineer,
	web,
	javascript,
	cpp,
	html,
	reactjs,
	python,
	nodejs,
	sql,
	git,
	matlab,
	linux,
	verilog,
	arm,
	ladder,
	wit_seal,
	delta_magnetics,
	farm,
	antikythera,
	deblur,
	hr_detection,
	antenna_controller,
	plc_hopper,
	security_cam,
	energy_monitor,
	github,
	linkedin,
	gmail,
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
		id: "contact",
		title: "Contact",
	},
];

const services = [
	{
		title: "Embedded Software Developer",
		icon: iot,
	},
	{
		title: "Web Developer",
		icon: web,
	},
	{
		title: "Backend Developer",
		icon: backend,
	},
	{
		title: "Electronics Engineer",
		icon: engineer,
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
		name: "ARM",
		icon: arm,
	},
	{
		name: "Verilog",
		icon: verilog,
	},
	{
		name: "SQL",
		icon: sql,
	},
	{
		name: "MATLAB",
		icon: matlab,
	},
	{
		name: "JavaScript",
		icon: javascript,
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
		name: "Ladder Logic",
		icon: ladder,
	},
	{
		name: "HTML 5",
		icon: html,
	},
	{
		name: "git",
		icon: git,
	},
	{
		name: "Linux",
		icon: linux,
	},
];

const experiences = [
	{
		title: "Bachelor of Science",
		company_name: "Wentworth Institute of Technology",
		icon: wit_seal,
		iconBg: "#081741",
		date: "September 2018 - August 2022",
		points: [
			"B.S. Computer Engineering.",
			"Minors in Internet of Things, Electrical Engineering, and Math.",
		],
	},
	{
		title: "Electrical Systems Test Engineer",
		company_name: "Delta Magnetics and Controls",
		icon: delta_magnetics,
		iconBg: "#081741",
		date: "January 2021 - January 2023",
		points: [
			"Conducted visual, point to point and operational testing on control panel systems to ensure functionality.",
			"Designed and built test panels for functional testing.",
			"Mentored new employees which led to improved onboarding and productivity.",
			"Utilized wiring diagrams and schematics following industry standards.",
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
			"Concentration in Internet of Things and SCADA systems.",
		],
	},
];

const projects = [
	{
		name: "Real Time Energy Monitoring System",
		description:
			"Real time energy monitoring system to optimize university campus power generation. Diverse data from legacy and modern systems was aggregated to monitor historical and real time power metrics on a user-friendly web interface. The system was implemented using a Raspberry Pi to be low power and low cost, while maintaining reliability.",
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
		name: "Security Camera",
		description:
			"Security camera using the ESP32-CAM microcontroller. The camera is capable of capturing images and video, and is equipped with motion detection and live streaming capabilities over Wi-Fi. The system is designed to be low power and low cost, while still providing high reliability and security.",
		tags: [
			{
				name: "ESP32-CAM",
				color: "pink-text-gradient",
			},
		],
		image: security_cam,
	},
	{
		name: "Automated Hopper Dispensing System",
		description:
			"Ladder logic program to automate the dispensing of materials from a hopper into boxes on a conveyor belt. The system was implemented using CLICK programming software in conjunction with a 4-channel PLC interfacing with a conveyor motor, photo sensor, and level switch.",
		tags: [
			{
				name: "Ladder Logic",
				color: "grey-text-gradient",
			},
		],
		image: plc_hopper,
	},
	{
		name: "Antenna Controller Design",
		description:
			"Digital lead controller for an antenna control system using Simulink, employing root locus analysis for system design and optimization. The controller was analyzed and fine-tuned to meet design requirements within a margin of 0.8%.",
		tags: [
			{
				name: "Simulink",
				color: "orange-text-gradient",
			},
		],
		image: antenna_controller,
	},
	{
		name: "Optical Heart Rate Detection Algorithm",
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
		name: "Farm Monitoring",
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
	{
		name: "Antikythera Simulator",
		description:
			"Application that displays the solar system along with planetary event dates from a database. Enables users to search/sort planetary events and view the solar system simulation from any date.",
		tags: [
			{
				name: "Python",
				color: "green-text-gradient",
			},
			{
				name: "SQL",
				color: "blue-text-gradient",
			},
		],
		image: antikythera,
		source_code_link: "https://github.com/vikvakati/ELEC3225AntikytheraProject",
	},
	{
		name: "Image Restoration",
		description:
			"Application to remove motion blur from videos and images by estimating blur angle and length and then applying weiner deconvolution. The interface allows the user to select a video or image, and then the application automatically estimates the blur angle and length and displays the deblurred image.",
		tags: [
			{
				name: "Matlab",
				color: "orange-text-gradient",
			},
		],
		image: deblur,
		source_code_link: "https://github.com/",
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
		link: "https://www.linkedin.com/in/vikranth-vakati/",
	},
	{
		name: "Gmail",
		alt: "gmail",
		icon: gmail,
		link: "mailto:vikvakati@gmail.com",
	},
];
export { services, technologies, experiences, projects, socials };
