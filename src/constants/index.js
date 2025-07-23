import {
	iot,
	spectralProcessing,
	engineer,
	web,
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
	ladder,
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
	BB_Calc_demo,
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
		id: "contact",
		title: "Contact",
	},
];

const services = [
	{
		title: "Embedded Systems Engineer",
		icon: iot,
	},
	{
		title: "Electronics Engineer",
		icon: engineer,
	},
	{
		title: "Frontend Developer",
		icon: web,
	},
	{
		title: "Spectral Image Processing",
		icon: spectralProcessing,
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
		name: "MATLAB",
		icon: matlab,
	},
	{
		name: "JavaScript",
		icon: javascript,
	},
	{
		name: "HTML5/CSS",
		icon: html_css,
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
			"Concentration in Internet of Things and SCADA systems.",
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
			"Utilized wiring diagrams and schematics following industry standards.",
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
			"Minors in Internet of Things, Electrical Engineering, and Math.",
		],
	},
];

const projects = [
	{
		name: "Blackbody Spectral Radiance Calculator",
		description:
			"Interactive web-based tool to compute and visualize spectral radiance using Planck’s law. Supports temperature in Celsius or Kelvin, custom waveband ranges, and both wavelength and wavenumber units. Features real-time plotting with Plotly, dynamic unit conversion, and band-integrated radiance calculation. Designed for scientific and engineering use, with responsive layout and intuitive controls.",
		tags: [
			{
				name: "JavaScript",
				color: "yellow-text-gradient",
			},
			{
				name: "HTML/CSS",
				color: "blue-text-gradient",
			},
			{
				name: "Plotly.js",
				color: "green-text-gradient",
			},
		],
		image: BB_Calc_demo,
		source_code_link: "https://www.bodkindesign.com/reference-library/blackbody-spectral-radiance-calculator/",
	},
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
	/*{
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
			"Digital lead controller for an antenna control system in Simulink, utilizing MATLAB's root locus analysis for system analysis, design, and optimization. Achieved a settling time reduction within 0.8% of design requirements through detailed analyses and fine-tuning.",
		tags: [
			{
				name: "Simulink",
				color: "orange-text-gradient",
			},
		],
		image: antenna_controller,
	},*/
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
	/*{
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
	},*/
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
