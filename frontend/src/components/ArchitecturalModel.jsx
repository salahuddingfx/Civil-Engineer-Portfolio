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
    
    return {
      glass: new GlassMaterial({
        color: isDark ? "#0ea5e9" : "#ffffff",
        metalness: 0.2,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true,
        envMapIntensity: isDark ? 1.5 : 1,
        ...(isMobile ? {} : { transmission: 0.8, thickness: 1, ior: 1.45 })
      }),
      concrete: new THREE.MeshPhysicalMaterial({
        color: isDark ? "#1a2233" : "#f1f5f9",
        roughness: 0.6,
        metalness: 0.2,
        flatShading: false,
        envMapIntensity: 1.2,
      }),
      structuralSteel: new THREE.MeshStandardMaterial({
        color: isDark ? "#334155" : "#94a3b8",
        roughness: 0.1,
        metalness: 1,
        envMapIntensity: isDark ? 2.5 : 2,
      }),
      craneYellow: new THREE.MeshStandardMaterial({
        color: "#fbbf24",
        roughness: 0.3,
        metalness: 0.7,
        emissive: "#fbbf24",
        emissiveIntensity: isDark ? 0.2 : 0,
      }),
      safetyNet: new THREE.MeshStandardMaterial({
        color: "#f97316",
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        wireframe: true,
      }),
      rebar: new THREE.MeshStandardMaterial({
        color: isDark ? "#475569" : "#334155",
        roughness: 0.8,
        metalness: 0.5,
      }),
      blueprintLine: new THREE.MeshStandardMaterial({
        color: "#19D2FF",
        emissive: "#19D2FF",
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
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
      jibRef.current.rotation.y = Math.sin(t * 0.1) * 0.4;
    }
    if (hookRef.current) {
      hookRef.current.position.x = 2 + Math.sin(t * 0.3) * 1;
    }
  });

  const mastSegments = Math.round(height);

  return (
    <group position={[3.5, 0, 3.5]}>
      {/* Structural Mast */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.3, height, 0.3]} />
        <primitive object={materials.structuralSteel} attach="material" />
      </mesh>
      
      {/* Lattice Lattice details */}
      <group>
        {Array.from({ length: mastSegments }).map((_, i) => (
          <group key={i} position={[0, i, 0]}>
             <mesh rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.45, 0.03, 0.03]} />
                <primitive object={materials.craneYellow} attach="material" />
             </mesh>
             <mesh rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.45, 0.03, 0.03]} />
                <primitive object={materials.craneYellow} attach="material" />
             </mesh>
          </group>
        ))}
      </group>

      {/* Jib */}
      <group ref={jibRef} position={[0, height, 0]}>
        <mesh position={[2, 0.1, 0]}>
          <boxGeometry args={[5, 0.15, 0.15]} />
          <primitive object={materials.craneYellow} attach="material" />
        </mesh>
        <group ref={hookRef} position={[2, -0.2, 0]}>
           <mesh position={[0, -1, 0]}>
             <cylinderGeometry args={[0.005, 0.005, 2]} />
             <primitive object={materials.structuralSteel} attach="material" />
           </mesh>
           <group position={[0, -2, 0]} rotation={[0, Math.PI / 4, 0]}>
             <IBeam length={1.5} materials={materials} />
           </group>
        </group>
      </group>
    </group>
  );
}

function IBeam({ length, materials }) {
  return (
    <group scale={[0.08, 0.08, 1]}>
      <mesh><boxGeometry args={[1, 0.1, length * 10]} /><primitive object={materials.structuralSteel} attach="material" /></mesh>
      <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.1, 1, length * 10]} /><primitive object={materials.structuralSteel} attach="material" /></mesh>
      <mesh position={[0, 1, 0]}><boxGeometry args={[1, 0.1, length * 10]} /><primitive object={materials.structuralSteel} attach="material" /></mesh>
    </group>
  );
}

