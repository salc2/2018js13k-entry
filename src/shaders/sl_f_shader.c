precision highp float;
uniform float uTime;
uniform vec2 u_resolution; //u_resolution
uniform sampler2D u_image; //u_image
varying vec2 v_texCoord;

const vec4 vColor = vec4(1.0,1.0,1.0,1.0);


//RADIUS of our vignette, where 0.5 results in a circle fitting the screen
const float RADIUS = 0.75;

//softness of our vignette, between 0.0 and 1.0
const float SOFTNESS = 0.45;

//sepia colour, adjust to taste
const vec3 SEPIA = vec3(1.2, 1.0, 0.8); 

//TE scanline effect
//some code by iq, extended to make it look right
//ported to Rajawali by Davhed
float rand(vec2 co) {
return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
vec4 texColor = texture2D(u_image, v_texCoord);

//1. VIGNETTE

//determine center position
vec2 position = (gl_FragCoord.xy / u_resolution.xy) - vec2(0.5);

//determine the vector length of the center position
float len = length(position);

//use smoothstep to create a smooth vignette
float vignette = smoothstep(RADIUS, RADIUS-SOFTNESS, len);

//apply the vignette with 50% opacity
texColor.rgb = mix(texColor.rgb, texColor.rgb * vignette, 0.5);

//2. GRAYSCALE

//convert to grayscale using NTSC conversion weights
float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

//3. SEPIA

//create our sepia tone from some constant value
vec3 sepiaColor = vec3(gray) * SEPIA;

//again we'll use mix so that the sepia effect is at 75%
texColor.rgb = mix(texColor.rgb, sepiaColor, 0.22);

vec2 q = gl_FragCoord.xy / u_resolution.xy;

// subtle zoom in/out 
//vec2 uv = 0.5 + (q-0.5)*(0.98 + 0.006*sin(0.9*uTime));
vec2 uv = 0.5 + (q-0.5)*(0.98 + 0.001*sin(0.95*uTime));
vec3 oricol = texture2D(u_image,v_texCoord).xyz;
vec3 col;

// start with the source texture and misalign the rays it a bit
// TODO animate misalignment upon hit or similar event
col.r = texture2D(u_image,vec2(uv.x+0.003,-uv.y)).x;
col.g = texture2D(u_image,vec2(uv.x+0.000,-uv.y)).y;
col.b = texture2D(u_image,vec2(uv.x-0.003,-uv.y)).z;

// contrast curve
col = clamp(col*0.5+0.5*col*col*1.2,0.0,1.0);

//vignette
col *= 0.6 + 0.4*16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y);

//color tint
col *= vec3(0.9,1.0,0.7);

//scanline (last 2 constants are crawl speed and size)
//TODO make size dependent on viewport
col *= 0.8+0.2*sin(10.0*uTime+uv.y*900.0);

//flickering (semi-randomized)
col *= 1.0-0.07*rand(vec2(uTime, tan(uTime)));

//smoothen
float comp = smoothstep( 0.2, 0.7, sin(uTime) );
col = mix( col, oricol, clamp(-2.0+2.0*q.x+3.0*comp,0.0,1.0) );
//gl_FragColor = texture2D(u_image, v_texCoord);
//gl_FragColor = vec4(col*0.23,1.0) + texColor;
gl_FragColor = texColor;
//gl_FragColor = vec4(col,1.0) + (texColor * vColor);
//gl_FragColor = (texColor * vColor);
}
