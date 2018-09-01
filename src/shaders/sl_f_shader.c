precision highp float;
uniform float uTime;
uniform vec2 u_resolution;
uniform sampler2D u_image;
varying vec2 v_texCoord;
const vec4 vColor = vec4(1.0,1.0,1.0,1.0);
const float RADIUS = 0.75;
const float SOFTNESS = 0.45;
const vec3 SEPIA = vec3(1.2, 1.0, 0.8); 
float rand(vec2 co) {
return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main() {
vec4 texColor = texture2D(u_image, v_texCoord);
vec2 position = (gl_FragCoord.xy / u_resolution.xy) - vec2(0.5);
float len = length(position);
float vignette = smoothstep(RADIUS, RADIUS-SOFTNESS, len);
texColor.rgb = mix(texColor.rgb, texColor.rgb * vignette, 0.5);
float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
vec3 sepiaColor = vec3(gray) * SEPIA;
texColor.rgb = mix(texColor.rgb, sepiaColor, 0.22);
gl_FragColor = texColor;//texColor;
}