// ── Component: Optimized Structural Elements ───────────────────────────────────
function StructuralSkeleton({ floors, materials, isMobile }) {
  const floorHeight = 1.2;
  const pillarGeometry = useMemo(() => new THREE.CylinderGeometry(0.18, 0.22, floorHeight, 8), [floorHeight]);
  const slabGeometry = useMemo(() => new THREE.BoxGeometry(4, 0.08, 4), []);
  const beamGeometry = useMemo(() => new THREE.BoxGeometry(4, 0.1, 0.1), []);
  const rebarGeometry = useMemo(() => new THREE.CylinderGeometry(0.008, 0.008, 0.5), []);

  return (
    <group>
      {/* Slabs */}
      <Instances range={floors} geometry={slabGeometry} material={materials.concrete}>
        {Array.from({ length: floors }).map((_, i) => (
          <Instance key={`slab-${i}`} position={[0, i * floorHeight, 0]} />
        ))}
      </Instances>

      {/* Structural Columns */}
      <Instances range={floors * 4} geometry={pillarGeometry} material={materials.concrete}>
        {Array.from({ length: floors }).map((_, i) => (
          [[ -1.8, -1.8 ], [ 1.8, -1.8 ], [ 1.8, 1.8 ], [ -1.8, 1.8 ]].map(([x, z], idx) => (
            <Instance key={`pillar-${i}-${idx}`} position={[x, i * floorHeight + floorHeight / 2, z]} />
          ))
        ))}
      </Instances>

      {/* Structural Beams (Depth Improvement) */}
      {!isMobile && (
        <Instances range={floors * 8} geometry={beamGeometry} material={materials.structuralSteel}>
          {Array.from({ length: floors }).map((_, i) => (
            [
              { pos: [0, i * floorHeight + floorHeight - 0.05, 1.8], rot: [0, 0, 0] },
              { pos: [0, i * floorHeight + floorHeight - 0.05, -1.8], rot: [0, 0, 0] },
              { pos: [1.8, i * floorHeight + floorHeight - 0.05, 0], rot: [0, Math.PI / 2, 0] },
              { pos: [-1.8, i * floorHeight + floorHeight - 0.05, 0], rot: [0, Math.PI / 2, 0] }
            ].map((beam, bIdx) => (
              <Instance key={`beam-${i}-${bIdx}`} position={beam.pos} rotation={beam.rot} />
            ))
          ))}
        </Instances>
      )}

      {/* Floor Details */}
      {Array.from({ length: floors }).map((_, i) => {
        const isTop = i === floors - 1;
        const isFinished = i <= floors / 2;
        const isScaffold = !isMobile && i % 4 === 0;
        
        return (
          <group key={i} position={[0, i * floorHeight, 0]}>
            {isTop && (
              <Instances range={16} geometry={rebarGeometry} material={materials.rebar}>
                {[[-1.8, -1.8], [1.8, -1.8], [1.8, 1.8], [-1.8, 1.8]].map(([px, pz], pidx) => (
                   [[-0.06, -0.06], [0.06, -0.06], [0.06, 0.06], [-0.06, 0.06]].map(([rx, rz], ridx) => (
                     <Instance key={`rebar-${pidx}-${ridx}`} position={[px + rx, floorHeight + 0.2, pz + rz]} />
                   ))
                ))}
              </Instances>
            )}

            {isFinished && (
              <mesh position={[0, floorHeight / 2, 0]}>
                <boxGeometry args={[3.85, floorHeight - 0.1, 3.85]} />
                <primitive object={materials.glass} attach="material" />
              </mesh>
            )}

            {isScaffold && (
              <group position={[2.3, floorHeight / 2, 0]}>
                <mesh><boxGeometry args={[0.3, floorHeight, 1.5]} /><meshStandardMaterial wireframe color="#475569" /></mesh>
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
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ 
           antialias: true, 
           alpha: false, 
           stencil: false, 
           depth: true,
           powerPreference: "high-performance",
           toneMapping: THREE.ACESFilmicToneMapping
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.VSMShadowMap;
        }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={isMobile ? [18, 14, 22] : [10, 10, 14]} 
          fov={isMobile ? 32 : 28} 
        />
        <color attach="background" args={[isDark ? "#020617" : "#f8fafc"]} />
        
        {!isMobile && isDark && <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />}

        {/* Global Illumination */}
        <ambientLight intensity={isDark ? 0.75 : 1} />
        
        {/* Main Key Light */}
        <spotLight 
          position={[15, 25, 15]} 
          angle={0.3} 
          penumbra={0.5} 
          intensity={isDark ? 3.5 : 1.5} 
          castShadow 
          shadow-bias={-0.00005} 
          shadow-mapSize={[1024, 1024]} 
          color={isDark ? "#e0f2fe" : "#ffffff"}
        />
        
        {/* Fill Lights */}
        <pointLight position={[-10, 5, -10]} intensity={isDark ? 1 : 0.4} color={isDark ? "#38bdf8" : "#94a3b8"} />
        
        {/* Blueprint Glow (Higher up) */}
        <pointLight position={[0, -1, 0]} intensity={isDark ? 3 : 0} color="#19D2FF" distance={20} />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.05}>
            <group position={[0, -6.5, 0]} rotation={[0, scrollProgress * Math.PI * 0.5, 0]} scale={isMobile ? 0.75 : 0.75}>
              <StructuralSkeleton floors={isMobile ? 10 : 16} materials={materials} isMobile={isMobile} />
              <TowerCrane height={isMobile ? 12 : 18} materials={materials} />
            </group>
          </Float>

          {/* Stable Ground System */}
          <group position={[0, -2.56, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              {!isMobile && isDark ? (
                <MeshReflectorMaterial
                  blur={[300, 100]}
                  resolution={1024}
                  mixBlur={1}
                  mixStrength={2}
                  roughness={1}
                  depthScale={1}
                  minDepthThreshold={0.5}
                  maxDepthThreshold={1.2}
                  color="#020617"
                  metalness={0.6}
                />
              ) : (
                <meshStandardMaterial 
                  color={isDark ? "#020617" : "#f1f5f9"} 
                  roughness={0.8}
                  metalness={0.1}
                />
              )}
            </mesh>
            
            {/* Stable Engineering Grid */}
            <Grid 
              infiniteGrid 
              cellSize={1} 
              sectionSize={5} 
              cellColor={isDark ? "#1e293b" : "#cbd5e1"} 
              sectionColor={isDark ? "#19D2FF" : "#0ea5e9"} 
              fadeDistance={40} 
              position={[0, 0.05, 0]}
              fadeStrength={1}
            />
          </group>

          <Environment preset={isDark ? "night" : "city"} />
          {!isMobile && <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={40} blur={2} far={4.5} />}
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.12} 
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.2} 
        />
      </Canvas>
    </div>
  );
}
