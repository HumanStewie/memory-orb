import vShader from "../shaders/vertex";
import fShader from "../shaders/fragment";
import lfShader from "../shaders/fragmentLine";
import lvShader from "../shaders/vertexLine";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import MemoryName from "./MemoryName";
import MemoryInfo from "./MemoryInfo";
import { GoogleGenAI } from "@google/genai";



interface IcoProps {
  currentImg: React.RefObject<number>;
  nameRef: React.RefObject<any[]>;
  dateRef: React.RefObject<any[]>;
  infoRef: React.RefObject<any[]>;
  imgRef: React.RefObject<any[]>;
  texRef: React.RefObject<THREE.Texture[]>;
}

export default function MainIco({ currentImg, nameRef, dateRef, infoRef, imgRef, texRef }: IcoProps) {
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  const mat1Ref = useRef<THREE.ShaderMaterial>(null);
  const mat2Ref = useRef<THREE.ShaderMaterial>(null);
  const [name, setName] = useState(null!);
  const [date, setDate] = useState(null!);
  const [genInfo, setGenInfo] = useState<string>(null!);
  const { camera } = useThree();
  const tl = gsap.timeline();
  const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY});
  const GenAI = async (index : number) => {
    setGenInfo("Thinking")
    try{
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents:
        `
        Memory Name: "${nameRef.current[index]}",
        Memory Description: "${infoRef.current[index]}",
        Date: "${dateRef.current[index]}",
        This is for my "Memory Cube" webapp, where user can upload a memory with name, description and a date. From these information, please generate a 10 to 30 words motivational sentence relating to that memory, similar to the small yellow text on Minecraft splash texts on the title screen, also take inspiration from ending quotes of Cowboy bebop, stuff like: "See you space cowboy..." or "Youre gonna carry that weight", be a bit realistic but also a bit romantic in the language. Furthermore, you could take inspirations from other popular media like Death stranding with its message of "keep on keeping on" and Cyberpunk 2077 "Never stop fighting". Additionally, no quotation marks!.
        `,
      });
      setGenInfo(response.text)
    } catch(error) {
      console.error(error)
      setGenInfo("Such heavy thoughts... You're gonna carry that weight. Live on my friend!")
    }
  };
  useEffect(() => {
    if (nameRef.current && nameRef.current.length > 0) setName(nameRef.current[0]);
    if (dateRef.current && dateRef.current.length > 0) {
      dateRef.current[0] = dateRef.current[0].split("T")[0].split("-").reverse().join("/")
      setDate(dateRef.current[0]);
    }
    if (texRef.current.length > 0) {
      uniform1.uTexture.value = texRef.current[0];
    }
    
  }, [nameRef, dateRef, infoRef, texRef]);
  useEffect(() => {
    GenAI(currentImg.current)
  }, [])
  const setDetails = () => {
    GenAI(currentImg.current)
    if (nameRef.current) setName(nameRef.current[currentImg.current]);
    if (dateRef.current) {
      dateRef.current[currentImg.current] = dateRef.current[currentImg.current].split("T")[0].split("-").reverse().join("/");
      setDate(dateRef.current[currentImg.current]);
    }
  
  };
  const getTexture = (direction: "next" | "last") => {
    const listT = texRef.current;
    if (listT.length === 0) return null;
    if (direction === "next") {
      currentImg.current = (currentImg.current + 1) % listT.length;
    } else {
      currentImg.current =
        (currentImg.current - 1 + listT.length) % listT.length;
    }
    return listT[currentImg.current];
  };

  const uniform1 = useMemo(
    () => ({
      uTime: { type: "f", value: 0.0 },
      uMouse: { value: new THREE.Vector2() },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uTexture: {
        value: new THREE.Texture(),
      },
      uColor: { value: 1.0 },
      uSpeed: { value: 0.0 },
    }),
    []
  );
  const uniform2 = useMemo(
    () => ({
      uTime: { type: "f", value: 0.0 },
      uSpeed: { value: 0.0 },
      uColor: { value: 1.3 },
    }),
    []
  );
  useFrame((_state, delta) => {
    if (mat1Ref.current) {
      mat1Ref.current.uniforms.uTime.value += delta;
    }
    if (mat2Ref.current) {
      mat2Ref.current.uniforms.uTime.value += delta;
    }
    if (mesh1.current) {
      mesh1.current.rotation.x += delta / 10;
      mesh1.current.rotation.y += delta / 10;
    }
    if (mesh2.current) {
      mesh2.current.rotation.x += delta / 10;
      mesh2.current.rotation.y += delta / 10;
    }
  });

  useEffect(() => {
    setupAttributes(mesh2.current?.geometry);
    // Get input
    window.addEventListener("keydown", (e) => {
      if (!tl.isActive()) {
        if (e.key == "ArrowRight") {
          tl.to(camera.rotation, {
            x: 0,
            y: camera.rotation.y - Math.PI * 2,
            z: 0,
            duration: 2,
            ease: "power4.out",
          });
          setTimeout(() => {
            uniform1.uTexture.value = getTexture("next")!;
            setDetails()
            console.log(date)
          }, 100);
        }
        else if (e.key == "ArrowLeft") {
          tl.to(camera.rotation, {
            x: 0,
            y: camera.rotation.y + Math.PI * 2,
            z: 0,
            duration: 2,
            ease: "power4.out",
          });
          setTimeout(() => {
            uniform1.uTexture.value = getTexture("last")!;
            setDetails()
          }, 100);
        }
        else if (e.key == "ArrowUp") {
          tl.to(camera.rotation, {
            x: 0,
            duration: 2,
            ease: "power4.out",
          });
        }
        else if (e.key == "ArrowDown") {
          tl.to(camera.rotation, {
            x: -Math.PI/2,
            duration: 2,
            ease: "power4.out",
          });
        }
      }
    });
  }, []);

  return (
    <>
      <Html>
        <div
          className="arrow-right"
          onClick={() => {
            if (!tl.isActive()) {
              tl.to(camera.rotation, {
                x: 0,
                y: camera.rotation.y - Math.PI * 2,
                z: 0,
                duration: 2,
                ease: "power4.out",
              });
              setTimeout(() => {
                uniform1.uTexture.value = getTexture("next")!;
                setDetails()
              }, 100);
            }
          }}
        ></div>
        <div
          className="arrow-left"
          onClick={() => {
            if (!tl.isActive()) {
              tl.to(camera.rotation, {
                x: 0,
                y: camera.rotation.y + Math.PI * 2,
                z: 0,
                duration: 2,
                ease: "power4.out",
              });
              setTimeout(() => {
                uniform1.uTexture.value = getTexture("last")!;
                setDetails()
              }, 100);
            }
          }}
        ></div>
        <div
          className="arrow-down"
          onClick={() => {
            if (!tl.isActive()) {
              tl.to(camera.rotation, {
                x: -Math.PI/2,
                duration: 2,
                ease: "power4.out",
              });
            }
          }}
        ></div>

        <MemoryName
          name={name}
          date={date}
          count={`${currentImg.current + 1}`}
          length={`${texRef.current.length}`}
        />
        <div className="ai-box">
          <h3>for the struggler:</h3>
          <p className={genInfo === "Thinking" ? "loading-dots" : ""}>{genInfo}</p>
        </div>

      </Html>
      <Html position={[0, -9, 0]} rotation={[0, 0, 10]}>
        <div
            className="arrow-up"
            onClick={() => {
              if (!tl.isActive()) {
                tl.to(camera.rotation, {
                  x: 0,
                  duration: 2,
                  ease: "power4.out",
                });
              }
            }}
          ></div>
      </Html>
      <Html position={[0, -6, 0]} rotation={[0, 0, 10]} fullscreen>
        
        <MemoryInfo nameRef={nameRef} dateRef={dateRef} infoRef={infoRef} currentImg={currentImg} imgRef={imgRef}/>
      </Html>
      <mesh
        rotation={[0, 0, 0]}
        ref={mesh1}
        onPointerOver={() => {
          if (mat1Ref.current) {
            gsap.to(mat1Ref.current.uniforms.uColor, {
              value: 0.0,
              duration: 0.5,
            });
            gsap.to(mat1Ref.current.uniforms.uSpeed, {
              value: 1.0,
              duration: 0.5,
            });
          }
          if (mat2Ref.current) {
            gsap.to(mat2Ref.current.uniforms.uColor, {
              value: 1.0,
              duration: 0.5,
            });
            gsap.to(mat2Ref.current.uniforms.uSpeed, {
              value: 1.0,
              duration: 0.5,
            });
          }
        }}
        onPointerLeave={() => {
          if (mat1Ref.current) {
            gsap.to(mat1Ref.current.uniforms.uColor, {
              value: 1.0,
              duration: 0.5,
            });
            gsap.to(mat1Ref.current.uniforms.uSpeed, {
              value: 0.0,
              duration: 0.5,
            });
          }
          if (mat2Ref.current) {
            gsap.to(mat2Ref.current.uniforms.uColor, {
              value: 1.3,
              duration: 0.5,
            });
            gsap.to(mat2Ref.current.uniforms.uSpeed, {
              value: 0.0,
              duration: 0.5,
            });
          }
        }}
        >
        <icosahedronGeometry args={[1, 1]} />
        <shaderMaterial
          ref={mat1Ref}
          vertexShader={vShader}
          fragmentShader={fShader}
          uniforms={uniform1}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[0, 0, 0]} ref={mesh2}>
        <icosahedronGeometry isBufferGeometry={true} args={[1.1, 1]} />
        <shaderMaterial
          ref={mat2Ref}
          vertexShader={lvShader}
          fragmentShader={lfShader}
          uniforms={uniform2}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

// Barycentric coordinates
function setupAttributes(geometry: any) {
  const length = geometry.attributes.position.array.length;
  const bary = [];
  for (let i = 0; i < length / 3; i++) {
    bary.push(0, 0, 1, 0, 1, 0, 1, 0, 0);
  }
  const aBary = new Float32Array(bary);
  geometry.setAttribute("aBary", new THREE.BufferAttribute(aBary, 3));
}
