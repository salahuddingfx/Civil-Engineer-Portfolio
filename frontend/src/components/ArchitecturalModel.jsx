import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Float, 
  ContactShadows, 
  Environment, 
  MeshReflectorMaterial, 
  Grid,
  PerspectiveCamera,
  Stars,
  Instances,
  Instance,
  Text
} from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

// ── Cinematic Material System ────────────────────────────────────────────────
const usePremiumMaterials = (isDark, isMobile) => {
  return useMemo(() => {
    const GlassMaterial = isMobile ? THREE.MeshStandardMaterial : THREE.MeshPhysicalMaterial;
    
    return {
      glassFacade: new GlassMaterial({
        color: isDark ? "#0ea5e9" : "#ffffff",
        metalness: 0.9,
        roughness: 0.05,
        opacity: 0.4,
        transparent: true,
        envMapIntensity: isDark ? 2 : 1.2,
        ...(isMobile ? {} : { transmission: 0.9, thickness: 1.5, ior: 1.5 })
      }),
      brushedMetal: new THREE.MeshPhysicalMaterial({
        color: isDark ? "#1e293b" : "#94a3b8",
        roughness: 0.2,
        metalness: 1,
        envMapIntensity: 1.5,
      }),
      internalGlow: new THREE.MeshStandardMaterial({
        color: "#19D2FF",
        emissive: "#19D2FF",
        emissiveIntensity: isDark ? 4 : 2,
        transparent: true,
        opacity: 0.8
      }),
      floorPlate: new THREE.MeshStandardMaterial({
        color: isDark ? "#0f172a" : "#f1f5f9",
        roughness: 0.5,
        metalness: 0.1,
      }),
      accentLine: new THREE.MeshStandardMaterial({
        color: "#19D2FF",
        emissive: "#19D2FF",
        emissiveIntensity: 12,
      })
    };
  }, [isDark, isMobile]);
};

// ── Component: ArchMasterpiece (The New Hero Model) ───────────────────────────
function ArchMasterpiece({ floors = 14, scale = 1, materials, isMobile }) {
  const groupRef = useRef();
  const floorHeight = 0.8;
  const radius = 2.5;

  // Geometry definitions for instancing
  const sliceGeometry = useMemo(() => new THREE.CylinderGeometry(radius, radius, 0.05, 24, 1, false, 0, Math.PI * 1.5), [radius]);
  const coreGeometry = useMemo(() => new THREE.BoxGeometry(1.5, floors * floorHeight, 1.5), [floors, floorHeight]);
  const windowGeometry = useMemo(() => new THREE.BoxGeometry(0.1, 0.1, 0.1), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Central Structural Core */}
      <mesh position={[0, (floors * floorHeight) / 2, 0]}>
        <primitive object={coreGeometry} attach="geometry" />
        <meshStandardMaterial 
          color={materials.brushedMetal.color} 
          roughness={0.4} 
          metalness={0.8} 
        />
      </mesh>

      {/* Internal Floor Plates (Stacked) */}
      <Instances range={floors} geometry={sliceGeometry} material={materials.floorPlate}>
        {Array.from({ length: floors }).map((_, i) => (
          <Instance 
            key={`floor-${i}`} 
            position={[0, i * floorHeight, 0]} 
            rotation={[0, i * 0.1, 0]} // Subtle spiral effect
          />
        ))}
      </Instances>

      {/* Main Glass Facade (Curved Envelope) */}
      <mesh position={[0, (floors * floorHeight) / 2, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <cylinderGeometry args={[radius + 0.1, radius + 0.1, floors * floorHeight, 24, 1, true, 0, Math.PI * 1.5]} />
        <primitive object={materials.glassFacade} attach="material" />
      </mesh>

      {/* Structural Mullions (Vertical Lines) */}
      {!isMobile && Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 3) * (Math.PI * 1.5);
        const x = Math.cos(angle) * (radius + 0.15);
        const z = Math.sin(angle) * (radius + 0.15);
        return (
          <mesh key={`mullion-${i}`} position={[x, (floors * floorHeight) / 2, z]}>
            <boxGeometry args={[0.08, floors * floorHeight, 0.08]} />
            <meshStandardMaterial color={materials.brushedMetal.color} />
          </mesh>
        );
      })}

      {/* Internal Glow Lights (Simulated Occupancy) - Reduced for Performance */}
      <Instances range={floors * 4} geometry={windowGeometry} material={materials.internalGlow}>
        {Array.from({ length: floors }).map((_, fIdx) => (
          Array.from({ length: 4 }).map((_, wIdx) => {
            const angle = (wIdx / 4) * Math.PI * 2;
            const r = radius * (0.4 + Math.random() * 0.4);
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const visible = Math.random() > 0.5; 
            
            return visible ? (
              <Instance 
                key={`glow-${fIdx}-${wIdx}`} 
                position={[x, fIdx * floorHeight + 0.4, z]} 
                scale={Math.random() * 2}
              />
            ) : null;
          })
        ))}
      </Instances>

      {/* Signature Top Accent */}
      <mesh position={[0, floors * floorHeight + 0.1, 0]}>
        <torusGeometry args={[radius * 0.8, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]} />
        <primitive object={materials.accentLine} attach="material" />
      </mesh>
    </group>
  );
}

