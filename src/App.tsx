/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/immutability */
import "./App.css";
import vShader from "./shaders/vertex";
import fShader from "./shaders/fragment";
import lfShader from "./shaders/fragmentLine";
import lvShader from "./shaders/vertexLine";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import type { BlurPass, Resizer, KernelSize, Resolution } from "postprocessing";
import {
  Html,
  MeshReflectorMaterial,
  MeshRefractionMaterial,
  OrbitControls,
  PerspectiveCamera,
  useFBO,
  Wireframe,
} from "@react-three/drei";
import * as THREE from "three";
import { float, vec2 } from "three/tsl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { plane } from "three/examples/jsm/Addons.js";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  HueSaturation,
  Noise,
  Scanline,
} from "@react-three/postprocessing";
import gsap from "gsap";
import MemoryInfo from "./components/MemoryInfo";
import Arrows from "./components/Arrows";
import {
  BlendFunction,
  BoxBlurPass,
  Effect,
  GaussianBlurPass,
  KawaseBlurPass,
  RenderPass,
} from "postprocessing";


function PostProcess() {
  const {scene, camera} = useThree();
  const composer = new EffectComposer(new   THREE.WebGLRenderer())
  const renderPass = new RenderPass(scene, camera)
   
}

function IcoLines() {
  const mesh = useRef<THREE.Mesh>(null);
  
  const uniform = {
    uTime: { type: "f", value: 0.0 },
    uSpeed: { value: 0.0 },
    uColor: {value: 1.3}
  };
  useFrame((state, delta) => {
    uniform.uTime.value += delta;
    if (mesh.current) {
      mesh.current.rotation.x += delta / 10;
      mesh.current.rotation.y += delta / 10;
    }
  });
  useEffect(() => {
    setupAttributes(mesh.current?.geometry);
  });
  return (
    <mesh
      rotation={[0, 0, 0]}
      ref={mesh}
      onPointerOver={() => {
        gsap.to(uniform.uSpeed, {value: 1.0, duration: 0.5});
        gsap.to(uniform.uColor, {value: 1.0, duration: 0.5})
      }}
      onPointerLeave={() => {
        gsap.to(uniform.uSpeed, {value: 0.0, duration: 0.5});
        gsap.to(uniform.uColor, {value: 1.3, duration: 0.5})

      }}
    >
      <icosahedronGeometry isBufferGeometry={true} args={[1.001, 1]} />
      <shaderMaterial
        vertexShader={lvShader}
        fragmentShader={lfShader}
        uniforms={uniform}
      />
    </mesh>
  );
}

function PlaneShader() {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const tl = gsap.timeline();
  const rightButton = document.body.getElementsByClassName("arrow-right");
  const leftButton = document.body.getElementsByClassName("arrow-left");
  let t = new THREE.TextureLoader().load(
    "/hypothetically-couldnt-rae-shrink-down-and-get-inside-my-v0-zqnsul89e9vf1.webp"
  );
  t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
  let t2 = new THREE.TextureLoader().load("/w.jpg");
  t2.wrapS = t2.wrapT = THREE.MirroredRepeatWrapping;

  let colorG = 1.0;
  let speedM = 0.0;
  const uniform = {
    uTime: { type: "f", value: 0.0 },
    uMouse: { value: new THREE.Vector2() },
    uResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    uTexture: {
      value: t,
    },
    uColor: { value: colorG },
    uSpeed: { value: speedM },
  };
  useFrame((state, delta) => {
    uniform.uTime.value += delta;
    if (mesh.current) {
      mesh.current.rotation.x += delta / 10;
      mesh.current.rotation.y += delta / 10;
    }
  });
  window.addEventListener("mousemove", (e) => {
    uniform.uMouse.value.x = (e.pageX / window.innerWidth - 0.5) * 2.0;
    uniform.uMouse.value.y = (e.pageY / window.innerHeight - 0.5) * 2.0;
  });

  rightButton[0].addEventListener("click", () => {
    if (!tl.isActive()) {
      tl.to(camera.rotation, {
        x: 0,
        y: camera.rotation.y - Math.PI * 2,
        z: 0,
        duration: 2,
        ease: "power4.out",
      });
      setTimeout(() => {
        uniform.uTexture.value = t2;
      }, 100);
    }
  });
  leftButton[0].addEventListener("click", () => {
    if (!tl.isActive()) {
      tl.to(camera.rotation, {
        x: 0,
        y: camera.rotation.y + Math.PI * 2,
        z: 0,
        duration: 2,
        ease: "power4.out",
      });
      setTimeout(() => {
        uniform.uTexture.value = t;
      }, 100);
    }
  });

  return (
    <>
      <mesh
        rotation={[0, 0, 0]}
        ref={mesh}
        visible={true}
        onPointerOver={() => {
          gsap.to(uniform.uColor, {value: 0.0, duration: 0.5});
          gsap.to(uniform.uSpeed, {value: 1.0, duration: 0.5});
        }}
        onPointerLeave={() => {
          gsap.to(uniform.uColor, {value: 1.0, duration: 0.5});
          gsap.to(uniform.uSpeed, {value: 0.0, duration: 0.5});

        }}
      >
        <icosahedronGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={vShader}
          fragmentShader={fShader}
          uniforms={uniform}
        />
      </mesh>
    </>
  );
}

// Barycentric coordinates
function setupAttributes(geometry) {
  let length = geometry.attributes.position.array.length;
  let bary = [];
  for (let i = 0; i < length / 3; i++) {
    bary.push(0, 0, 1, 0, 1, 0, 1, 0, 0);
  }
  let aBary = new Float32Array(bary);
  geometry.setAttribute("aBary", new THREE.BufferAttribute(aBary, 3));
}

function App() {
  return (
    <>
      <div id="canvas-container">
        <Canvas
          scene={{ background: new THREE.Color("black") }}
          camera={{ position: [0, 0, 2] }}
        >
          <PlaneShader />
          <IcoLines />
          <EffectComposer></EffectComposer>
        </Canvas>
      </div>
    </>
  );
}

export default App;
