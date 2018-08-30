attribute vec4 a_p;
attribute vec2 a_t;
uniform mat4 u_m;
uniform mat4 u_tm;
varying vec2 v_td;
void main() {
gl_Position = u_m * a_p;
v_td = (u_tm * vec4(a_t, 0, 1)).xy;
}
