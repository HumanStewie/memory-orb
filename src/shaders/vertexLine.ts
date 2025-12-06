const lvShader = /* glsl */`
    attribute vec3 aBary;
    varying vec3 vBary;
    void main() {
        vBary = aBary;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
export default lvShader;