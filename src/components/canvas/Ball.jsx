import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, OrbitControls, useTexture } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ball = ({ imgUrl }) => {
	const [decal] = useTexture([imgUrl]);

	return (
		<Float speed={4} rotationIntensity={0.5} floatIntensity={2}>
			<mesh scale={2.75}>
				<icosahedronGeometry args={[1, 1]} />

				<meshStandardMaterial
					color="#fff8eb"
					polygonOffset
					polygonOffsetFactor={-5}
					flatShading
				/>

				<Decal
					position={[0, 0, 1]}
					rotation={[2 * Math.PI, 0, 6.25]}
					flatShading
					map={decal}
				/>
			</mesh>
		</Float>
	);
};

const BallCanvas = ({ icon }) => {
	return (
		<Canvas
			dpr={[1, 1.5]}
			gl={{
				antialias: true,
				powerPreference: "high-performance",
			}}
		>
			<Suspense fallback={<CanvasLoader />}>
				<ambientLight intensity={0.25} />

				<directionalLight position={[0, 0, 0.5]} />

				<Ball imgUrl={icon} />

				<OrbitControls enableZoom={false} enablePan={false} />
			</Suspense>
		</Canvas>
	);
};

export default BallCanvas;
