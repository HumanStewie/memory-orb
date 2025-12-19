/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/immutability */
import "./App.css";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useState } from "react";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";
import MemoryInfo from "./components/MemoryInfo";
import {
  BlendFunction,
} from "postprocessing";
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
          {<PostProcess />}
        </Canvas>
      </div>
      <Login />
      <MemoryInfo state={active} />
    </>
  );
}

export default App;
