import './App.css'
import vShader from './shaders/vertex'
import fShader from './shaders/fragment'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function PlaneShader() { 
  const uniform = {
    u_time: {type: 'f', value: 0.0}
  }
  
  useFrame((state, delta) => {
    uniform.u_time.value += delta;
  })

  return (
    <mesh rotation={[0, 0, 0]}>
      <icosahedronGeometry args={[1,1]}/>
      <shaderMaterial vertexShader={vShader} fragmentShader={fShader} wireframe uniforms={uniform}/>
    </mesh>
  )
}

function App() {

  return (
    <div id="canvas-container">
      <Canvas scene={{background: new THREE.Color('grey')}}>
        <OrbitControls />
        <axesHelper args={[5]} />
        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <PlaneShader />
      </Canvas>
    </div>
  )
}

export default App
