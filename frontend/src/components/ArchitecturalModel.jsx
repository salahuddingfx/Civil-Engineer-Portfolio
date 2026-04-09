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

// ── Engineering Material System ────────────────────────────────────────────────
const useEngineeringMaterials = (isDark, isMobile) => {
  return useMemo(() => {
    const GlassMaterial = isMobile ? THREE.MeshStandardMaterial : THREE.MeshPhysicalMaterial;
    const glassProps = {
      color: isDark ? "#0ea5e9" : "#ffffff",
      metalness: 0.1,
      roughness: 0.05,
      opacity: 0.4,
      transparent: true,
      envMapIntensity: 2,
    };

    if (!isMobile) {
      Object.assign(glassProps, {
        transmission: 0.9,
        thickness: 1.5,
        ior: 1.5,
      });
    }
    
    return {
      glass: new GlassMaterial(glassProps),
      concrete: new THREE.MeshPhysicalMaterial({
        color: isDark ? "#334155" : "#e2e8f0",
        roughness: 0.85,
        metalness: 0.1,
        flatShading: true,
      }),
      steel: new THREE.MeshStandardMaterial({
        color: isDark ? "#94a3b8" : "#475569",
        roughness: 0.3,
        metalness: 0.8,
      }),
      craneYellow: new THREE.MeshStandardMaterial({
        color: "#fbbf24",
        roughness: 0.4,
        metalness: 0.6,
      }),
      safetyNet: new THREE.MeshStandardMaterial({
        color: "#f97316",
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        wireframe: true,
      }),
      rebar: new THREE.MeshStandardMaterial({
        color: "#475569",
        roughness: 0.9,
      })
    };
  }, [isDark, isMobile]);
};

// ── Component: Tower Crane ───────────────────────────────────────────────────
function TowerCrane({ height, materials }) {
  const jibRef = useRef();
  const hookRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (jibRef.current) {
      jibRef.current.rotation.y = Math.sin(t * 0.2) * 0.5;
    }
    if (hookRef.current) {
      hookRef.current.position.x = 2 + Math.sin(t * 0.4) * 1.5;
    }
  });

  const mastSegments = Math.floor(height);

  return (
    <group position={[3.5, 0, 3.5]}>
      {/* Mast (Tower) */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.3, height, 0.3]} />
        <primitive object={materials.craneYellow} attach="material" />
      </mesh>
      
      {/* Lattice details for mast - Optimized with Instances */}
      <group position={[0, 0, 0]}>
        {Array.from({ length: mastSegments }).map((_, i) => (
          <group key={i} position={[0, i + 0.5, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.4, 0.02, 0.02]} />
              <primitive object={materials.craneYellow} attach="material" />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[0.4, 0.02, 0.02]} />
              <primitive object={materials.craneYellow} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Jib (Rotating Arm) */}
      <group ref={jibRef} position={[0, height, 0]}>
        {/* Counterweight */}
        <mesh position={[-1.5, 0, 0]}>
          <boxGeometry args={[1, 0.4, 0.4]} />
          <primitive object={materials.concrete} attach="material" />
        </mesh>
        {/* Main Jib */}
        <mesh position={[2.5, 0.2, 0]}>
          <boxGeometry args={[5, 0.2, 0.2]} />
          <primitive object={materials.craneYellow} attach="material" />
        </mesh>
        {/* Trolley and Hook */}
        <group ref={hookRef} position={[2, -0.2, 0]}>
          <mesh>
            <boxGeometry args={[0.4, 0.2, 0.4]} />
            <primitive object={materials.steel} attach="material" />
          </mesh>
          {/* Cable */}
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 2]} />
            <primitive object={materials.steel} attach="material" />
          </mesh>
          {/* Hooked Item (I-Beam) */}
          <group position={[0, -2, 0]} rotation={[0, Math.PI / 4, 0]}>
            <IBeam length={2} materials={materials} />
          </group>
        </group>
      </group>
    </group>
  );
}

function IBeam({ length, materials }) {
  return (
    <group scale={[0.1, 0.1, 1]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.1, length * 10]} />
        <primitive object={materials.steel} attach="material" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, length * 10]} />
        <primitive object={materials.steel} attach="material" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 0.1, length * 10]} />
        <primitive object={materials.steel} attach="material" />
      </mesh>
    </group>
  );
}

