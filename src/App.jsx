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
} from "./components";

//TODO- load images separately to optimize performance
//TODO- add footer with credits and signature

const App = () => {
	return (
		<BrowserRouter>
			<div className="bg-primary">
				<Navbar />
				<div className="relative z-0">
					<Hero />
					<StarsCanvas />
				</div>
				<About />
				<Experience />
				<Works />
				<div className="relative z-0">
					<Tech />
					<Contact />
					<StarsCanvas />
				</div>
			</div>
		</BrowserRouter>
	);
};

export default App;
