const lfShader = /* glsl */ `
    #define PI 3.14159265359
    uniform float uColor;
    varying vec3 vBary;

	void main() { 
        float width = 2.0;
        vec3 f = fwidth(vBary);
        vec3 s = smoothstep(f*(width + 0.5), f*(width - 0.5), vBary);
        float line = max(s.y, max(s.x, s.z));
        if(line<0.2) discard;
        gl_FragColor= vec4(vec3(line/uColor), 1.0);
    }
`;
export default lfShader;