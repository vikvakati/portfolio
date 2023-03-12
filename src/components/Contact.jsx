import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Tilt from "react-tilt";
import emailjs from "@emailjs/browser"; // using emailjs.com service to send emails

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { socials } from "../constants";

const Contact = () => {
	const formRef = useRef();
	const [form, setForm] = useState({ name: "", email: "", message: "" });

	const [loading, setLoading] = useState(false);

	//TODO- email functionality is disabled for now
	const handleChange = (e) => {
		// const { name, value } = e.target;
		// setForm({ ...form, [name]: value });
		// setForm({ ...form, [name]: value });
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

	const SocialLink = () => {
		return socials.map((social) => (
			<div
				key={social.name}
				onClick={() => window.open(social.link, "_blank")}
				className="z-0 mx-2 w-12 h-12 rounded-full flex justify-center items-center cursor-pointer"
			>
				<Tilt>
					<img src={social.icon} alt={social.alt} className="w-10 h-10" />
				</Tilt>
			</div>
		));
	};

	return (
		<div className="xl:mt-12 xl:flex-row flex-col-reverse flex justify-center gap-10 overflow-hidden">
			<motion.div
				variants={slideIn("left", "tween", 0.2, 1)}
				className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
			>
				<p className={styles.sectionSubText}>Get in touch</p>
				<h3 className={styles.sectionHeadText}>Contact.</h3>

				{/* links to external pages */}
				<div className="absolute inset-0 flex flex-row justify-end m-3 opacity-50">
					<SocialLink />
				</div>

				<form
					ref={formRef}
					onSubmit={handleSubmit}
					className="mt-12 flex flex-col gap-8 relative"
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
						className="bg-[#3781e5] py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl mx-auto"
					>
						<Tilt>{loading ? "Sending..." : "Send"} </Tilt>
					</button>
				</form>
			</motion.div>
		</div>
	);
};

export default SectionWrapper(Contact, "contact");
