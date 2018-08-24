const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const vshaderSrc:string = `
attribute vec4 a_p;
attribute vec2 a_t;
uniform mat4 u_m;
uniform mat4 u_tm;
varying vec2 v_td;
void main() {
gl_Position = u_m * a_p;
v_td = (u_tm * vec4(a_t, 0, 1)).xy;
}`;

const fshaderSrc:string = `    
precision mediump float;
varying vec2 v_td;
uniform sampler2D u_tx;
void main() {
gl_FragColor = texture2D(u_tx, v_td);
}`

export const gl = canvas.getContext("webgl");
const program = gl.createProgram();

var vshader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vshader, vshaderSrc);
gl.compileShader(vshader);

var fshader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fshader, fshaderSrc);
gl.compileShader(fshader);


// Attach pre-existing shaders
gl.attachShader(program, vshader);
gl.attachShader(program, fshader);

gl.linkProgram(program);

// look up where the vertex data needs to go.
var positionLocation = gl.getAttribLocation(program, "a_p");
var texcoordLocation = gl.getAttribLocation(program, "a_t");

// lookup uniforms
var matrixLocation = gl.getUniformLocation(program, "u_m");
var textureMatrixLocation = gl.getUniformLocation(program, "u_tm");
var textureLocation = gl.getUniformLocation(program, "u_tx");

// Create a buffer.
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Put a unit quad in the buffer
var positions = [
0, 0,
0, 1,
1, 0,
1, 0,
0, 1,
1, 1,
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Create a buffer for texture coords
var texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

// Put texcoords in the buffer
var texcoords = [
0, 0,
0, 1,
1, 0,
1, 0,
0, 1,
1, 1,
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);





function orthographic(left:number, right:number, bottom:number, top:number, near:number, far:number, dst:Float32Array = null) {
dst = dst || new Float32Array(16);

dst[ 0] = 2 / (right - left);
dst[ 1] = 0;
dst[ 2] = 0;
dst[ 3] = 0;
dst[ 4] = 0;
dst[ 5] = 2 / (top - bottom);
dst[ 6] = 0;
dst[ 7] = 0;
dst[ 8] = 0;
dst[ 9] = 0;
dst[10] = 2 / (near - far);
dst[11] = 0;
dst[12] = (left + right) / (left - right);
dst[13] = (bottom + top) / (bottom - top);
dst[14] = (near + far) / (near - far);
dst[15] = 1;

return dst;
}

function translate(m:any, tx:any, ty:any, tz:any,dst:Float32Array = null) {
// This is the optimized version of
// return multiply(m, translation(tx, ty, tz), dst);
dst = dst || new Float32Array(16);

var m00 = m[0];
var m01 = m[1];
var m02 = m[2];
var m03 = m[3];
var m10 = m[1 * 4 + 0];
var m11 = m[1 * 4 + 1];
var m12 = m[1 * 4 + 2];
var m13 = m[1 * 4 + 3];
var m20 = m[2 * 4 + 0];
var m21 = m[2 * 4 + 1];
var m22 = m[2 * 4 + 2];
var m23 = m[2 * 4 + 3];
var m30 = m[3 * 4 + 0];
var m31 = m[3 * 4 + 1];
var m32 = m[3 * 4 + 2];
var m33 = m[3 * 4 + 3];

if (m !== dst) {
  dst[ 0] = m00;
  dst[ 1] = m01;
  dst[ 2] = m02;
  dst[ 3] = m03;
  dst[ 4] = m10;
  dst[ 5] = m11;
  dst[ 6] = m12;
  dst[ 7] = m13;
  dst[ 8] = m20;
  dst[ 9] = m21;
  dst[10] = m22;
  dst[11] = m23;
}

dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

return dst;
}

function scale(m:any, sx:any, sy:any, sz:any, dst:Float32Array = null) {
// This is the optimized verison of
// return multiply(m, scaling(sx, sy, sz), dst);
dst = dst || new Float32Array(16);

dst[ 0] = sx * m[0 * 4 + 0];
dst[ 1] = sx * m[0 * 4 + 1];
dst[ 2] = sx * m[0 * 4 + 2];
dst[ 3] = sx * m[0 * 4 + 3];
dst[ 4] = sy * m[1 * 4 + 0];
dst[ 5] = sy * m[1 * 4 + 1];
dst[ 6] = sy * m[1 * 4 + 2];
dst[ 7] = sy * m[1 * 4 + 3];
dst[ 8] = sz * m[2 * 4 + 0];
dst[ 9] = sz * m[2 * 4 + 1];
dst[10] = sz * m[2 * 4 + 2];
dst[11] = sz * m[2 * 4 + 3];

if (m !== dst) {
  dst[12] = m[12];
  dst[13] = m[13];
  dst[14] = m[14];
  dst[15] = m[15];
}

return dst;
}

function translation(tx:any, ty:any, tz:any, dst:Float32Array = null) {
dst = dst || new Float32Array(16)

dst[ 0] = 1;
dst[ 1] = 0;
dst[ 2] = 0;
dst[ 3] = 0;
dst[ 4] = 0;
dst[ 5] = 1;
dst[ 6] = 0;
dst[ 7] = 0;
dst[ 8] = 0;
dst[ 9] = 0;
dst[10] = 1;
dst[11] = 0;
dst[12] = tx;
dst[13] = ty;
dst[14] = tz;
dst[15] = 1;

return dst;
}


export function getImg(url: string):any {
var tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
// Fill the texture with a 1x1 blue pixel.
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));

