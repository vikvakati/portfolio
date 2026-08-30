import { useRef, useState, useEffect, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = ({ isVisible }) => {
	const ref = useRef();
	const sphere = random.inSphere(new Float32Array(5000), { radius: 1.2 });

	useFrame((_, delta) => {
		// Skip the rotation update entirely while this section is scrolled
		// out of view, instead of animating forever in the background.
		if (!isVisible || !ref.current) return;
		ref.current.rotation.x -= delta / 10;
		ref.current.rotation.y -= delta / 15;
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
const StarsCanvas = memo(() => {
	const containerRef = useRef(null);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ threshold: 0 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={containerRef} className="w-full h-full absolute inset-0 z-[-1]">
			<Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 1] }}>
				<Suspense fallback={null}>
					<Stars isVisible={isVisible} />
				</Suspense>
				<Preload all />
			</Canvas>
		</div>
	);
});

export default StarsCanvas;
