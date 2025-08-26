import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import {
	About,
	Experience,
	Hero,
	Navbar,
	Tech,
	Works,
	StarsCanvas,
	// Game,
	Footer,
} from "./components";

const App = () => {
	const [activeSection, setActiveSection] = useState(""); // Shared

	// Log only once in dev, even with StrictMode double-mount
	useEffect(() => {
		if (!window.__EASTER_EGG_LOGGED__) {
			window.__EASTER_EGG_LOGGED__ = true;
			console.log(
				`%c
             ██    ██ ██    ██ 
              ██  ██   ██  ██  
               ████     ████   
                ██       ██    
        👋 Hey there, explorer!
        🔎 Easter Egg Hunt:
				1) Unlock the source code link!`,
				"color: #00ffcc; font-size: 16px; font-weight: bold;"
			);
		}
	}, []);

	return (
		<BrowserRouter>
			<div className="bg-primary">
				{/* Navbar reports the current active title (e.g., "Resume") */}
				<Navbar onActiveChange={setActiveSection} />

				<div className="relative z-0">
					<Hero />
					<StarsCanvas />
					<About />
					<Tech />
				</div>

				<Experience />
				<Works />

				<div className="relative z-0">
					{/* <Game /> */}
					{/* <Contact /> */}
					<StarsCanvas />
				</div>

				{/* Footer decides whether the source link is active */}
			</div>
			<Footer resumeActive={activeSection === "Resume"} />
		</BrowserRouter>
	);
};

export default App;
