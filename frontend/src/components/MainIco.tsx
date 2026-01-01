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
import { Howl } from "howler";

const turnRight = new Howl({
  src: ["/turn right.wav"],
});
const turnLeft = new Howl({
  src: ["/turn left.wav"],
  volume: 0.6,
});
const turnDown = new Howl({
  src: ["/turn down.wav"],
  volume: 0.6,
});
let isHovering = false;
const hover = new Howl({
  src: ["/onhover.wav"],
  volume: 0.0,
  loop: true,
  onfade: function () {
    if (hover.volume() === 0 && !isHovering) {
      hover.stop();
    }
  },
});

interface IcoProps {
  currentImg: React.RefObject<number>;
  nameRef: React.RefObject<any[] | null>;
  dateRef: React.RefObject<any[] | null>;
  infoRef: React.RefObject<any[] | null>;
  imgRef: React.RefObject<any[] | null>;
  texRef: React.RefObject<THREE.Texture[]>;
}

export default function MainIco({
  currentImg,
  nameRef,
  dateRef,
  infoRef,
  imgRef,
  texRef,
}: IcoProps) {
  // Creating all our references where we will store textures and mesh infos
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  const mat1Ref = useRef<THREE.ShaderMaterial>(null);
  const mat2Ref = useRef<THREE.ShaderMaterial>(null);
  const [name, setName] = useState(null!);
  const [date, setDate] = useState(null!);
  const [genInfo, setGenInfo] = useState<string | undefined>(null!);
  const { camera } = useThree();
  const tl = gsap.timeline(); // Timeline for Gsap
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  // Generate a motivational speech for each memory
  const GenAI = async (index: number) => {
    setGenInfo("Thinking");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: `
        Memory Name: "${nameRef.current && nameRef.current[index]}",
        Memory Description: "${infoRef.current && infoRef.current[index]}",
        Date: "${dateRef.current && dateRef.current[index]}",
        This is for my "Memory Cube" webapp, where user can upload a memory with name, description and a date. From these information, please generate a 10 to 30 words motivational sentence relating to that memory, similar to the small yellow text on Minecraft splash texts on the title screen, also take inspiration from ending quotes of Cowboy bebop, stuff like: "See you space cowboy..." or "Youre gonna carry that weight", be a bit realistic but also a bit romantic in the language. Furthermore, you could take inspirations from other popular media like Death stranding with its message of "keep on keeping on" and Cyberpunk 2077 "Never stop fighting". Additionally, no quotation marks!.
        `,
      });
      setGenInfo(response.text);
    } catch (error) {
      console.error(error);
      setGenInfo(
        "Such heavy thoughts... You're gonna carry that weight. Live on my friend!"
      );
    }
  };
  useEffect(() => {
    // Creating initial textures gotten from our database.
    GenAI(currentImg.current);
    if (nameRef.current && nameRef.current.length > 0)
      setName(nameRef.current[0]);
    if (dateRef.current && dateRef.current.length > 0) {
      dateRef.current[0] = dateRef.current[0]
        .split("T")[0]
        .split("-")
        .reverse()
        .join("/");
      setDate(dateRef.current[0]);
    }
    if (texRef.current.length > 0) {
      uniform1.uTexture.value = texRef.current[0];
    }
  }, [nameRef, dateRef, infoRef, texRef]);
  // Setting main name, date and AI generated text.
  const setDetails = () => {
    GenAI(currentImg.current);
    if (nameRef.current) setName(nameRef.current[currentImg.current]);
    if (dateRef.current) {
      // Reformatting datetime to D/M/Y format for users
      dateRef.current[currentImg.current] = dateRef.current[currentImg.current]
        .split("T")[0]
        .split("-")
        .reverse()
        .join("/");
      setDate(dateRef.current[currentImg.current]);
    }
  };
  // Rotating textures on click
  const getTexture = (direction: "next" | "last") => {
    const listT = texRef.current; // Get a list of textures (from our database, which are images)
    if (listT.length === 0) return null; // Check if theres no images
    if (direction === "next") {
      // Move up on index, used to iterate through all our list (which all our refs are)
      currentImg.current =
        currentImg.current < listT.length - 1
          ? currentImg.current + 1
          : currentImg.current - listT.length + 1;
    } else {
      // Move down on index
      currentImg.current =
        currentImg.current > 0
          ? currentImg.current - 1
          : listT.length + currentImg.current - 1;
    }
    return listT[currentImg.current];
  };

  // Storing uniforms
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
      uSpeed: { value: 0.3 },
    }),
    []
  );
  const uniform2 = useMemo(
    () => ({
      uTime: { type: "f", value: 0.0 },
      uSpeed: { value: 0.3 },
      uColor: { value: 1.3 },
    }),
    []
  );

  // Rotate icosahedron every frame
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
      mesh1.current.rotation.z += delta / 10;
    }
    if (mesh2.current) {
      mesh2.current.rotation.x += delta / 10;
      mesh2.current.rotation.y += delta / 10;
      mesh2.current.rotation.z += delta / 10;
    }
  });

  // Set up Barycentric coords and get KEYBOARD inputs
  useEffect(() => {
    setupAttributes(mesh2.current?.geometry);
    window.addEventListener("keydown", (e) => {
      if (!tl.isActive()) {
        if (e.key == "ArrowRight") {
          tl.to(camera.rotation, {
            x: 0,
            y: camera.rotation.y - Math.PI * 2,
            z: 0,
            duration: 2,
            ease: "power3.out",
          });
          setTimeout(() => {
            uniform1.uTexture.value = getTexture("next")!;
            setDetails();
            console.log(date);
          }, 150);
          turnRight.volume(0.0);
          turnRight.play();
          turnRight.fade(1, 0, 1000);
        } else if (e.key == "ArrowLeft") {
          turnLeft.play();
          turnLeft.fade(1, 0, 1000);
          tl.to(camera.rotation, {
            x: 0,
            y: camera.rotation.y + Math.PI * 2,
            z: 0,
            duration: 2,
            ease: "power3.out",
          });
          setTimeout(() => {
            uniform1.uTexture.value = getTexture("last")!;
            setDetails();
          }, 150);
        } else if (e.key == "ArrowUp") {
          turnDown.play();
          turnDown.fade(1, 0, 1000);
          tl.to(camera.rotation, {
            x: 0,
            duration: 2,
            ease: "power3.out",
          });
        } else if (e.key == "ArrowDown") {
          turnDown.play();
          turnDown.fade(1, 0, 1000);
          tl.to(camera.rotation, {
            x: -Math.PI / 2,
            duration: 2,
            ease: "power3.out",
          });
        }
      }
    });
  }, []);

  return (
    <>
      {/* Creating left-right-down arrows, main memory title and AI chatbox */}
      <Html occlude="blending">
        <div
          className="arrow-right"
          onClick={() => {
            if (!tl.isActive()) {
              turnRight.play();
              turnRight.fade(1, 0, 1000);
              tl.to(camera.rotation, {
                x: 0,
                y: camera.rotation.y - Math.PI * 2,
                z: 0,
                duration: 2,
                ease: "power3.out",
              });

              setTimeout(() => {
                uniform1.uTexture.value = getTexture("next")!;
                setDetails();
              }, 150);
            }
          }}
        ></div>
        <div
          className="arrow-left"
          onClick={() => {
            if (!tl.isActive()) {
              turnLeft.play();
              turnLeft.fade(1, 0, 1000);
              tl.to(camera.rotation, {
                x: 0,
                y: camera.rotation.y + Math.PI * 2,
                z: 0,
                duration: 2,
                ease: "power3.out",
              });
              setTimeout(() => {
                uniform1.uTexture.value = getTexture("last")!;
                setDetails();
              }, 150);
            }
          }}
        ></div>
        <div
          className="arrow-down"
          onClick={() => {
            if (!tl.isActive()) {
              turnDown.play();
              turnDown.fade(1, 0, 1000);
              tl.to(camera.rotation, {
                x: -Math.PI / 2,
                duration: 2,
                ease: "power3.out",
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
          <p className={genInfo === "Thinking" ? "loading-dots" : ""}>
            {genInfo}
          </p>
        </div>
      </Html>

      {/* Creating up arrow, all the memory infos when pressing down */}
      <Html position={[0, -9, 0]} rotation={[0, 0, 0]} zIndexRange={[100, 0]}>
        <div
          className="arrow-up"
          onClick={() => {
            if (!tl.isActive()) {
              turnDown.play();
              turnDown.fade(1, 0, 1000);
              tl.to(camera.rotation, {
                x: 0,
                duration: 2,
                ease: "power4.out",
              });
            }
          }}
        ></div>
      </Html>
      <Html
        position={[0, -6, 0]}
        rotation={[0, 0, 0]}
        zIndexRange={[10, 0]}
        fullscreen
      >
        <MemoryInfo
          nameRef={nameRef}
          dateRef={dateRef}
          infoRef={infoRef}
          currentImg={currentImg}
          imgRef={imgRef}
        />
      </Html>
      <mesh
        rotation={[0, 0, 0]}
        ref={mesh1}
        onPointerOver={() => {
          // Add color to grey-scaled (uColor) and increase noise (uSpeed)
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
          hover.play();
          hover.fade(hover.volume(), 0.045, 1000);
        }}
        onPointerLeave={() => {
          if (mat1Ref.current) {
            gsap.to(mat1Ref.current.uniforms.uColor, {
              value: 1.0,
              duration: 0.5,
            });
            gsap.to(mat1Ref.current.uniforms.uSpeed, {
              value: 0.3,
              duration: 0.5,
            });
          }
          if (mat2Ref.current) {
            gsap.to(mat2Ref.current.uniforms.uColor, {
              value: 1.3,
              duration: 0.5,
            });
            gsap.to(mat2Ref.current.uniforms.uSpeed, {
              value: 0.3,
              duration: 0.5,
            });
            hover.fade(hover.volume(), 0, 2500);
          }
        }}
        onClick={() => {
          if (!tl.isActive()) {
            turnDown.play();
            turnDown.fade(1, 0, 1000);
            tl.to(camera.rotation, {
              x: -Math.PI / 2,
              duration: 2,
              ease: "power3.out",
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
