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
	Tools,
	Footer,
} from "./components";

const EASTER_EGG_LOG = `%c
             ██    ██ ██    ██ 
              ██  ██   ██  ██  
               ████     ████   
                ██       ██    
        👋 Hey there, explorer!
        🔎 Easter Egg Hunt:
        \t\t1) Unlock the source code link!`;

const App = () => {
	const [activeSection, setActiveSection] = useState("");

	useEffect(() => {
		if (!window.__EASTER_EGG_LOGGED__) {
			window.__EASTER_EGG_LOGGED__ = true;
			console.log(
				EASTER_EGG_LOG,
				"color: #00ffcc; font-size: 16px; font-weight: bold;"
			);
		}
	}, []);

	return (
		<BrowserRouter>
			<div className="bg-primary">
				<Navbar onActiveChange={setActiveSection} />
				<div className="relative z-0">
					<Hero />
					<About />
					<Tech />
					<StarsCanvas />
				</div>
				<Experience />
				<Works />
				<Tools />
				<Footer resumeActive={activeSection === "Resume"} />
			</div>
		</BrowserRouter>
	);
};

export default App;
