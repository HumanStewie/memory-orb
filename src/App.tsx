/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/immutability */
import "./App.css";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";
import MemoryInfo from "./components/MemoryInfo";
import { BlendFunction } from "postprocessing";
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

const fetchMemories = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://127.0.0.1:8000/get_memory`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const memoryDetails = await response.json();
    if (memoryDetails != null) {
      return memoryDetails;
    }
  } catch (error) {
    console.log(error);
  }
};

async function CreateRefs() {
  const currentImg = useRef(0);
  const nameRef = useRef(null);
  const infoRef = useRef(null);
  const dateRef = useRef(null);
  const idRef = useRef(null);
  const texRef = useRef<THREE.Texture[]>([]);
  const loader = new THREE.TextureLoader();
  const memoryDetails = await fetchMemories();

  const textures = memoryDetails.map((memos: any) => {
    const t = loader.load(memos.memory_img_url);
    t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
    return t;
  });
  texRef.current = textures;

  nameRef.current = memoryDetails.map((memos: any) => {
    return memos.memory_name;
  });
  dateRef.current = memoryDetails.map((memos: any) => {
    return memos.memory_date;
  });
  infoRef.current = memoryDetails.map((memos: any) => {
    return memos.memory_info;
  });
  idRef.current = memoryDetails.map((memos: any) => {
    return memos.id;
  });
  // Get our textures

  return (
    currentImg.current,
    nameRef.current,
    infoRef.current,
    dateRef.current,
    idRef.current,
    texRef.current
  );
}

function App() {
  const [active, setActive] = useState("inactive");
  const currentImg = useRef(0);
  const nameRef = useRef(null);
  const infoRef = useRef(null);
  const dateRef = useRef(null);
  const idRef = useRef(null);
  const texRef = useRef<THREE.Texture[]>([]);
  const loader = new THREE.TextureLoader();
  useEffect(() => {
    const loadRefs = async () => {
      const memoryDetails = await fetchMemories();

      const textures = memoryDetails.map((memos: any) => {
        const t = loader.load(memos.memory_img_url);
        t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
        return t;
      });
      texRef.current = textures;

      nameRef.current = memoryDetails.map((memos: any) => {
        return memos.memory_name;
      });
      dateRef.current = memoryDetails.map((memos: any) => {
        return memos.memory_date;
      });
      infoRef.current = memoryDetails.map((memos: any) => {
        return memos.memory_info;
      });
      idRef.current = memoryDetails.map((memos: any) => {
        return memos.id;
      });
    };
    loadRefs();
  }, []);
  return (
    <>
      <div id="canvas-container">
        <Canvas
          scene={{ background: new THREE.Color("#101010") }}
          camera={{ position: [0, 0, 2] }}
        >
          <MainIco
            onClick={() => {
              setActive("active");
            }}
            nameRef={nameRef}
            dateRef={dateRef}
            infoRef={infoRef}
            idRef={idRef}
            texRef={texRef}
            currentImg={currentImg}
          />
          {/*<PostProcess />*/}
        </Canvas>
      </div>
      <Login />
    </>
  );
}

export default App;
