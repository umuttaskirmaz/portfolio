import * as THREE from "three";
import { ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiPhp,
  SiUnity,
} from "react-icons/si";
import { FaJava } from "react-icons/fa6";
import { TbBrandCSharp } from "react-icons/tb";
import { useLocale } from "../context/LocaleProvider";
import { siteCopy } from "../data/portfolioData";

const stackIcons = [
  { Icon: SiJavascript, color: "#ffffff" },
  { Icon: SiNextdotjs, color: "#ffffff" },
  { Icon: SiUnity, color: "#ffffff" },
  { Icon: SiMysql, color: "#ffffff" },
  { Icon: FaJava, color: "#ffffff" },
  { Icon: SiPhp, color: "#ffffff" },
  { Icon: TbBrandCSharp, color: "#ffffff" },
  { Icon: SiHtml5, color: "#ffffff" },
  { Icon: SiCss3, color: "#ffffff" },
];

type TechQuality = "high" | "balanced";

type OrbConfig = {
  scale: number;
  materialIndex: number;
  basePosition: [number, number, number];
  speed: number;
  amplitude: number;
  spin: [number, number, number];
};

function resolveTechQuality(): TechQuality {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const hasLowerMemory =
    "deviceMemory" in navigator &&
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory !==
      undefined
      ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 8
      : false;
  const hasLowerCpu =
    "hardwareConcurrency" in navigator ? navigator.hardwareConcurrency <= 8 : false;

  if (prefersReducedMotion || hasLowerMemory || hasLowerCpu) {
    return "balanced";
  }

  return "high";
}

function createIconTexture(
  Icon: ComponentType<{ size?: number; color?: string }>,
  color: string,
  textureSize: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = textureSize;
  canvas.height = textureSize;

  const context = canvas.getContext("2d");
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.12,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.46
  );
  gradient.addColorStop(0, "rgba(255,255,255,0.18)");
  gradient.addColorStop(0.5, "rgba(210,185,255,0.08)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.425,
    0,
    Math.PI * 2
  );
  context.fill();

  context.fillStyle = "rgba(12, 8, 18, 0.92)";
  context.beginPath();
  context.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.352,
    0,
    Math.PI * 2
  );
  context.fill();

  context.strokeStyle = "rgba(194, 164, 255, 0.5)";
  context.lineWidth = textureSize * 0.016;
  context.beginPath();
  context.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.352,
    0,
    Math.PI * 2
  );
  context.stroke();

  context.strokeStyle = "rgba(255, 255, 255, 0.1)";
  context.lineWidth = textureSize * 0.006;
  context.beginPath();
  context.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.322,
    0,
    Math.PI * 2
  );
  context.stroke();

  const svgMarkup = renderToStaticMarkup(
    <Icon size={Math.round(textureSize * 0.29)} color={color} />
  );
  const image = new Image();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const drawIcon = (x: number) => {
    context.save();
    context.beginPath();
    context.fillStyle = "rgba(255,255,255,0.08)";
    context.arc(x, canvas.height / 2, textureSize * 0.117, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.save();
    context.translate(x, canvas.height / 2);
    const drawSize = textureSize * 0.313;
    context.drawImage(image, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
    context.restore();
  };

  image.onload = () => {
    drawIcon(canvas.width * 0.25);
    drawIcon(canvas.width * 0.75);
    texture.needsUpdate = true;
  };

  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;

  return texture;
}

function buildOrbConfigs(quality: TechQuality): OrbConfig[] {
  const count = quality === "high" ? 18 : 12;

  return Array.from({ length: count }, (_, index) => {
    const ring = 5.5 + (index % 3) * 1.6;
    const angle = (index / count) * Math.PI * 2;

    return {
      scale: [0.78, 0.95, 0.84, 1, 0.88][index % 5],
      materialIndex: index % stackIcons.length,
      basePosition: [
        Math.cos(angle) * ring,
        (index % 5) - 2.4,
        Math.sin(angle) * (ring * 0.48) - 1.5,
      ],
      speed: 0.45 + (index % 4) * 0.08,
      amplitude: 0.22 + (index % 3) * 0.08,
      spin: [0.2 + index * 0.01, 0.35 + index * 0.012, 0.12],
    };
  });
}

function FloatingOrb({
  config,
  material,
  geometry,
  pointerTarget,
  isActive,
}: {
  config: OrbConfig;
  material: THREE.MeshPhysicalMaterial;
  geometry: THREE.SphereGeometry;
  pointerTarget: THREE.Vector3;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const elapsed = clock.getElapsedTime() * config.speed + phase;
    const sway = Math.sin(elapsed) * config.amplitude;
    const drift = Math.cos(elapsed * 1.2) * config.amplitude * 0.55;

    tempVec.set(
      config.basePosition[0] + sway + pointerTarget.x * config.scale * 0.18,
      config.basePosition[1] + drift + pointerTarget.y * config.scale * 0.18,
      config.basePosition[2] + Math.sin(elapsed * 0.7) * 0.18
    );

    mesh.position.lerp(tempVec, Math.min(1, delta * (isActive ? 2.6 : 1.4)));
    mesh.rotation.x += delta * config.spin[0];
    mesh.rotation.y += delta * config.spin[1];
    mesh.rotation.z += delta * config.spin[2];
  });

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      scale={config.scale}
      geometry={geometry}
      material={material}
      position={config.basePosition}
    />
  );
}

