const fShader = /* glsl */`
    uniform float uTime;
    uniform vec2 uMouse;
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform float uColor;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 eyeVector;

    float fresnel(float bias, float scale, float power, vec3 I, vec3 N) {
        return bias + scale * pow(1.0 + dot(I, N), power);
    }

    // Hash functions - https://github.com/Angelo1211/2020-Weekly-Shader-Challenge/blob/master/hashes.glsl
    vec2 hash22(vec2 p){
    p=fract(p*vec2(5.3983,5.4427));
    p+=dot(p.yx,p.xy+vec2(21.5351,14.3137));
    return fract(vec2(p.x*p.y*95.4337,p.x*p.y*97.597));
    }

    void main() {
        vec2 uv = gl_FragCoord.xy/vec2(1000.);
        // Computing Normals - Effectively creates flat shading
        vec3 X = dFdx(vNormal);
        vec3 Y = dFdy(vNormal);
        vec3 normal = normalize(cross(X, Y));

        float redOffset   =  0.009;
        float greenOffset =  0.006;
        float blueOffset  = -0.006;
        
        
        float diffuse = dot(normal, vec3(0.9));
        
        vec2 rand = hash22(vec2(floor(diffuse*10.)));
        vec2 strength=vec2(
            sign((rand.x-.5))+(rand.x-.5)*.6,
            sign((rand.y-.5))+(rand.y-.5)*.6);

        vec2 newUv = strength*gl_FragCoord.xy/vec2(1000.0);

        vec3 camPos = normalize(vPosition - cameraPosition); // Vector of camera normalized
        
        float F = fresnel(0.1, 1.5, 2., camPos, normal);
        vec3 refraction = refract(eyeVector, normal, 1.0/3.0);

        newUv += refraction.xy;
            
        vec4 t = texture2D(uTexture, newUv);
        
        float grey = 0.21 * t.r + 0.71 * t.g + 0.07 * t.b;
        vec3 color = vec3((1.0-F)*(t.rgb * (1.0 - uColor) + (grey * uColor))/1.2);
        
        //gl_FragColor = t;
        gl_FragColor = vec4(color, 1.0);
        //gl_FragColor = vec4(t.rgb, 1.0);
    }
`;
export default fShader;