// let's assume all images are not a power of 2
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

var textureInfo = {
  width: 1,   // we don't know the size until it loads
  height: 1,
  texture: tex,
};
var img = new Image();
img.addEventListener('load', function() {
  textureInfo.width = img.width;
  textureInfo.height = img.height;

  gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
});
img.src = url;

return textureInfo;
}

export function drawImage(tex:any, texWidth:number, texHeight:number,
  srcX:number, srcY:number, srcWidth:number, srcHeight:number,
  dstX:number, dstY:number, dstWidth:number, dstHeight:number)  {
if (dstX === undefined) {
  dstX = srcX;
  srcX = 0;
}
if (dstY === undefined) {
  dstY = srcY;
  srcY = 0;
}
if (srcWidth === undefined) {
  srcWidth = texWidth;
}
if (srcHeight === undefined) {
  srcHeight = texHeight;
}
if (dstWidth === undefined) {
  dstWidth = srcWidth;
  srcWidth = texWidth;
}
if (dstHeight === undefined) {
  dstHeight = srcHeight;
  srcHeight = texHeight;
}

gl.bindTexture(gl.TEXTURE_2D, tex);

// Tell WebGL to use our shader program pair
gl.useProgram(program);

// Setup the attributes to pull data from our buffers
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
gl.enableVertexAttribArray(texcoordLocation);
gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

// this matirx will convert from pixels to clip space
var matrix = orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

// this matrix will translate our quad to dstX, dstY
matrix = translate(matrix, dstX, dstY, 0);

// this matrix will scale our 1 unit quad
// from 1 unit to texWidth, texHeight units
matrix = scale(matrix, dstWidth, dstHeight, 1);

// Set the matrix.
gl.uniformMatrix4fv(matrixLocation, false, matrix);

// Because texture coordinates go from 0 to 1
// and because our texture coordinates are already a unit quad
// we can select an area of the texture by scaling the unit quad
// down
var texMatrix = translation(srcX / texWidth, srcY / texHeight, 0);
texMatrix = scale(texMatrix, srcWidth / texWidth, srcHeight / texHeight, 1);

// Set the texture matrix.
gl.uniformMatrix4fv(textureMatrixLocation, false, texMatrix);

// Tell the shader to get the texture from texture unit 0
gl.uniform1i(textureLocation, 0);

// draw the quad (2 triangles, 6 vertices)
gl.drawArrays(gl.TRIANGLES, 0, 6);
}


