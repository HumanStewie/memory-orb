import vShader from "../shaders/vertex";
import fShader from "../shaders/fragment";
import lfShader from "../shaders/fragmentLine";
import lvShader from "../shaders/vertexLine";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { memo, useEffect, useMemo, useReducer, useRef, useState } from "react";
import gsap from "gsap";
import MemoryName from "./MemoryName";

interface IcoProps {
  onClick: () => void;
  currentImg: React.RefObject<number>;
  nameRef: React.RefObject<null>;
  dateRef: React.RefObject<null>;
  infoRef: React.RefObject<null>;
  idRef: React.RefObject<null>;
  texRef: React.RefObject<THREE.Texture[]>;
}

export default function MainIco({ onClick }: IcoProps) {
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  const mat1Ref = useRef<THREE.ShaderMaterial>(null);
  const mat2Ref = useRef<THREE.ShaderMaterial>(null);
  const [name, setName] = useState(null!);
  const [date, setDate] = useState(null!);
  const [info, setInfo] = useState(null!);
  const { camera } = useThree();
  const tl = gsap.timeline();
  useEffect(() => {
    if (nameRef.current) setName(nameRef.current[0]);
    if (dateRef.current) setDate(dateRef.current[0]);
    if (infoRef.current) setInfo(infoRef.current[0]);
    if (textures.length > 0) {
      uniform1.uTexture.value = textures[0];
    }
  });
  const setDetails = () => {
    if (nameRef.current) setName(nameRef.current[currentImg.current]);
    if (dateRef.current) setDate(dateRef.current[currentImg.current]);
    if (infoRef.current) setInfo(infoRef.current[currentImg.current]);
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
    console.log(currentImg.current);
    return listT[currentImg.current];
  };

  /*const t = new THREE.TextureLoader().load(
    "/hypothetically-couldnt-rae-shrink-down-and-get-inside-my-v0-zqnsul89e9vf1.webp"
  );
  t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
  const t2 = new THREE.TextureLoader().load(
    "https://res.cloudinary.com/memorystorage/image/upload/v1766634482/ikevtq6xhifuegsypsps.png"
  );
  t2.wrapS = t2.wrapT = THREE.MirroredRepeatWrapping;
  */
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

            localStorage.removeItem("index");
            localStorage.setItem("index", `${currentImg.current}`);
          }, 100);
        }
      }
    });
    window.addEventListener("keydown", (e) => {
      if (!tl.isActive()) {
        if (e.key == "ArrowLeft") {
          tl.to(camera.rotation, {
            x: 0,
            y: camera.rotation.y + Math.PI * 2,
            z: 0,
            duration: 2,
            ease: "power4.out",
          });
          setTimeout(() => {
            uniform1.uTexture.value = getTexture("last")!;
            if (nameRef.current) setName(nameRef.current[currentImg.current]);
            if (dateRef.current) setDate(dateRef.current[currentImg.current]);
            if (infoRef.current) setInfo(infoRef.current[currentImg.current]);
            localStorage.removeItem("index");
            localStorage.setItem("index", `${currentImg.current}`);
          }, 100);
        }
      }
    });
    window.addEventListener("keydown", (e) => {
      if (!tl.isActive()) {
        if (e.key == "ArrowDown") {
          tl.to(camera.rotation, {
            x: -Math.PI,
            duration: 2,
            ease: "power4.out",
          });
        }
      }
    });
    window.addEventListener("keydown", (e) => {
      if (!tl.isActive()) {
        if (e.key == "ArrowUp") {
          tl.to(camera.rotation, {
            x: 0,
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
                if (nameRef.current)
                  setName(nameRef.current[currentImg.current]);
                if (dateRef.current)
                  setDate(dateRef.current[currentImg.current]);
                if (infoRef.current)
                  setInfo(infoRef.current[currentImg.current]);
                localStorage.removeItem("index");
                localStorage.setItem("index", `${currentImg.current}`);
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
                if (nameRef.current)
                  setName(nameRef.current[currentImg.current]);
                if (dateRef.current)
                  setDate(dateRef.current[currentImg.current]);
                if (infoRef.current)
                  setInfo(infoRef.current[currentImg.current]);
                localStorage.removeItem("index");
                localStorage.setItem("index", `${currentImg.current}`);
              }, 100);
            }
          }}
        ></div>
        <div
          className="arrow-down"
          onClick={() => {
            if (!tl.isActive()) {
              tl.to(camera.rotation, {
                x: -Math.PI,
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
          console.log("gobv");
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
        onClick={onClick}
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
