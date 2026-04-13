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
  Instance
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
        emissiveIntensity: isDark ? 4 : 1.5,
        transparent: true,
        opacity: 0.6
      }),
      floorPlate: new THREE.MeshStandardMaterial({
        color: isDark ? "#0f172a" : "#f1f5f9",
        roughness: 0.5,
        metalness: 0.1,
      }),
      accentLine: new THREE.MeshStandardMaterial({
        color: "#19D2FF",
        emissive: "#19D2FF",
        emissiveIntensity: 10,
      }),
      latticeMaterial: new THREE.MeshStandardMaterial({
        color: isDark ? "#19D2FF" : "#0ea5e9",
        emissive: "#19D2FF",
        emissiveIntensity: isDark ? 1.5 : 0.5,
        transparent: true,
        opacity: 0.8,
        wireframe: true
      })
    };
  }, [isDark, isMobile]);
};

// ── Sub-Component: StructuralLattice (X-Bracing) ─────────────────────────────
function StructuralLattice({ radius, floors, floorHeight, material }) {
  const latticeGeo = useMemo(() => new THREE.CylinderGeometry(radius + 0.12, radius + 0.12, floors * floorHeight, 6, 1, true), [radius, floors, floorHeight]);
  
  return (
    <mesh position={[0, (floors * floorHeight) / 2, 0]} rotation={[0, Math.PI / 6, 0]}>
      <primitive object={latticeGeo} attach="geometry" />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ── Sub-Component: FloorSystem (Optimized Instances) ───────────────────────────
function FloorSystem({ floors, floorHeight, radius, material }) {
  const sliceGeometry = useMemo(() => new THREE.CylinderGeometry(radius, radius, 0.04, 24, 1, false, 0, Math.PI * 1.5), [radius]);
  
  return (
    <Instances range={floors} geometry={sliceGeometry} material={material}>
      {Array.from({ length: floors }).map((_, i) => (
        <Instance 
          key={`floor-${i}`} 
          position={[0, i * floorHeight, 0]} 
          rotation={[0, i * 0.08, 0]} 
        />
      ))}
    </Instances>
  );
}

// ── Sub-Component: BlueprintScanner (Animated Effect) ─────────────────────────
function BlueprintScanner({ floors, floorHeight, radius }) {
  const scanRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (scanRef.current) {
      scanRef.current.position.y = (Math.sin(t * 0.8) * 0.5 + 0.5) * (floors * floorHeight);
    }
  });

  return (
    <group ref={scanRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.2, radius + 0.4, 32]} />
        <meshStandardMaterial 
          color="#19D2FF" 
          emissive="#19D2FF" 
          emissiveIntensity={15} 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight color="#19D2FF" intensity={4} distance={6} />
    </group>
  );
}

// ── Component: ArchMasterpiece (The Refined Hero Model) ────────────────────────
function ArchMasterpiece({ floors = 16, scale = 1, materials, isMobile, isDark }) {
  const groupRef = useRef();
  const floorHeight = 0.75;
  const radius = 2.4;

  const coreGeometry = useMemo(() => new THREE.BoxGeometry(1.6, floors * floorHeight, 1.6), [floors, floorHeight]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Smooth continuous base rotation
      groupRef.current.rotation.y = t * 0.08;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Central Structural Core */}
      <mesh position={[0, (floors * floorHeight) / 2, 0]}>
        <primitive object={coreGeometry} attach="geometry" />
        <meshStandardMaterial 
          color={materials.brushedMetal.color} 
          roughness={0.3} 
          metalness={0.9} 
          envMapIntensity={2}
        />
      </mesh>

      {/* Structural Systems */}
      <FloorSystem floors={floors} floorHeight={floorHeight} radius={radius} material={materials.floorPlate} />
      {!isMobile && (
        <>
          <StructuralLattice radius={radius} floors={floors} floorHeight={floorHeight} material={materials.latticeMaterial} />
          <BlueprintScanner floors={floors} floorHeight={floorHeight} radius={radius} />
        </>
      )}

      {/* Main Glass Facade */}
      <mesh position={[0, (floors * floorHeight) / 2, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <cylinderGeometry args={[radius + 0.1, radius + 0.1, floors * floorHeight, 24, 1, true, 0, Math.PI * 1.5]} />
        <primitive object={materials.glassFacade} attach="material" />
      </mesh>

      {/* Signature Top Ring */}
      <mesh position={[0, floors * floorHeight + 0.05, 0]}>
        <torusGeometry args={[radius * 0.8, 0.02, 16, 100]} />
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
      console.warn = originalWarn;
    };
  }, []);

  const materials = usePremiumMaterials(isDark, isMobile);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
      <Canvas
        shadows={{ type: THREE.VSMShadowMap }}
        dpr={isMobile ? [1, 1.2] : [1, 1.5]}
        gl={{ 
           antialias: true, 
           alpha: false, 
           depth: true,
           powerPreference: "high-performance",
           toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={isMobile ? [18, 14, 22] : [14, 12, 16]} 
          fov={isMobile ? 32 : 24} 
        />
        <color attach="background" args={[isDark ? "#020617" : "#f8fafc"]} />
        
        {!isMobile && isDark && <Stars radius={100} depth={50} count={3000} factor={6} saturation={0} fade speed={1} />}

        <ambientLight intensity={isDark ? 0.4 : 0.7} />
        <spotLight 
          position={[25, 40, 25]} 
          angle={0.2} 
          penumbra={1} 
          intensity={isDark ? 5 : 2.5} 
          castShadow 
          shadow-bias={-0.0005} 
        />
        
        <pointLight position={[-20, 15, -20]} intensity={isDark ? 3 : 1.5} color="#38bdf8" />
        <pointLight position={[0, -4, 0]} intensity={isDark ? 8 : 0} color="#19D2FF" distance={40} />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            {/* Lifted group to [0, -4.8, 0] to avoid z-fighting with ground at -5 */}
            <group position={[0, -4.8, 0]} rotation={[0, scrollProgress * Math.PI * 1.2, 0]}>
              <ArchMasterpiece floors={isMobile ? 12 : 20} materials={materials} isMobile={isMobile} isDark={isDark} />
            </group>
          </Float>

          {/* Premium Environment System */}
          <group position={[0, -5, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              {!isMobile && isDark ? (
                <MeshReflectorMaterial
                  blur={[400, 100]}
                  resolution={512}
                  mixBlur={1}
                  mixStrength={6}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#020617"
                  metalness={0.9}
                />
              ) : (
                <meshStandardMaterial color={isDark ? "#020617" : "#f1f5f9"} roughness={0.9} />
              )}
            </mesh>
            
            {/* Adjusted Grid to 0.01 to stay just above ground but below shadows */}
            <Grid 
              infiniteGrid 
              cellSize={1.2} 
              sectionSize={6} 
              cellColor={isDark ? "#1e293b" : "#cbd5e1"} 
              sectionColor={isDark ? "#19D2FF" : "#0ea5e9"} 
              fadeDistance={50} 
              position={[0, 0.01, 0]}
            />
          </group>

          <Environment preset={isDark ? "night" : "warehouse"} />
          {/* Shadows at -4.98 to stay between grid(0.01) and model(-4.8) */}
          {!isMobile && <ContactShadows position={[0, -4.98, 0]} opacity={0.5} scale={40} blur={2.2} far={10} />}
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.4} 
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.1} 
        />
      </Canvas>
    </div>
  );
}
