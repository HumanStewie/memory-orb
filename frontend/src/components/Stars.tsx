import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function StarSystem() {
  const starsRef = useRef<THREE.Points>(null!);
  useFrame(() => {
    starsRef.current.rotation.x += 0.0002;
    starsRef.current.rotation.y += 0.0002;
    starsRef.current.rotation.z += 0.0002;
  });
  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={10}
      count={1500}
      factor={6}
      saturation={9}
      speed={1}
      
    />
  );
}
