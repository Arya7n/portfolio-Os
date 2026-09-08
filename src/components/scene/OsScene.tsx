import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CanvasTexture,
  InstancedMesh,
  Object3D,
  SRGBColorSpace,
  type Group,
  type Mesh,
  type Points,
} from "three";
import type { AppId } from "@/data/apps";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOsStore } from "@/store/osStore";

type SceneMode = "idle" | "terminal" | "network" | "graph";

function activeMode(): SceneMode {
  const state = useOsStore.getState();
  if (state.focusedProjectId === "devtunnel") return "network";
  const app = state.windows.find((win) => win.id === state.activeId && !win.minimized)?.appId ?? null;
  if (app === "terminal") return "terminal";
  if (app === "projects" || app === "github" || app === "experience") return "network";
  if (app === "skills") return "graph";
  return "idle";
}

function Particles({ count }: { count: number }) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 10;
      data[i * 3 + 1] = Math.random() * 3.4;
      data[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return data;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#7eb6ff"
        transparent
        opacity={0.28}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Desk() {
  return (
    <group position={[0, -0.02, 0.15]}>
      <mesh position={[0, 0, 0]} castShadow={false}>
        <boxGeometry args={[3.4, 0.08, 1.7]} />
        <meshStandardMaterial color="#161b22" roughness={0.72} metalness={0.18} />
      </mesh>
      <mesh position={[0, -0.42, 0.62]}>
        <boxGeometry args={[3.2, 0.72, 0.08]} />
        <meshStandardMaterial color="#12161c" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Keyboard() {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    let index = 0;
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 11; col += 1) {
        dummy.position.set(-0.6 + col * 0.12, 0.07, 0.42 + row * 0.09);
        dummy.scale.set(0.1, 0.028, 0.07);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(index, dummy.matrix);
        index += 1;
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <group>
      <mesh position={[0, 0.04, 0.5]}>
        <boxGeometry args={[1.5, 0.04, 0.48]} />
        <meshStandardMaterial color="#1c222b" roughness={0.55} />
      </mesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, 33]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2a313c" roughness={0.45} />
      </instancedMesh>
    </group>
  );
}

function Monitor({ mode }: { mode: SceneMode }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 160;
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    return map;
  }, []);
  const frame = useRef(0);

  useFrame(({ clock }) => {
    frame.current += 1;
    if (frame.current % 5 !== 0) return;
    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#071018";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = mode === "terminal" ? "#7CFFB2" : mode === "network" ? "#7eb6ff" : "#9aa7b5";
    ctx.font = "12px monospace";
    const t = clock.elapsedTime;
    const lines =
      mode === "terminal"
        ? ["> whoami", "ARYAN", "backend-focused", `uptime ${t.toFixed(1)}s`]
        : mode === "network"
          ? ["tunnel session", "ws  connected", "redis  hot", "postgres  ok"]
          : mode === "graph"
            ? ["node  nest", "node  redis", "node  pg", "edge  live"]
            : ["ARYAN OS v2.0", "workstation idle", "awaiting input"];
    lines.forEach((line, index) => {
      ctx.fillText(line, 16, 32 + index * 22);
    });
    ctx.fillRect(16, 148, 40 + ((t * 18) % 120), 3);
    texture.needsUpdate = true;
  });

  return (
    <group position={[0, 0.92, -0.42]}>
      <mesh>
        <boxGeometry args={[1.72, 1.08, 0.08]} />
        <meshStandardMaterial color="#0f1318" roughness={0.4} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.046]}>
        <planeGeometry args={[1.52, 0.9]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.66, 0.08]}>
        <boxGeometry args={[0.22, 0.28, 0.12]} />
        <meshStandardMaterial color="#171c23" />
      </mesh>
      <pointLight
        position={[0, 0, 0.35]}
        intensity={mode === "idle" ? 0.28 : 0.55}
        distance={3.4}
        color={mode === "terminal" ? "#7CFFB2" : "#6ea8ff"}
      />
    </group>
  );
}

