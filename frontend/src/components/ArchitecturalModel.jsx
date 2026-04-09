import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Float, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

// ── Realistic Materials ───────────────────────────────────────────────────────
const useArchMaterials = (isDark, isMobile) => {
  return useMemo(() => {
    // Optimization: Use Standard material for mobile to save performance
    const GlassMaterial = isMobile ? THREE.MeshStandardMaterial : THREE.MeshPhysicalMaterial;
    const ConcreteMaterial = isMobile ? THREE.MeshStandardMaterial : THREE.MeshPhysicalMaterial;

    const glass = new GlassMaterial({
      color: isDark ? "#ffffff" : "#DBEAFE",
      metalness: isMobile ? 0.3 : 0.1,
      roughness: 0.1,
      ...(isMobile ? {} : {
        transmission: 0.95,
        thickness: 1.2,
        ior: 1.5,
        dispersion: 5,
        envMapIntensity: 1.5,
      }),
      opacity: 0.6,
      transparent: true,
    });

    const concrete = new ConcreteMaterial({
      color: isDark ? "#1e293b" : "#e2e8f0",
      roughness: 0.8,
      metalness: 0.1,
      ...(isMobile ? {} : { clearcoat: 0.1 }),
    });

    const structure = new THREE.MeshStandardMaterial({
      color: isDark ? "#19D2FF" : "#0EA5E9",
      roughness: 0.2,
      metalness: 0.9,
      emissive: isDark ? "#064e62" : "#bae6fd",
      emissiveIntensity: 0.5,
    });

    return { glass, concrete, structure };
  }, [isDark, isMobile]);
};

// ── Component: Structural Column ──────────────────────────────────────────────
function Column({ x, z, height, material, isMobile }) {
  return (
    <mesh position={[x, height / 2, z]} material={material} castShadow={!isMobile}>
      <boxGeometry args={[0.06, height, 0.06]} />
    </mesh>
  );
}

// ── Component: Floor Slab with Railing ────────────────────────────────────────
function FloorSection({ y, width, depth, materials, isFinished, isMobile }) {
  return (
    <group position={[0, y, 0]}>
      {/* Slab */}
      <mesh geometry={new THREE.BoxGeometry(width, 0.04, depth)} material={materials.concrete} receiveShadow={!isMobile} castShadow={!isMobile} />
      
      {isFinished ? (
        <>
          {/* Glass Facade Overlay */}
          <mesh position={[0, 0.12, depth / 2]} rotation={[0, 0, 0]}>
            <planeGeometry args={[width - 0.1, 0.24]} />
            <primitive object={materials.glass} attach="material" />
          </mesh>
          <mesh position={[0, 0.12, -depth / 2]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[width - 0.1, 0.24]} />
            <primitive object={materials.glass} attach="material" />
          </mesh>
          {!isMobile && (
            <>
              <mesh position={[width / 2, 0.12, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[depth - 0.1, 0.24]} />
                <primitive object={materials.glass} attach="material" />
              </mesh>
              <mesh position={[-width / 2, 0.12, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[depth - 0.1, 0.24]} />
                <primitive object={materials.glass} attach="material" />
              </mesh>
            </>
          )}

          {/* Window Mullions */}
          <mesh position={[0, 0.12, depth / 2 + 0.01]}>
             <boxGeometry args={[0.02, 0.24, 0.02]} />
             <primitive object={materials.structure} attach="material" />
          </mesh>
        </>
      ) : (
        /* Structural beams */
        <mesh position={[0, 0.04, depth / 2]} geometry={new THREE.BoxGeometry(width, 0.02, 0.02)} material={materials.structure} />
      )}
      
      {/* Railing Detail (Desktop Only) */}
      {!isMobile && (
        <mesh position={[0, 0.08, depth / 2 + 0.02]}>
          <boxGeometry args={[width, 0.01, 0.01]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      )}
    </group>
  );
}

// ── Main Building Component ───────────────────────────────────────────────────
function Building({ isDark, scrollProgress = 0, isMobile }) {
  const groupRef = useRef();
  const materials = useArchMaterials(isDark, isMobile);
  // Optimization: Fewer floors on mobile
  const floors = isMobile ? 10 : 16;
  const w = 1.2, d = 0.8;
  const height = floors * 0.3;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1 + (scrollProgress * Math.PI);
      groupRef.current.position.y = -height / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Foundation Base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[w + 0.4, 0.1, d + 0.4]} />
        <meshStandardMaterial color={isDark ? "#0f172a" : "#94a3b8"} roughness={0.9} />
      </mesh>

      {/* Floors Generation */}
      {Array.from({ length: floors }).map((_, i) => (
        <FloorSection
          key={i}
          y={i * 0.3}
          width={w}
          depth={d}
          materials={materials}
          isFinished={i < (floors * 0.7) || scrollProgress > 0.5} 
          isMobile={isMobile}
        />
      ))}

      {/* Main Structural Columns */}
      {[
        [-w / 2, -d / 2], [w / 2, -d / 2], 
        [-w / 2, d / 2], [w / 2, d / 2]
      ].map(([cx, cz], i) => (
        <Column key={i} x={cx} z={cz} height={height} material={materials.structure} isMobile={isMobile} />
      ))}

      {/* Central Core */}
      <mesh position={[0, height / 2, 0]} castShadow={!isMobile}>
        <boxGeometry args={[0.3, height, 0.3]} />
        <meshStandardMaterial color={isDark ? "#1e293b" : "#cbd5e1"} roughness={0.5} />
      </mesh>

      {/* Rooftop */}
      {!isMobile && (
        <group position={[0, height, 0]}>
          <mesh position={[0.3, 0.3, 0.2]}>
             <cylinderGeometry args={[0.01, 0.01, 0.8]} />
             <meshStandardMaterial color={isDark ? "#19D2FF" : "#334155"} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
             <boxGeometry args={[0.4, 0.1, 0.4]} />
             <meshStandardMaterial color={isDark ? "#19D2FF" : "#0EA5E9"} emissive={isDark ? "#19D2FF" : "#0EA5E9"} emissiveIntensity={2} />
          </mesh>
        </group>
      )}

      {/* Structural Data Overlay (Reduced on Mobile) */}
      <group>
        {Array.from({ length: isMobile ? 4 : 12 }).map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 2, Math.random() * height, (Math.random() - 0.5) * 2]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#19D2FF" emissive="#19D2FF" emissiveIntensity={2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function ArchitecturalModel({ scrollProgress = 0 }) {
  const { isDark } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows={!isMobile}
        camera={{ position: isMobile ? [4.5, 3.5, 6] : [3, 2, 4], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[isDark ? "#070d1a" : "#f8fafc"]} />
        
        <ambientLight intensity={isDark ? 0.3 : 0.6} />
        {!isMobile && (
           <>
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow color={isDark ? "#19D2FF" : "#ffffff"} />
              <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.5 : 1} />
           </>
        )}
        <directionalLight position={[0, 10, 0]} intensity={isDark ? 0.2 : 0.4} />

        <Suspense fallback={null}>
          <Building isDark={isDark} scrollProgress={scrollProgress} isMobile={isMobile} />
          {!isMobile && <Environment preset={isDark ? "night" : "city"} />}
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      {/* HUD Details (Simplified on mobile) */}
      <div className="absolute top-6 left-6 pointer-events-none font-mono">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-widest text-cyan-500/80 uppercase">Structural active</span>
        </div>
        {!isMobile && (
          <div className="text-[8px] text-slate-500 uppercase tracking-tighter">
            Load Capacity: 84.9 T/m² | Wind Res: Grade 12
          </div>
        )}
      </div>
    </div>
  );
}



