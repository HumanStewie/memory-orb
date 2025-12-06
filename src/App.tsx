/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/immutability */
import "./App.css";
import vShader from "./shaders/vertex";
import fShader from "./shaders/fragment";
import lfShader from "./shaders/fragmentLine";
import lvShader from "./shaders/vertexLine";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useFBO,
  Wireframe,
} from "@react-three/drei";
import * as THREE from "three";
import { float, vec2 } from "three/tsl";
import { useEffect, useRef } from "react";
import { plane } from "three/examples/jsm/Addons.js";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";

function Post(){
  return 
}

function IcoLines(){
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta / 10;
      mesh.current.rotation.y += delta / 10;
    }
  });
  useEffect(() => {
    setupAttributes(mesh.current?.geometry)
  })
  return <mesh rotation={[0, 0, 0]} ref={mesh}>
        <icosahedronGeometry isBufferGeometry={true} args={[1.001, 1]} />
        <shaderMaterial
          vertexShader={lvShader}
          fragmentShader={lfShader}
        />
      </mesh>
}

function PlaneShader() {
  const mesh1 = useRef<THREE.Mesh>(null);
  let t = new THREE.TextureLoader().load("/hypothetically-couldnt-rae-shrink-down-and-get-inside-my-v0-zqnsul89e9vf1.webp");
  t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;

  const uniform = {
    uTime: { type: "f", value: 0.0 },
    uMouse: { value: new THREE.Vector2() },
    uResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    uTexture: {
      value: t,
    },
  };
  
  useFrame((state, delta) => {
    uniform.uTime.value += delta;
    if (mesh1.current) {
      mesh1.current.rotation.x += delta / 10;
      mesh1.current.rotation.y += delta / 10;
    }
  });
  window.addEventListener("mousemove", (e) => {
    uniform.uMouse.value.x = (e.pageX / window.innerWidth - 0.5) * 2.0;
    uniform.uMouse.value.y = (e.pageY / window.innerHeight - 0.5) * 2.0;
  });


  return (
    <>
      <mesh rotation={[0, 0, 0]} ref={mesh1} visible={true}>
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
function setupAttributes( geometry ) {
  let length = geometry.attributes.position.array.length;
  let bary = []
  for (let i = 0; i < length/3; i++ ){
    bary.push(0,0,1, 0,1,0, 1,0,0)
  }
  let aBary = new Float32Array(bary);
  geometry.setAttribute('aBary', new THREE.BufferAttribute(aBary, 3))
}
function App() {
  return (
    <div id="canvas-container">
      <Canvas
        scene={{ background: new THREE.Color("black") }}
        camera={{ position: [1.5, 0, 1.5] }}
      >
        
        <OrbitControls />
        <IcoLines />
        <PlaneShader />
      </Canvas>
    </div>
  );
}

export default App;