function FloatingOrbs({
  configs,
  materials,
  geometry,
  isActive,
}: {
  configs: OrbConfig[];
  materials: THREE.MeshPhysicalMaterial[];
  geometry: THREE.SphereGeometry;
  isActive: boolean;
}) {
  const pointerTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ pointer }, delta) => {
    const targetX = pointer.x * 2.1;
    const targetY = pointer.y * 1.1;
    pointerTarget.x = THREE.MathUtils.lerp(
      pointerTarget.x,
      isActive ? targetX : 0,
      Math.min(1, delta * 2.4)
    );
    pointerTarget.y = THREE.MathUtils.lerp(
      pointerTarget.y,
      isActive ? targetY : 0,
      Math.min(1, delta * 2.4)
    );
  });

  return (
    <>
      {configs.map((config, index) => (
        <FloatingOrb
          key={index}
          config={config}
          material={materials[config.materialIndex]}
          geometry={geometry}
          pointerTarget={pointerTarget}
          isActive={isActive}
        />
      ))}
    </>
  );
}

const TechStack = () => {
  const { locale } = useLocale();
  const copy = siteCopy[locale];
  const [isActive, setIsActive] = useState(false);
  const quality = useMemo(resolveTechQuality, []);
  const textureSize = quality === "high" ? 768 : 512;
  const geometry = useMemo(
    () =>
      new THREE.SphereGeometry(
        1,
        quality === "high" ? 20 : 14,
        quality === "high" ? 20 : 14
      ),
    [quality]
  );
  const orbConfigs = useMemo(() => buildOrbConfigs(quality), [quality]);

  useEffect(() => {
    const handleScroll = () => {
      const workSection = document.getElementById("work");
      if (!workSection) return;

      const rect = workSection.getBoundingClientRect();
      setIsActive(rect.top < window.innerHeight && rect.bottom > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const materials = useMemo(() => {
    const textures = stackIcons.map(({ Icon, color }) =>
      createIconTexture(Icon, color, textureSize)
    );

    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          color: "#181021",
          emissive: "#8f6bff",
          emissiveMap: texture,
          emissiveIntensity: quality === "high" ? 0.34 : 0.24,
          metalness: quality === "high" ? 0.2 : 0.16,
          roughness: quality === "high" ? 0.2 : 0.28,
          clearcoat: quality === "high" ? 0.55 : 0.35,
          clearcoatRoughness: quality === "high" ? 0.14 : 0.22,
        })
    );
  }, [quality, textureSize]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      materials.forEach((material) => {
        material.map?.dispose();
        material.emissiveMap?.dispose();
        material.dispose();
      });
    };
  }, [geometry, materials]);

  return (
    <div className="techstack">
      <h2>{copy.techTitle}</h2>

      <Canvas
        dpr={quality === "high" ? [1, 1.25] : [1, 1]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 18], fov: 34, near: 1, far: 100 }}
        onCreated={(state) => {
          state.gl.toneMappingExposure = quality === "high" ? 1.45 : 1.25;
        }}
        className="tech-canvas"
      >
        <ambientLight intensity={quality === "high" ? 1.05 : 0.9} />
        <directionalLight
          position={[12, 10, 16]}
          intensity={quality === "high" ? 1.8 : 1.25}
        />
        <pointLight position={[-8, 4, 8]} intensity={quality === "high" ? 22 : 15} color="#6d3dff" />
        <FloatingOrbs
          configs={orbConfigs}
          materials={materials}
          geometry={geometry}
          isActive={isActive}
        />
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={quality === "high" ? 0.42 : 0.24}
          environmentRotation={[0, 4, 2]}
        />
      </Canvas>
    </div>
  );
};

export default TechStack;
