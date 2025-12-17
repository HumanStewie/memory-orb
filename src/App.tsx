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
import { float, mat2, vec2 } from "three/tsl";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import MemoryName from "./components/MemoryName";
import MainIco from "./components/MainIco";
import Login from "./components/Login";

function PostProcess() {
  return (
    <>
      <EffectComposer enableNormalPass={false}>
        <ChromaticAberration offset={[0.001, 0.0002]} />
        <Noise opacity={0.1} />
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.2}
          blendFunction={BlendFunction.SCREEN}
        />
      </EffectComposer>
    </>
  );
}

function App() {
  const [active, setActive] = useState("inactive");
  return (
    <>
      <div id="canvas-container">
        <Canvas
          scene={{ background: new THREE.Color("#1c1c1c") }}
          camera={{ position: [0, 0, 2] }}
        >
          <MainIco
            onClick={() => {
              setActive("active");
            }}
          />
          {/*<PostProcess />*/}
        </Canvas>
      </div>
      <Login />
      <MemoryInfo state={active} />
    </>
  );
}

export default App;
