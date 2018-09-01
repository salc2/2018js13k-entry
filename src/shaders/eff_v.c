attribute vec2 a_p;
attribute vec2 a_t;
uniform vec2 u_r;
varying vec2 v_t;
void main() {
   vec2 z1 = a_p / u_r;
   vec2 z2 = z1 * 2.0;
   vec2 cspc = z2 - 1.0;
   gl_Position = vec4(cspc * vec2(1, -1), 0, 1) * vec4(1.0,-1.0,1.0,1.0);
   v_t = a_t;
}
