import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import {
  resetGsapTimelines,
  setAllTimeline,
  setCharTimeline,
} from "../utils/GsapScroll";
import { useLocale } from "../../context/LocaleProvider";

const Scene = () => {
  const { locale } = useLocale();
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const characterRef = useRef<THREE.Object3D | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!canvasDiv.current) return;

    const canvasElement = canvasDiv.current;
    const rect = canvasElement.getBoundingClientRect();
    const container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasElement.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();
    cameraRef.current = camera;

    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | undefined;
    let activeCharacter: THREE.Object3D | null = null;
    let introTimeoutId: number | undefined;
    let animationFrameId = 0;
    let isDisposed = false;
    let lastFrameTime = 0;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onResize = () => {
      if (!activeCharacter) return;
      handleResize(renderer, camera, canvasDiv, activeCharacter);
    };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    const onTouchMove = (event: TouchEvent) => {
      handleTouchMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchmove", onTouchMove, { passive: true });
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    loadCharacter()
      .then((gltf) => {
        if (!gltf || isDisposed) return;

        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          animations.hover(gltf, hoverDivRef.current);
        }

        mixer = animations.mixer;
        activeCharacter = gltf.scene;
        characterRef.current = activeCharacter;
        scene.add(activeCharacter);
        headBone = activeCharacter.getObjectByName("spine006") || null;
        screenLight = activeCharacter.getObjectByName("screenlight") || null;
        setIsReady(true);
        setCharTimeline(activeCharacter, camera);
        setAllTimeline();
        requestAnimationFrame(() => ScrollTrigger.refresh());
        window.addEventListener("resize", onResize);

        introTimeoutId = window.setTimeout(() => {
          if (isDisposed) return;
          light.turnOnLights();
          animations.startIntro();
        }, 2500);
      })
      .catch((error) => {
        console.error("Character scene failed to load:", error);
      });

    const animate = () => {
      if (isDisposed) return;

      animationFrameId = window.requestAnimationFrame(animate);
      const now = performance.now();
      if (now - lastFrameTime < 1000 / 45) {
        return;
      }
      lastFrameTime = now;

      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      if (introTimeoutId) {
        window.clearTimeout(introTimeoutId);
      }
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.removeEventListener("touchmove", onTouchMove);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
      resetGsapTimelines();
      scene.clear();
      renderer.dispose();
      characterRef.current = null;
      cameraRef.current = null;
      if (canvasElement.contains(renderer.domElement)) {
        canvasElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady || !characterRef.current || !cameraRef.current) return;

    requestAnimationFrame(() => {
      const character = characterRef.current!;
      const camera = cameraRef.current!;
      const neckBone = character.getObjectByName("spine005");
      const monitor = character.getObjectByName("Plane004");
      const screenLight = character.getObjectByName("screenlight");

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      resetGsapTimelines();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      character.position.set(0, 0, 0);
      character.rotation.set(0, 0, 0);
      if (neckBone) {
        neckBone.rotation.set(0, 0, 0);
      }

      monitor?.traverse((child) => {
        const mesh = child as THREE.Mesh & {
          material?: THREE.Material | THREE.Material[];
        };
        if (!mesh.material) return;

        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        materials.forEach((material) => {
          if ("opacity" in material) {
            material.opacity = 0;
          }
        });
      });

      if (screenLight && "material" in screenLight) {
        const material = (
          screenLight as THREE.Mesh & {
            material: THREE.Material & { opacity?: number; emissiveIntensity?: number };
          }
        ).material;

        if ("opacity" in material) {
          material.opacity = 0;
        }
        if ("emissiveIntensity" in material) {
          material.emissiveIntensity = 0;
        }
      }

      gsap.set(".character-model", { clearProps: "x,y,pointerEvents" });
      gsap.set(".landing-container", { clearProps: "opacity,transform,x,y" });
      gsap.set(".about-me", { clearProps: "opacity,transform,x,y" });
      gsap.set(".about-section", { clearProps: "opacity,transform,x,y" });
      gsap.set(".whatIDO", { clearProps: "opacity,transform,x,y" });
      gsap.set(".character-rim", { clearProps: "opacity,transform,x,y,scale" });
      gsap.set(".what-box-in", { clearProps: "display" });

      setCharTimeline(characterRef.current, cameraRef.current!);
      setAllTimeline();
      ScrollTrigger.refresh();
    });
  }, [locale, isReady]);

  return (
    <>
      <div className="character-container">
        <div
          className={`character-model ${isReady ? "character-loaded" : ""}`}
          ref={canvasDiv}
        >
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
