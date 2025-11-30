const vShader = /* glsl */ `
    uniform float u_time;
    void main() {
        vec3 newPosition = vec3(position.x, position.y, position.z);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`;
export default vShader;