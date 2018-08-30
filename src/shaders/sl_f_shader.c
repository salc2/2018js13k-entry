precision highp float;
uniform float uTime;
uniform vec2 u_resolution;
uniform sampler2D u_image;
varying vec2 v_texCoord;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main() {
vec2 q = gl_FragCoord.xy / u_resolution.xy;
vec2 uv = 0.5 + (q-0.5)*(0.98 + 0.001*sin(0.95*uTime));
vec3 oricol = texture2D(u_image,vec2(q.x,1.0-q.y)).xyz;
vec3 col;
col.r = texture2D(u_image,vec2(uv.x+0.003,-uv.y)).x;
col.g = texture2D(u_image,vec2(uv.x+0.000,-uv.y)).y;
col.b = texture2D(u_image,vec2(uv.x-0.003,-uv.y)).z;
col = clamp(col*0.5+0.5*col*col*1.2,0.0,1.0);
col *= 0.6 + 0.4*16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y);
col *= vec3(0.9,1.0,0.7);
col *= 0.8+0.2*sin(10.0*uTime+uv.y*900.0);
col *= 1.0-0.07*rand(vec2(uTime, tan(uTime)));
gl_FragColor = vec4(col,1.0) + texture2D(u_image, v_texCoord);
}