// ── Global Scene Handler ──────────────────────────────────────────────────────
export default function ArchitecturalModel({ scrollProgress = 0 }) {
  const { isDark } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    // Silence library-level deprecation warnings that clutter the console
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && (args[0].includes('THREE.Clock') || args[0].includes('PCFSoftShadowMap'))) return;
      originalWarn(...args);
    };

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      console.warn = originalWarn; // Restore on unmount
    };
  }, []);

  const materials = usePremiumMaterials(isDark, isMobile);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
      <Canvas
        shadows={{ type: THREE.VSMShadowMap }}
        dpr={isMobile ? [1, 1.2] : [1, 1.25]} // Optimized DPR for performance
        gl={{ 
           antialias: true, 
           alpha: false, 
           stencil: false, 
           depth: true,
           powerPreference: "high-performance",
           toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={isMobile ? [15, 12, 18] : [12, 10, 14]} 
          fov={isMobile ? 35 : 28} 
        />
        <color attach="background" args={[isDark ? "#020617" : "#f8fafc"]} />
        
        {!isMobile && isDark && <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />}

        {/* Cinematic Global Illumination */}
        <ambientLight intensity={isDark ? 0.5 : 0.8} />
        
        {/* Main Key Light (Sunset/Golden Hour Feel) */}
        <spotLight 
          position={[20, 30, 20]} 
          angle={0.25} 
          penumbra={1} 
          intensity={isDark ? 4 : 2} 
          castShadow 
          shadow-bias={-0.0001} 
          color={isDark ? "#bae6fd" : "#fff"}
        />
        
        {/* Back Rim Light */}
        <pointLight position={[-15, 10, -15]} intensity={isDark ? 2 : 1} color={isDark ? "#38bdf8" : "#94a3b8"} />
        
        {/* Core Blueprint Glow */}
        <pointLight position={[0, -2, 0]} intensity={isDark ? 5 : 0} color="#19D2FF" distance={30} />

        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
            <group position={[0, -5, 0]} rotation={[0, scrollProgress * Math.PI * 0.8, 0]}>
              <ArchMasterpiece floors={isMobile ? 10 : 16} materials={materials} isMobile={isMobile} />
            </group>
          </Float>

          {/* Premium Ground System */}
          <group position={[0, -5, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              {!isMobile && isDark ? (
                <MeshReflectorMaterial
                  blur={[400, 100]}
                  resolution={512} // Reduced from 1024 for significant performance boost
                  mixBlur={1}
                  mixStrength={4}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#020617"
                  metalness={0.8}
                />
              ) : (
                <meshStandardMaterial 
                  color={isDark ? "#020617" : "#f1f5f9"} 
                  roughness={0.8}
                />
              )}
            </mesh>
            
            {/* Engineering Coordinate Grid */}
            <Grid 
              infiniteGrid 
              cellSize={1.2} 
              sectionSize={6} 
              cellColor={isDark ? "#1e293b" : "#cbd5e1"} 
              sectionColor={isDark ? "#19D2FF" : "#0ea5e9"} 
              fadeDistance={50} 
              position={[0, 0.05, 0]}
              fadeStrength={1}
            />
          </group>

          <Environment preset={isDark ? "night" : "city"} />
          {!isMobile && <ContactShadows position={[0, -4.9, 0]} opacity={0.4} scale={30} blur={2.5} far={6} />}
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.15} 
          enableDamping
          dampingFactor={0.06}
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.15} 
        />
      </Canvas>
    </div>
  );
}
