import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

// ── Individual floor slab ─────────────────────────────────────────────────────
function FloorSlab({ y, width, depth, color, emissive }) {
  const geom = useMemo(() => new THREE.BoxGeometry(width, 0.06, depth), [width, depth]);
  return (
    <mesh position={[0, y, 0]} geometry={geom} dispose={null}>
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.4} transparent opacity={0.85} />
    </mesh>
  );
}

// ── Column/Pillar ─────────────────────────────────────────────────────────────
function Column({ x, z, height, color, emissive }) {
  const geom = useMemo(() => new THREE.BoxGeometry(0.07, height, 0.07), [height]);
  return (
    <mesh position={[x, height / 2, z]} geometry={geom} dispose={null}>
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.5} transparent opacity={0.9} />
    </mesh>
  );
}

// ── Construction Crane ────────────────────────────────────────────────────────
function Crane({ y, isDark }) {
  const craneRef = useRef();
  const color = isDark ? "#19D2FF" : "#0EA5E9";

  useFrame((state) => {
    if (craneRef.current) {
      craneRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <group ref={craneRef} position={[0, y, 0]}>
      {/* Pillar */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Jib (Arm) */}
      <mesh position={[0.2, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.03, 0.03]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Counterweight */}
      <mesh position={[-0.15, 0.5, 0]}>
        <boxGeometry args={[0.1, 0.08, 0.08]} />
        <meshStandardMaterial color={isDark ? "#ffffff" : "#333"} />
      </mesh>
    </group>
  );
}

// ── Window grid panel ─────────────────────────────────────────────────────────
function WindowPanel({ position, isDark }) {
  const windowColor  = isDark ? "#19D2FF" : "#0EA5E9";
  const emissive     = isDark ? "#0a6080" : "#034f84";
  return (
    <mesh position={position}>
      <planeGeometry args={[0.15, 0.22]} />
      <meshStandardMaterial
        color={windowColor}
        emissive={emissive}
        emissiveIntensity={isDark ? 0.8 : 0.4}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Data Nodes (Engineering Overlay) ──────────────────────────────────────────
function DataNodes({ isDark }) {
  const nodes = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      pos: [(Math.random() - 0.5) * 2.5, Math.random() * 4, (Math.random() - 0.5) * 2.5],
      id: i,
    }));
  }, []);

  return (
    <group>
      {nodes.map((node) => (
        <mesh key={node.id} position={node.pos}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color={isDark ? "#19D2FF" : "#0EA5E9"} emissive={isDark ? "#19D2FF" : "#0EA5E9"} emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

// ── Full building scene ───────────────────────────────────────────────────────
function Building({ isDark }) {
  const groupRef = useRef();
  const floors   = 14;
  const height   = floors * 0.35;
  const w = 1.0, d = 0.65;

  const slabColor    = isDark ? "#1a2744" : "#DBEAFE";
  const slabEmissive = isDark ? "#0a1628" : "#93C5FD";
  const colColor     = isDark ? "#19D2FF" : "#0EA5E9";
  const colEmissive  = isDark ? "#0a5070" : "#0369A1";

  const windows = useMemo(() => {
    const wins = [];
    const sides = [
      { axis: "x", val:  w / 2 + 0.001, swap: false },
      { axis: "x", val: -w / 2 - 0.001, swap: false },
      { axis: "z", val:  d / 2 + 0.001, swap: true  },
      { axis: "z", val: -d / 2 - 0.001, swap: true  },
    ];
    for (let f = 1; f < floors - 1; f++) {
      const y = f * 0.35 - height / 2 + 0.175;
      sides.forEach(({ axis, val, swap }) => {
        const count = swap ? 2 : 3;
        for (let c = 0; c < count; c++) {
          const span = swap ? d * 0.5 : w * 0.6;
          const offset = (c / (count - 1) - 0.5) * span;
          const pos = axis === "x" ? [val, y, offset] : [offset, y, val];
          const rot = axis === "x" ? [0, Math.PI / 2, 0] : [0, 0, 0];
          wins.push({ key: `${f}-${axis}-${val}-${c}`, pos, rot });
        }
      });
    }
    return wins;
  }, [height, floors, w, d]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = -height / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floor slabs with pulse effect */}
      {Array.from({ length: floors }).map((_, i) => (
        <FloorSlab
          key={i}
          y={i * 0.35}
          width={w + 0.12}
          depth={d + 0.12}
          color={slabColor}
          emissive={slabEmissive}
        />
      ))}

      {/* Corner columns */}
      {[[-w/2, -d/2], [w/2, -d/2], [-w/2, d/2], [w/2, d/2]].map(([cx, cz], i) => (
        <Column key={i} x={cx} z={cz} height={height} color={colColor} emissive={colEmissive} />
      ))}

      {/* Window panels */}
      {windows.map(({ key, pos, rot }) => (
        <mesh key={key} position={pos} rotation={rot}>
          <planeGeometry args={[0.15, 0.22]} />
          <meshStandardMaterial
            color={isDark ? "#19D2FF" : "#0EA5E9"}
            emissive={isDark ? "#0a6080" : "#034f84"}
            emissiveIntensity={isDark ? 0.8 : 0.4}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Roof elements */}
      <mesh position={[0, height + 0.1, 0]}>
        <coneGeometry args={[0.04, 0.4, 4]} />
        <meshStandardMaterial color={isDark ? "#19D2FF" : "#0EA5E9"} emissive={isDark ? "#19D2FF" : "#0EA5E9"} emissiveIntensity={2} />
      </mesh>
      
      <Crane y={height} isDark={isDark} />
      <DataNodes isDark={isDark} />

      {/* Foundation */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[w + 0.4, 0.12, d + 0.4]} />
        <meshStandardMaterial color={isDark ? "#0F172A" : "#CBD5E1"} emissive={colEmissive} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// ── Ground plane / grid ───────────────────────────────────────────────────────
function GroundGrid({ isDark }) {
  return (
    <gridHelper
      args={[10, 24, isDark ? "#19D2FF" : "#0EA5E9", isDark ? "#0A1628" : "#BFDBFE"]}
      position={[0, -2.8, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

// ── Floating particles ────────────────────────────────────────────────────────
function Particles({ isDark }) {
  const count = 80;
  const mesh  = useRef();
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.08;
      mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={isDark ? "#19D2FF" : "#0EA5E9"}
        transparent
        opacity={isDark ? 0.7 : 0.5}
        sizeAttenuation
      />
    </points>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ArchitecturalModel() {
  const { isDark } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bgColor = isDark ? "#070d1a" : "#EFF6FF";
  const ambientIntensity = isDark ? 0.4 : 0.9;
  const pointIntensity   = isDark ? 3.0 : 2.0;

  return (
    <div className="w-full h-full relative group">
      <Canvas
        camera={{ 
          position: isMobile ? [3.5, 2.5, 4.5] : [2.5, 1.5, 3.5], 
          fov: isMobile ? 55 : 45 
        }}
        style={{ background: bgColor, borderRadius: "1.5rem" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={ambientIntensity} />
        <pointLight position={[4, 5, 4]} intensity={pointIntensity} color={isDark ? "#19D2FF" : "#0EA5E9"} />
        <pointLight position={[-4, 3, -3]} intensity={isDark ? 1.5 : 0.8} color={isDark ? "#4F46E5" : "#93C5FD"} />
        <directionalLight position={[0, 8, 5]} intensity={isDark ? 0.6 : 1.2} />

        <Building isDark={isDark} />
        <GroundGrid isDark={isDark} />
        <Particles isDark={isDark} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          makeDefault
        />
      </Canvas>
      
      {/* CSS Overlay for tech feel */}
      <div className="absolute top-4 left-4 p-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <p className="text-[10px] font-bold text-cyan-500 tracking-[0.3em] uppercase mb-1">Structural Node v4.9</p>
        <p className="text-[8px] text-cyan-500/50 uppercase tracking-widest font-mono">Simulating Loads...</p>
      </div>
    </div>
  );
}