// ── Component: Optimized Structural Elements ───────────────────────────────────
function StructuralSkeleton({ floors, materials, isMobile }) {
  const floorHeight = 1.2;
  const pillarGeometry = useMemo(() => new THREE.BoxGeometry(0.3, floorHeight, 0.3), [floorHeight]);
  const slabGeometry = useMemo(() => new THREE.BoxGeometry(4, 0.1, 4), []);
  const rebarGeometry = useMemo(() => new THREE.CylinderGeometry(0.01, 0.01, 0.4), []);

  return (
    <group>
      {/* Optimized Slabs */}
      <Instances range={floors} geometry={slabGeometry} material={materials.concrete}>
        {Array.from({ length: floors }).map((_, i) => (
          <Instance key={`slab-${i}`} position={[0, i * floorHeight, 0]} />
        ))}
      </Instances>

      {/* Optimized Pillars */}
      <Instances range={floors * 4} geometry={pillarGeometry} material={materials.concrete}>
        {Array.from({ length: floors }).map((_, i) => (
          [[ -1.8, -1.8 ], [ 1.8, -1.8 ], [ 1.8, 1.8 ], [ -1.8, 1.8 ]].map(([x, z], idx) => (
            <Instance key={`pillar-${i}-${idx}`} position={[x, i * floorHeight + floorHeight / 2, z]} />
          ))
        ))}
      </Instances>

      {/* Dynamic Non-Instanced Elements (Glass, Netting, etc.) */}
      {Array.from({ length: floors }).map((_, i) => {
        const isTop = i === floors - 1;
        const isMid = !isMobile && i > floors / 2 && i < floors - 1;
        const isFinished = i <= floors / 2;
        
        return (
          <group key={i} position={[0, i * floorHeight, 0]}>
            {/* Rebar on top floors */}
            {isTop && (
              <Instances range={16} geometry={rebarGeometry} material={materials.rebar}>
                {[[-1.8, -1.8], [1.8, -1.8], [1.8, 1.8], [-1.8, 1.8]].map(([px, pz], pidx) => (
                   [[-0.08, -0.08], [0.08, -0.08], [0.08, 0.08], [-0.08, 0.08]].map(([rx, rz], ridx) => (
                     <Instance key={`rebar-${pidx}-${ridx}`} position={[px + rx, floorHeight + 0.2, pz + rz]} />
                   ))
                ))}
              </Instances>
            )}

            {/* Finished Glass Sections */}
            {isFinished && (
              <mesh position={[0, floorHeight / 2, 0]}>
                <boxGeometry args={[3.9, floorHeight, 3.9]} />
                <primitive object={materials.glass} attach="material" />
              </mesh>
            )}

            {/* Safety Netting for Mid Sections */}
            {isMid && (
              <mesh position={[0, floorHeight / 2, 0]}>
                <boxGeometry args={[4.1, floorHeight, 4.1]} />
                <primitive object={materials.safetyNet} attach="material" />
              </mesh>
            )}

            {/* Scaffolding on some floors */}
            {i % 3 === 0 && !isMobile && (
              <group position={[2.2, floorHeight / 2, 0]}>
                <mesh>
                  <boxGeometry args={[0.4, floorHeight, 2]} />
                  <meshStandardMaterial wireframe color="#64748b" />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

// ── Global Scene Handler ──────────────────────────────────────────────────────
export default function ArchitecturalModel({ scrollProgress = 0 }) {
  const { isDark } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Suppress THREE.js deprecation warnings that originate from internal library calls (e.g. Fiber's Clock)
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0]?.includes?.("THREE.THREE.Clock") || args[0]?.includes?.("PCFSoftShadowMap")) return;
      originalWarn(...args);
    };
    return () => { console.warn = originalWarn; };
  }, []);

  const materials = useEngineeringMaterials(isDark, isMobile);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
      <Canvas
        shadows
        dpr={isMobile ? [1, 1] : [1, 2]}
        gl={{ 
           antialias: true, 
           alpha: true, 
           stencil: false, 
           depth: true,
           powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={isMobile ? [18, 14, 22] : [12, 10, 15]} 
          fov={isMobile ? 28 : 38} 
        />
        <color attach="background" args={[isDark ? "#020617" : "#f8fafc"]} />
        
        {!isMobile && <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />}

        <ambientLight intensity={isDark ? 0.4 : 0.8} />
        <spotLight position={[20, 30, 20]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-15, 10, -15]} intensity={1.5} color={isDark ? "#38bdf8" : "#94a3b8"} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
            <group position={[0, -2.5, 0]} rotation={[0, scrollProgress * Math.PI, 0]} scale={isMobile ? 0.8 : 1}>
              <StructuralSkeleton floors={isMobile ? 8 : 12} materials={materials} isMobile={isMobile} />
              <TowerCrane height={isMobile ? 10 : 15} materials={materials} />
            </group>
          </Float>

          {/* Refined Ground / Blueprint */}
          <group position={[0, -2.55, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              {!isMobile && isDark ? (
                <MeshReflectorMaterial
                  blur={[400, 100]}
                  resolution={1024}
                  mixBlur={1}
                  mixStrength={1.5}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#020617"
                  metalness={0.5}
                />
              ) : (
                <meshStandardMaterial 
                  color={isDark ? "#020617" : "#f8fafc"} 
                  roughness={1}
                  metalness={0}
                />
              )}
            </mesh>
            <Grid 
              infiniteGrid 
              cellSize={1} 
              sectionSize={5} 
              cellColor={isDark ? "#1e293b" : "#cbd5e1"} 
              sectionColor={isDark ? "#38bdf8" : "#0ea5e9"} 
              fadeDistance={50} 
            />
          </group>

          <Environment preset={isDark ? "night" : "city"} />
          {!isMobile && <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={30} blur={2.5} />}
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.2} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.1} 
        />
      </Canvas>
    </div>
  );
}
