import { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser"; // using emailjs.com service to send emails

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { github, linkedin } from "../assets";

const Contact = () => {
	const formRef = useRef();
	const [isSent, setIsSent] = useState(false);
	const [form, setForm] = useState({ name: "", email: "", message: "" });

	const [loading, setLoading] = useState(false);

	// state variable and event handlers to toggle cursor on click event
	const [isGrabbing, setIsGrabbing] = useState(false);

	function handleMouseDown() {
		setIsGrabbing(true);
	}

	function handleMouseUp() {
		setIsGrabbing(false);
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		emailjs
			.send(
				"template_7u4pna3", //template id
				"service_dsu8slh", //service id
				{
					//create object with options
					from_name: form.name,
					to_name: "Vik",
					from_email: form.email,
					to_email: "vikvakati@gmail.com",
					message: form.message,
				},
				"56--GvPfpGoliTG9I" //public key
			)
			.then(
				() => {
					setLoading(false);
					alert(
						"Message sent successfully, I well get back to you as soon as possible!"
					);

					//reset form
					setForm({ name: "", email: "", message: "" });
				},
				(error) => {
					setLoading(false);
					console.log(error);
					alert("Something went wrong, please try again later!");
				}
			);
	};

	return (
		<div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
			<motion.div
				variants={slideIn("left", "tween", 0.2, 1)}
				className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
			>
				<p className={styles.sectionSubText}>Get in touch</p>
				<h3 className={styles.sectionHeadText}>Contact.</h3>

				{/* links to external pages */}
				{/* TODO- socails to index.js linkedin */}
				<div className="absolute inset-0 flex flex-row justify-end m-3 opacity-75">
					<div
						onClick={() =>
							window.open(
								"https://github.com/vikvakati?tab=repositories",
								"_blank"
							)
						}
						className="mx-2 black-gradient w-11 h-11 rounded-full flex justify-center items-center cursor-pointer"
					>
						<img src={github} alt="github" className="w-7 h-7" />
					</div>
					<div
						onClick={() =>
							window.open(
								"https://www.linkedin.com/in/vikranth-vakati-94912a195",
								"_blank"
							)
						}
						className="mx-2 black-gradient w-11 h-11 rounded-full flex justify-center items-center cursor-pointer"
					>
						<img src={linkedin} alt="linkedin" className="w-7 h-7" />
					</div>
				</div>

				<form
					ref={formRef}
					onSubmit={handleSubmit}
					className="mt-12 flex flex-col gap-8"
				>
					<label className="flex flex-col">
						<span className="text-white font-medium mb-4">Name</span>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="Enter your name"
							className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
						/>
					</label>
					<label className="flex flex-col">
						<span className="text-white font-medium mb-4">Email</span>
						<input
							type="text"
							name="email"
							value={form.email}
							onChange={handleChange}
							placeholder="example@domain.com"
							className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
						/>
					</label>
					<label className="flex flex-col">
						<span className="text-white font-medium mb-4">Message</span>
						<textarea
							rows="7"
							name="message"
							value={form.message}
							onChange={handleChange}
							placeholder="Enter your message here..."
							className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
						/>
					</label>
					<button
						type="submit"
						className="bg-tertiary py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl mx-auto"
					>
						{loading ? "Sending..." : "Send"}{" "}
					</button>
				</form>
			</motion.div>

			{/* <motion.div
				variants={slideIn("right", "tween", 0.2, 1)}
				className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
			>
				<div
					className={`w-full h-full relative group ${
						isGrabbing ? "cursor-grabbing" : "cursor-grab"
					}`}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
				>
					<EarthCanvas />
				</div>
			</motion.div> */}
		</div>
	);
};

export default SectionWrapper(Contact, "contact");