function ServerRack({ active }: { active: boolean }) {
  const leds = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!leds.current) return;
    leds.current.children.forEach((child, index) => {
      const mesh = child as Mesh;
      const material = mesh.material as { emissiveIntensity?: number };
      if (material.emissiveIntensity != null) {
        material.emissiveIntensity = active
          ? 0.7 + Math.sin(clock.elapsedTime * 6 + index) * 0.5
          : 0.18 + Math.sin(clock.elapsedTime * 1.4 + index) * 0.08;
      }
    });
  });

  return (
    <group position={[1.55, 0.42, -0.15]}>
      <mesh>
        <boxGeometry args={[0.55, 1.15, 0.62]} />
        <meshStandardMaterial color="#141920" roughness={0.62} metalness={0.28} />
      </mesh>
      {[0, 1, 2, 3].map((slot) => (
        <mesh key={slot} position={[0, 0.38 - slot * 0.22, 0.32]}>
          <boxGeometry args={[0.46, 0.16, 0.04]} />
          <meshStandardMaterial color="#1c2430" />
        </mesh>
      ))}
      <group ref={leds}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <mesh key={index} position={[0.16 - (index % 2) * 0.32, 0.4 - Math.floor(index / 2) * 0.22, 0.35]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial
              color={index % 2 ? "#30d158" : "#0a84ff"}
              emissive={index % 2 ? "#30d158" : "#0a84ff"}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const NODE_PATH = [
  [-1.35, 0.55, 0.2],
  [-0.7, 0.95, -0.35],
  [0.7, 1.05, -0.55],
  [1.35, 0.72, 0.05],
] as const;

function Network({ active }: { active: boolean }) {
  const packets = useRef<Group>(null);
  const nodes = useRef<Group>(null);
  const linePositions = useMemo(() => {
    const data = new Float32Array(NODE_PATH.length * 3);
    NODE_PATH.forEach((point, index) => {
      data[index * 3] = point[0];
      data[index * 3 + 1] = point[1];
      data[index * 3 + 2] = point[2];
    });
    return data;
  }, []);

  useFrame(({ clock }) => {
    const speed = active ? 0.55 : 0.16;
    if (packets.current) {
      packets.current.children.forEach((child, index) => {
        const t = (clock.elapsedTime * speed + index * 0.22) % 1;
        const from = NODE_PATH[Math.floor(t * (NODE_PATH.length - 1))];
        const to = NODE_PATH[Math.min(NODE_PATH.length - 1, Math.floor(t * (NODE_PATH.length - 1)) + 1)];
        const local = (t * (NODE_PATH.length - 1)) % 1;
        child.position.set(
          from[0] + (to[0] - from[0]) * local,
          from[1] + (to[1] - from[1]) * local,
          from[2] + (to[2] - from[2]) * local,
        );
      });
    }
    if (nodes.current) {
      const pulse = active ? 0.8 : 0.25;
      nodes.current.children.forEach((child, index) => {
        const mesh = child as Mesh;
        const material = mesh.material as { emissiveIntensity?: number };
        if (material.emissiveIntensity != null) {
          material.emissiveIntensity = pulse + Math.sin(clock.elapsedTime * 2 + index) * 0.12;
        }
      });
    }
  });

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#3d6ea8" transparent opacity={0.55} />
      </line>
      <group ref={nodes}>
        {NODE_PATH.map((point, index) => (
          <mesh key={index} position={[point[0], point[1], point[2]]}>
            <octahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial
              color="#8ec8ff"
              emissive="#0a84ff"
              emissiveIntensity={0.3}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>
      <group ref={packets}>
        {[0, 1, 2, 3, 4].map((index) => (
          <mesh key={index}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshBasicMaterial color="#d7ecff" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    const mode = activeMode();
    const goal =
      mode === "terminal"
        ? { x: 0.05, y: 1.28, z: 3.15 }
        : mode === "network"
          ? { x: 0.55, y: 1.45, z: 3.35 }
          : mode === "graph"
            ? { x: -0.45, y: 1.5, z: 3.4 }
            : { x: 0, y: 1.62, z: 4.15 };
    const camera = state.camera;
    camera.position.x += (goal.x - camera.position.x) * 0.035;
    camera.position.y += (goal.y - camera.position.y) * 0.035;
    camera.position.z += (goal.z - camera.position.z) * 0.035;
    if (!reduced) {
      camera.position.x += state.pointer.x * 0.012;
      camera.position.y += state.pointer.y * 0.008;
    }
    camera.lookAt(0, 0.55, 0);
  });
  return null;
}

function Workstation({ reduced }: { reduced: boolean }) {
  const mode = useOsStore((state) => {
    if (state.focusedProjectId === "devtunnel") return "network" as const;
    const app = state.windows.find((win) => win.id === state.activeId && !win.minimized)?.appId as AppId | undefined;
    if (app === "terminal") return "terminal";
    if (app === "projects" || app === "github" || app === "experience") return "network";
    if (app === "skills") return "graph";
    return "idle";
  });
  const tunnel = useOsStore((state) => state.focusedProjectId === "devtunnel");

  return (
    <group>
      <Desk />
      <Keyboard />
      <Monitor mode={mode} />
      <ServerRack active={mode === "network" || mode === "terminal"} />
      <Network active={mode === "network" || mode === "graph" || tunnel} />
      <Particles count={reduced ? 18 : 42} />
    </group>
  );
}

export default function OsScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 1.7, 4.4], fov: 38, near: 0.1, far: 40 }}
        frameloop={reduced ? "demand" : "always"}
        onCreated={({ gl }) => {
          gl.setClearColor("#0b1016", 0);
        }}
      >
        <fog attach="fog" args={["#0b1016", 7, 16]} />
        <ambientLight intensity={0.28} />
        <directionalLight position={[2.4, 4.2, 2.2]} intensity={0.55} color="#e8eef6" />
        <directionalLight position={[-3, 2, -1]} intensity={0.12} color="#4d6d9a" />
        <gridHelper args={[18, 22, "#1e2733", "#141a22"]} position={[0, -0.06, 0]} />
        <Workstation reduced={reduced} />
        <CameraRig reduced={reduced} />
      </Canvas>
    </div>
  );
}
