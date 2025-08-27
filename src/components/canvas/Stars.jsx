import { useRef, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = () => {
	const ref = useRef();
	const sphere = random.inSphere(new Float32Array(5000), { radius: 1.2 });

	useFrame((_, delta) => {
		if (ref.current) {
			ref.current.rotation.x -= delta / 10;
			ref.current.rotation.y -= delta / 15;
		}
	});

	return (
		<group rotation={[0, 0, Math.PI / 4]}>
			<Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
				<PointMaterial
					transparent
					color="#f272c8"
					size={0.002}
					sizeAttenuation
					depthWrite
				/>
			</Points>
		</group>
	);
};

// Memoized so StarsCanvas never remounts on parent re-renders
const StarsCanvas = memo(() => (
	<div className="w-full h-full absolute inset-0 z-[-1]">
		<Canvas camera={{ position: [0, 0, 1] }}>
			<Suspense fallback={null}>
				<Stars />
			</Suspense>
			<Preload all />
		</Canvas>
	</div>
));

export default StarsCanvas;
