import {
	iot,
	backend,
	engineer,
	web,
	javascript,
	cpp,
	html,
	css,
	reactjs,
	python,
	tailwind,
	nodejs,
	sql,
	git,
	matlab,
	linux,
	opencv,
	wit_seal,
	delta_magnetics,
	farm,
	antikythera,
	deblur,
	threejs,
	github,
	linkedin,
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
		title: "Web Developer",
		icon: web,
	},
	{
		title: "IoT Developer",
		icon: iot,
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
		name: "JavaScript",
		icon: javascript,
	},
	{
		name: "Node JS",
		icon: nodejs,
	},
	{
		name: "Three JS",
		icon: threejs,
	},
	{
		name: "React JS",
		icon: reactjs,
	},
	{
		name: "HTML 5",
		icon: html,
	},
	{
		name: "CSS 3",
		icon: css,
	},
	{
		name: "Tailwind CSS",
		icon: tailwind,
	},
	{
		name: "Python",
		icon: python,
	},
	{
		name: "OpenCV",
		icon: opencv,
	},
	{
		name: "C/C++",
		icon: cpp,
	},
	{
		name: "Matlab",
		icon: matlab,
	},
	{
		name: "SQL",
		icon: sql,
	},
	{
		name: "git",
		icon: git,
	},
	//TODO- manage WebGL contexts to allow more tech icons
	// {
	// 	name: "Linux",
	// 	icon: linux,
	// },
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
		title: "Learning Labs Leader",
		company_name: "Wentworth Institute of Technology",
		icon: wit_seal,
		iconBg: "#383E56",
		date: "Jan 2020 - Dec 2022",
		points: [
			"Collaborating with team of faculty to develop innovative instructional methodologies.",
			"Managing review sessions and providing constructive feedback to students.",
		],
	},
	{
		title: "Electronics Technician",
		company_name: "Delta Magnetics and Controls",
		icon: delta_magnetics,
		iconBg: "#081741",
		date: "Jan 2021 - Jan 2023",
		points: [
			"Testing control panel systems visually, point to point, and operationally.",
			"Designing and building test panels for functional testing.",
			"Collaborating with a team of designers and technicians to ensure customer satisfaction.",
		],
	},
	{
		title: "Master of Science",
		company_name: "Wentworth Institute of Technology",
		icon: wit_seal,
		iconBg: "#383E56",
		date: "Jan 2023 - Present",
		points: [
			"M.S. Computer Engineering.",
			"Concentration in Internet of Things and SCADA systems.",
		],
	},
];

const projects = [
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
		link: "https://github.com/vikvakati?tab=repositories",
	},
	{
		name: "LinkedIn",
		alt: "linkedin",
		icon: linkedin,
		link: "https://www.linkedin.com/in/vikranth-vakati-94912a195",
	},
];
export { services, technologies, experiences, projects, socials };
