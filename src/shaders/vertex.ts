const vShader = /* glsl */ `
    #define PI 3.14159265359
    uniform vec2 uMouse;
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;
     varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 eyeVector;
    precision highp float;

    void main() {
        vUv = uv;
        vPosition = position;

        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        eyeVector = normalize(worldPos.xyz - cameraPosition);
        

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
export default vShader;