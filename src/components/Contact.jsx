import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Tilt from "react-tilt";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { socials } from "../constants";

const Contact = () => {
	const formRef = useRef();
	const [form, setForm] = useState({ name: "", email: "", message: "" });
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		emailjs
			.send(
				"template_7u4pna3",
				"service_dsu8slh",
				{
					from_name: form.name,
					to_name: "Vik",
					from_email: form.email,
					to_email: "vikvakati@gmail.com",
					message: form.message,
				},
				"56--GvPfpGoliTG9I"
			)
			.then(
				() => {
					setLoading(false);
					alert(
						"Message sent successfully, I will get back to you as soon as possible!"
					);
					setForm({ name: "", email: "", message: "" });
				},
				(error) => {
					setLoading(false);
					console.log(error);
					alert("Something went wrong, please try again later!");
				}
			);
	};

	// Social icons lazy rendering
	const LazySocialIcon = ({ social }) => {
		const ref = useRef(null);
		const [visible, setVisible] = useState(false);

		useEffect(() => {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						setVisible(true);
						observer.disconnect();
					}
				},
				{ threshold: 0.1 }
			);
			if (ref.current) observer.observe(ref.current);
			return () => observer.disconnect();
		}, []);

		return (
			<div
				ref={ref}
				onClick={() => window.open(social.link, "_blank")}
				className="z-0 mx-2 w-12 h-12 rounded-full flex justify-center items-center cursor-pointer"
				title={social.name}
			>
				{visible && (
					<Tilt>
						<img
							src={social.icon}
							alt={social.alt}
							className="w-10 h-10"
							loading="lazy"
						/>
					</Tilt>
				)}
			</div>
		);
	};

	return (
		<div className="xl:mt-12 xl:flex-row flex-col-reverse flex justify-center gap-10 overflow-hidden">
			<motion.div
				variants={slideIn("left", "tween", 0.2, 1)}
				className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
			>
				<h3 className={styles.sectionHeadText}>Contact</h3>
				<p className={styles.sectionSubText}>Get in touch.</p>

				{/* social links */}
				<div className="absolute inset-0 flex flex-row justify-end m-3 opacity-50">
					{socials.map((social) => (
						<LazySocialIcon key={social.name} social={social} />
					))}
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
						className="bg-[#3781e5] py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl hover:bg-[#4c8de2] mx-auto"
					>
						{loading ? "Sending..." : "Send"}
					</button>
				</form>

				{/* Dropbox Upload Button */}
				<motion.div
					variants={slideIn("up", "tween", 0.3, 1)}
					className="mt-6 text-center"
				>
					<button
						onClick={() =>
							window.open(
								"https://www.dropbox.com/request/7N80WimUb1gfvzObQCHl",
								"_blank"
							)
						}
						className="bg-green-600 py-3 px-8 outline-none w-fit text-white font-bold shadow-md rounded-xl hover:bg-green-500 transition-colors mx-auto"
					>
						Upload a File
					</button>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default SectionWrapper(Contact, "contact");
