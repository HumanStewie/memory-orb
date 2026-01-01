/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import {
  BrightnessContrast,
  ChromaticAberration,
  EffectComposer,
} from "@react-three/postprocessing";
import MainIco from "./components/MainIco";
import Login from "./components/Login";
import LoadingScreen from "./components/LoadingScreen";
import TitleCard from "./components/TitleCard";
import StarSystem from "./components/Stars";

function PostProcess() {
  
  return (
    <>
      <EffectComposer>
        <ChromaticAberration offset={[0.001, 0.0002]} />
        <BrightnessContrast
          brightness={-0.1} // brightness. min: -1, max: 1
          contrast={0.4} // contrast: min -1, max: 1
        />
      </EffectComposer>
    </>
  );
}




// Helper function to fetch every data
const fetchMemories = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://127.0.0.1:8000/get_memory`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    } else if (response.status == 403) {
      localStorage.removeItem("token");
    }
    const memoryDetails = await response.json();
    if (memoryDetails != null) {
      return memoryDetails;
    }
  } catch (error) {
    console.log(error);
  }
};

function App() {
  // All our states and references to store data
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const currentImg = useRef(0);
  const nameRef = useRef<any[]>(null);
  const infoRef = useRef<any[]>(null);
  const dateRef = useRef<any[]>(null);
  const idRef = useRef(null);
  const texRef = useRef<THREE.Texture[]>([]);
  const imgRef = useRef<any[]>(null);
  const loader = new THREE.TextureLoader();

  // We load up all our informations into our refs as a list
  useEffect(() => {
    const loadRefs = async () => {
      const memoryDetails = await fetchMemories();
      setActive(true);
      if (memoryDetails) {
        setIsLoading(false);
      }

      // Mapping all data gotten from database into a ref
      imgRef.current = memoryDetails.map((memos: any) => {
        return memos.memory_img_url;
      });
      const textures = memoryDetails.map((memos: any) => {
        const t = loader.load(memos.memory_img_url);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
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
      <Login idRef={idRef} currentImg={currentImg} />
      {isLoading ? <LoadingScreen /> : <TitleCard />}
      <div id="canvas-container">
        <Canvas
          scene={{ background: new THREE.Color("#080808") }}
          camera={{ position: [0, 0, 2.1] }}
        >
          {active && (
            <MainIco
              nameRef={nameRef}
              dateRef={dateRef}
              infoRef={infoRef}
              texRef={texRef}
              currentImg={currentImg}
              imgRef={imgRef}
            />
          )}
          <StarSystem />
          <PostProcess />
        </Canvas>
      </div>
    </>
  );
}

export default App;
