import * as THREE from "three";
import { ComponentType, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { renderToStaticMarkup } from "react-dom/server";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
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

function createIconTexture(
  Icon: ComponentType<{ size?: number; color?: string }>,
  color: string
) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const context = canvas.getContext("2d");
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    120,
    canvas.width / 2,
    canvas.height / 2,
    470
  );
  gradient.addColorStop(0, "rgba(255,255,255,0.18)");
  gradient.addColorStop(0.5, "rgba(210,185,255,0.08)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 435, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "rgba(12, 8, 18, 0.92)";
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 360, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "rgba(194, 164, 255, 0.5)";
  context.lineWidth = 16;
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 360, 0, Math.PI * 2);
  context.stroke();

  context.strokeStyle = "rgba(255, 255, 255, 0.1)";
  context.lineWidth = 6;
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, 330, 0, Math.PI * 2);
  context.stroke();

  const svgMarkup = renderToStaticMarkup(<Icon size={300} color={color} />);
  const image = new Image();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const drawIcon = (x: number) => {
    context.save();
    context.beginPath();
    context.fillStyle = "rgba(255,255,255,0.08)";
    context.arc(x, canvas.height / 2, 120, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.save();
    context.translate(x, canvas.height / 2);
    context.drawImage(image, -160, -160, 320, 320);
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

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(30)].map((_, index) => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
  materialIndex: index % stackIcons.length,
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const { locale } = useLocale();
  const copy = siteCopy[locale];
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const materials = useMemo(() => {
    const textures = stackIcons.map(({ Icon, color }) =>
      createIconTexture(Icon, color)
    );

    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          color: "#181021",
          emissive: "#8f6bff",
          emissiveMap: texture,
          emissiveIntensity: 0.4,
          metalness: 0.22,
          roughness: 0.18,
          clearcoat: 0.7,
          clearcoatRoughness: 0.12,
        })
    );
  }, []);

  return (
    <div className="techstack">
      <h2>{copy.techTitle}</h2>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[props.materialIndex]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
