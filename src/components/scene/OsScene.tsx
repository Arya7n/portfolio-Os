import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Points } from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function Particles({ count }: { count: number }) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 14;
      data[i * 3 + 1] = (Math.random() - 0.2) * 7;
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
        size={0.028}
        color="#8ec8ff"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Drift({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.08;
    group.current.position.y = Math.sin(t * 0.4) * 0.12;
  });

  return (
    <group ref={reduced ? undefined : group}>
      <mesh position={[2.2, 0.8, -1.6]}>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color="#0a84ff" wireframe transparent opacity={0.32} />
      </mesh>
      <mesh position={[-2.4, 0.3, -2.2]}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color="#30d158" wireframe transparent opacity={0.22} />
      </mesh>
      <mesh position={[0.4, -0.2, -3]}>
        <tetrahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#98989d" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    const camera = state.camera;
    const targetZ = 5.6;
    camera.position.z += (targetZ - camera.position.z) * 0.035;
    if (reduced) {
      camera.lookAt(0, 0, 0);
      return;
    }
    const x = state.pointer.x * 0.45;
    const y = 1.15 + state.pointer.y * 0.18;
    camera.position.x += (x - camera.position.x) * 0.04;
    camera.position.y += (y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function OsScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.4]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 1.2, 8.5], fov: 42, near: 0.1, far: 40 }}
        frameloop={reduced ? "demand" : "always"}
        onCreated={({ gl }) => {
          gl.setClearColor("#1c1c1e", 0);
        }}
      >
        <fog attach="fog" args={["#1c1c1e", 8, 18]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 2]} intensity={0.55} color="#f5f5f7" />
        <gridHelper args={[22, 28, "#3a3a3c", "#2c2c2e"]} position={[0, -1.55, 0]} />
        <Particles count={reduced ? 24 : 70} />
        <Drift reduced={reduced} />
        <CameraRig reduced={reduced} />
      </Canvas>
    </div>
  );
}
