precision mediump float;
varying vec2 v_td;
uniform sampler2D u_tx;
void main() {
gl_FragColor = texture2D(u_tx, v_td);
}
