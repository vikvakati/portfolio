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
				<Footer />
			</div>
		</BrowserRouter>
	);
};

export default App;
