import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerspectiveCamera, Stars } from "@react-three/drei";
import * as THREE from "three";

function Building({ instances = 1 }) {
  const meshRef = useRef();
  
  // Create a procedural skyscraper-like structure using stacked boxes
  const buildings = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 6; i++) {
      temp.push({
        position: [0, i * 1.5, 0],
        scale: [3 - i * 0.4, 1.5, 3 - i * 0.4],
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position}>
          <boxGeometry args={b.scale} />
          <meshStandardMaterial 
            color="#00D2FF" 
            wireframe 
            transparent 
            opacity={0.3 + (i * 0.1)} 
          />
        </mesh>
      ))}
      
      {/* Central Core */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 10, 8]} />
        <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={2} />
      </mesh>

      {/* Pulsing light at top */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 9, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={5} />
          <pointLight color="#00D2FF" intensity={5} distance={10} />
        </mesh>
      </Float>
    </group>
  );
}

export default function TechnicalBuilding() {
  return (
    <div className="w-full h-[600px] cursor-grab active:cursor-grabbing">
      <Canvas shadow={{ enabled: true }} alpha={true}>
        <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={35} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00D2FF" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <Building />
        </Float>
        
        <gridHelper args={[20, 20, "#111", "#050505"]} position={[0, -1, 0]} />
      </Canvas>
    </div>
  );
}
