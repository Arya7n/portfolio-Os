import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Color, GridHelper, type Group, type Mesh, type Points } from "three";
import { getSceneTheme, type SceneTheme } from "@/data/themes";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOsStore } from "@/store/osStore";

function Particles({ count, color }: { count: number; color: string }) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 14;
      data[i * 3 + 1] = (Math.random() - 0.15) * 7;
      data[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return data;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.018;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function FloatSolid({
  position,
  spin,
  bob,
  reduced,
  children,
}: {
  position: [number, number, number];
  spin: number;
  bob: number;
  reduced: boolean;
  children: ReactNode;
}) {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current || reduced) return;
    const t = clock.elapsedTime;
    mesh.current.position.y = position[1] + Math.sin(t * bob) * 0.14;
    mesh.current.rotation.x = t * spin * 0.35;
    mesh.current.rotation.y = t * spin * 0.55;
  });

  return (
    <mesh ref={mesh} position={position}>
      {children}
    </mesh>
  );
}

function Drift({ reduced, theme }: { reduced: boolean; theme: SceneTheme }) {
  const group = useRef<Group>(null);
  const wallpaper = useOsStore((s) => s.wallpaper);
  const lively = useOsStore((state) => {
    const app = state.windows.find((win) => win.id === state.activeId && !win.minimized)?.appId;
    return app === "terminal" || app === "projects" || app === "skills" || app === "github";
  });

  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    const speed = lively ? 0.11 : 0.07;
    group.current.rotation.y = clock.elapsedTime * speed;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.1;
  });

  return (
    <group ref={reduced ? undefined : group} key={wallpaper}>
      <FloatSolid position={[2.35, 0.85, -1.45]} spin={0.22} bob={0.55} reduced={reduced}>
        <icosahedronGeometry args={[0.52, 0]} />
        <meshStandardMaterial
          color={theme.accent}
          emissive={theme.accent}
          emissiveIntensity={0.22}
          wireframe
          transparent
          opacity={0.55}
        />
      </FloatSolid>
      <FloatSolid position={[-2.55, 0.35, -1.9]} spin={0.18} bob={0.42} reduced={reduced}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={theme.particle}
          emissive={theme.particle}
          emissiveIntensity={0.16}
          wireframe
          transparent
          opacity={0.48}
        />
      </FloatSolid>
      <FloatSolid position={[0.15, 1.15, -2.7]} spin={0.14} bob={0.32} reduced={reduced}>
        <dodecahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          color={theme.light}
          emissive={theme.rim}
          emissiveIntensity={0.08}
          roughness={0.35}
          metalness={0.28}
          transparent
          opacity={0.78}
        />
      </FloatSolid>
      <FloatSolid position={[1.45, -0.45, -2.15]} spin={0.28} bob={0.48} reduced={reduced}>
        <tetrahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={theme.rim}
          wireframe
          transparent
          opacity={0.4}
        />
      </FloatSolid>
      <FloatSolid position={[-1.15, 1.35, -3.05]} spin={0.2} bob={0.38} reduced={reduced}>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={theme.accent}
          emissive={theme.accent}
          emissiveIntensity={0.18}
          roughness={0.28}
          metalness={0.4}
        />
      </FloatSolid>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.95, -1.7]}>
        <torusGeometry args={[1.15, 0.012, 8, 64]} />
        <meshBasicMaterial color={theme.grid} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function ThemeStage({ theme }: { theme: SceneTheme }) {
  const gl = useThree((state) => state.gl);
  const grid = useRef<GridHelper>(null);

  useLayoutEffect(() => {
    gl.setClearColor(theme.void, 1);
  }, [gl, theme.void]);

  useLayoutEffect(() => {
    const material = grid.current?.material;
    if (material && !Array.isArray(material)) {
      material.transparent = true;
      material.opacity = 0.28;
      material.color = new Color(theme.grid);
    }
  }, [theme.grid]);

  return (
    <>
      <color attach="background" args={[theme.void]} />
      <fog attach="fog" args={[theme.fog, 9, 20]} />
      <ambientLight intensity={0.38} />
      <directionalLight position={[3.2, 4.4, 2.4]} intensity={0.62} color={theme.light} />
      <spotLight
        position={[-2.8, 3.6, 2.2]}
        intensity={0.42}
        angle={0.62}
        penumbra={1}
        distance={16}
        color={theme.rim}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.58, 0]}>
        <circleGeometry args={[18, 64]} />
        <meshStandardMaterial color={theme.floor} roughness={0.96} metalness={0.02} />
      </mesh>
      <gridHelper
        ref={grid}
        key={theme.id}
        args={[22, 28, theme.grid, theme.grid]}
        position={[0, -1.55, 0]}
      />
    </>
  );
}

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    const camera = state.camera;
    const targetZ = 5.7;
    camera.position.z += (targetZ - camera.position.z) * 0.035;
    if (reduced) {
      camera.lookAt(0, 0.1, 0);
      return;
    }
    const x = state.pointer.x * 0.48;
    const y = 1.18 + state.pointer.y * 0.2;
    camera.position.x += (x - camera.position.x) * 0.04;
    camera.position.y += (y - camera.position.y) * 0.04;
    camera.lookAt(0, 0.1, 0);
  });
  return null;
}

export default function OsScene() {
  const reduced = usePrefersReducedMotion();
  const wallpaper = useOsStore((s) => s.wallpaper);
  const theme = getSceneTheme(wallpaper);

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.4]}
        gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
        camera={{ position: [0, 1.2, 8.5], fov: 42, near: 0.1, far: 40 }}
        frameloop={reduced ? "demand" : "always"}
        onCreated={({ gl }) => {
          gl.setClearColor(theme.void, 1);
        }}
      >
        <ThemeStage theme={theme} />
        <Particles count={reduced ? 28 : 68} color={theme.particle} />
        <Drift reduced={reduced} theme={theme} />
        <CameraRig reduced={reduced} />
      </Canvas>
    </div>
  );
}
