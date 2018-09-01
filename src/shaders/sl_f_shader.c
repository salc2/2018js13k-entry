precision highp float;
uniform vec2 u_r;
uniform sampler2D img;
varying vec2 v_t;
const vec4 vColor = vec4(1.0,1.0,1.0,1.0);
const float R = 0.75;
const float S = 0.45;
const vec3 SP = vec3(1.2, 1.0, 0.8); 
float rand(vec2 co) {
return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main() {
vec4 tClr = texture2D(img, v_t);
vec2 pos = (gl_FragCoord.xy / u_r.xy) - vec2(0.5);
float len = length(pos);
float vnnt = smoothstep(R, R-S, len);
tClr.rgb = mix(tClr.rgb, tClr.rgb * vnnt, 0.5);
float gray = dot(tClr.rgb, vec3(0.299, 0.587, 0.114));
vec3 spc = vec3(gray) * SP;
tClr.rgb = mix(tClr.rgb, spc, 0.22);
gl_FragColor = tClr;
}
