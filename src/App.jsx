import { BrowserRouter } from "react-router-dom";
import {
	About,
	Contact,
	Experience,
	Hero,
	Navbar,
	Tech,
	Works,
	StarsCanvas,
	Game,
	Footer,
} from "./components";

const App = () => {
	console.log(
		`%c
		     ██    ██ ██    ██ 
		      ██  ██   ██  ██  
		       ████     ████   
		        ██       ██    
		👋 Hey there, explorer!`,
		"color: #00ffcc; font-size: 16px; font-weight: bold;"
	);
	return (
		<BrowserRouter>
			<div className="bg-primary">
				<Navbar />
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
					<Contact />
					<StarsCanvas />
				</div>
				<Footer />
			</div>
		</BrowserRouter>
	);
};

export default App;
