import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Earth = () => {
	const earth = useGLTF("./earth.gltf");
	return (
		<mesh>
			<hemisphereLight intensity={0.3} groundColor="white" />
			<spotLight position={[-20, 50, 10]} intensity={0.6} />
			<primitive object={earth.scene} scale={1.55} position-y={-0.4} />
		</mesh>
	);
};

const EarthCanvas = () => {
	return (
		<Canvas
			shadows
			gl={{ preserveDrawingBuffer: true }}
			camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}
			style={{ cursor: "default" }}
		>
			<Suspense fallback={<CanvasLoader />}>
				<OrbitControls
					frameLoop="demand"
					autoRotate={true}
					autoRotateSpeed={1.25}
					enableRotate={false}
					enableZoom={false}
					maxPolarAngle={Math.PI / 2}
					minPolarAngle={Math.PI / 2}
				/>
				<Earth />
			</Suspense>
			<Preload all />
		</Canvas>
	);
};

export default EarthCanvas;
