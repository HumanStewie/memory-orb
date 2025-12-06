const fShader = /* glsl */`
    uniform float uTime;
    uniform vec2 uMouse;
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 eyeVector;

    float fresnel(float bias, float scale, float power, vec3 I, vec3 N) {
        return bias + scale * pow(1.0 + dot(I, N), power);
    }

    // Hash functions - https://github.com/Angelo1211/2020-Weekly-Shader-Challenge/blob/master/hashes.glsl
    uvec2 murmurHash22(uvec2 src) {
        const uint M = 0x5bd1e995u;
        uvec2 h = uvec2(1190494759u, 2147483647u);
        src *= M; src ^= src>>24u; src *= M;
        h *= M; h ^= src.x; h *= M; h ^= src.y;
        h ^= h>>13u; h *= M; h ^= h>>15u;
        return h;
    }

    vec2 hash22(vec2 src) {
        uvec2 h = murmurHash22(floatBitsToUint(src));
        return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
    }

    void main() {
        vec2 uv = gl_FragCoord.xy/vec2(1000.);
        
        // Computing Normals - Effectively creates flat shading
        vec3 X = dFdx(vNormal);
        vec3 Y = dFdy(vNormal);
        vec3 normal = normalize(cross(X, Y));

        //vec3 noise = vec3(snoise(vNormal * 1.0));
        //vec3 wave = vec3(fract(noise.y + uTime/1.5));
        
        float diffuse = dot(normal, vec3(0.9));
        
        vec2 rand = hash22(vec2(floor(diffuse*10.)));
        vec2 strength=vec2(
            sign((rand.x-.5))+(rand.x-.5)*5.,
            sign((rand.y-.5))+(rand.y-.5)*5.);

        vec2 newUv = strength*gl_FragCoord.xy/vec2(1000.0);

        vec3 camPos = normalize(vPosition - cameraPosition); // Vector of camera normalized
        
        float F = fresnel(0.3, 1.3, 1.5, camPos, normal);
        vec3 refraction = refract(eyeVector, normal, 1.0/3.0);
        
        newUv += refraction.xy;

        vec4 t = texture2D(uTexture, newUv);
        vec3 color = vec3(t.xyz);

        //gl_FragColor = t;
        gl_FragColor = vec4(color, 1.0);
    }
`;
export default fShader;