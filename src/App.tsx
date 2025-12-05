import "./App.css";
import vShader from "./shaders/vertex";
import fShader from "./shaders/fragment";
import lfShader from "./shaders/vertexLine";
import lvShader from "./shaders/fragmentLine";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useFBO,
  Wireframe,
} from "@react-three/drei";
import * as THREE from "three";
import { float, vec2 } from "three/tsl";
import { useRef } from "react";
import { plane } from "three/examples/jsm/Addons.js";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";

function PlaneShader() {
  let t = new THREE.TextureLoader().load("/w.jpg");
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
  const uniform2 = {
    thickness: { value: 0.0 },
  };
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  // Test comment

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
      <mesh rotation={[0, 0, 0]} ref={mesh1}>
        <icosahedronGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={vShader}
          fragmentShader={fShader}
          uniforms={uniform}
        />
      </mesh>
      <mesh rotation={[0, 0, 0]} ref={mesh2}>
        <icosahedronGeometry isBufferGeometry={true} args={[1, 1]} />
        <shaderMaterial
          vertexShader={lvShader}
          fragmentShader={lfShader}
        />
      </mesh>
    </>
  );
}

// Barycentric coordinates
function setupAttributes( geometry : any) {

				const vectors = [
					new THREE.Vector3( 1, 0, 0 ),
					new THREE.Vector3( 0, 1, 0 ),
					new THREE.Vector3( 0, 0, 1 )
				];

				const position = geometry.attributes.position;
				const centers = new Float32Array( position.count * 3 );

				for ( let i = 0, l = position.count; i < l; i ++ ) {

					vectors[ i % 3 ].toArray( centers, i * 3 );

				}

				geometry.setAttribute( 'center', new THREE.BufferAttribute( centers, 3 ) );
}
function App() {
  return (
    <div id="canvas-container">
      <Canvas
        scene={{ background: new THREE.Color("black") }}
        camera={{ position: [1.5, 0, 1.5] }}
      >
        <OrbitControls />
        <PlaneShader />
      </Canvas>
    </div>
  );
}

export default App;
