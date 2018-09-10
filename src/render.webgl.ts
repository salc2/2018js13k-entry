const mainVsrc: string = require('./shaders/main_v.c');
const mainFsrc: string = require('./shaders/main_f.c');
const effVsrc: string = require('./shaders/eff_v.c');
const effFsrc: string = require('./shaders/eff_f.c');

export const canvas = <HTMLCanvasElement>document.getElementById("c");
export const g = canvas.getContext("webgl");

const mainProgram = createProgram(g,mainFsrc,mainVsrc);
const effProgram = createProgram(g,effFsrc,effVsrc);

//g.uniform1f(, 1.0);

const a_pMain = getAttrLoc(mainProgram, "a_p");
const a_tMain = getAttrLoc(mainProgram, "a_t");
const a_tEffec = getAttrLoc(effProgram, "a_t");
const a_pEffec = getAttrLoc(effProgram, "a_p");
const u_mMain = getUniLoc(mainProgram, "u_m");
const u_tM = getUniLoc(mainProgram, "u_tm");
const u_tX = getUniLoc(mainProgram, "u_tx");
const u_rEffec = getUniLoc(effProgram, "u_r")
// Create a buffer.
const positionBuffer = g.createBuffer();
g.bindBuffer(g.ARRAY_BUFFER, positionBuffer);

// Put a unit quad in the buffer
const positions = [
0, 0,
0, 1,
1, 0,
1, 0,
0, 1,
1, 1,
]
g.bufferData(g.ARRAY_BUFFER, new Float32Array(positions), g.STATIC_DRAW);


// Create a buffer for texture coords
const texcoordBuffer = g.createBuffer();
g.bindBuffer(g.ARRAY_BUFFER, texcoordBuffer);

// Put texcoords in the buffer
const texcoords = [
0, 0,
0, 1,
1, 0,
1, 0,
0, 1,
1, 1,
]
g.bufferData(g.ARRAY_BUFFER, new Float32Array(texcoords), g.STATIC_DRAW);

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

function translate(m:Float32Array, tx:number, ty:number, tz:number,dst:Float32Array = null) {
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

function scale(m:Float32Array, sx:number, sy:number, sz:number, dst:Float32Array = null) {
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

function translation(tx:number, ty:number, tz:number, dst:Float32Array = null) {
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

export function createAndSetupTexture(g: WebGLRenderingContext): WebGLTexture {
  var texture = g.createTexture();
  g.bindTexture(g.TEXTURE_2D, texture);

  // Set up texture so we can render any size image and so we are
  // working with pixels.
  g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
  g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
  g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST);
  g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);

  return texture;
}


export interface Img{
  tex: WebGLTexture;
  w: number;
  h: number;
}

export function getImg(url: string):Img {
  var tex = createAndSetupTexture(g);
  var textureInfo = {
  w: 1,   // we don't know the size until it loads
  h: 1,
  tex: tex,
};
var img = new Image();
img.addEventListener('load', function() {
  textureInfo.w = img.width;
  textureInfo.h = img.height;

  g.bindTexture(g.TEXTURE_2D, textureInfo.tex);
  g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, img);
});
img.src = url;

return textureInfo;
}

export const postTexture = createAndSetupTexture(g);
g.texImage2D(g.TEXTURE_2D, 0, g.RGBA,
  g.canvas.width, g.canvas.height, 0,
  g.RGBA, g.UNSIGNED_BYTE, null);
const fb = g.createFramebuffer();


// attach the texture as the first color attachment
const attachmentPoint = g.COLOR_ATTACHMENT0;

export function bindFrameBuffer(){
  g.bindFramebuffer(g.FRAMEBUFFER, fb);
  g.framebufferTexture2D(g.FRAMEBUFFER, attachmentPoint, g.TEXTURE_2D, postTexture, 0);
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

g.bindTexture(g.TEXTURE_2D, tex);

// Tell WebGL to use our shader mainProgram pair
g.useProgram(mainProgram);


// Setup the attributes to pull data from our buffers
rebindBuffers(a_pMain, positionBuffer);
rebindBuffers(a_tMain, texcoordBuffer);

// this matirx will convert from pixels to clip space
var matrix = orthographic(0, g.canvas.width, g.canvas.height, 0, -1, 1);

// this matrix will translate our quad to dstX, dstY
matrix = translate(matrix, dstX, dstY, 0);

// this matrix will scale our 1 unit quad
// from 1 unit to texWidth, texHeight units
matrix = scale(matrix, dstWidth, dstHeight, 1);

// Set the matrix.

g.uniformMatrix4fv(u_mMain, false, matrix);

// Because texture coordinates go from 0 to 1
// and because our texture coordinates are already a unit quad
// we can select an area of the texture by scaling the unit quad
// down
var texMatrix = translation(srcX / texWidth, srcY / texHeight, 0);
texMatrix = scale(texMatrix, srcWidth / texWidth, srcHeight / texHeight, 1);
// Set the texture matrix.
g.uniformMatrix4fv(u_tM, false, texMatrix);

// Tell the shader to get the texture from texture unit 0
g.uniform1i(u_tX, 0);

// draw the quad (2 triangles, 6 vertices)
g.drawArrays(g.TRIANGLES, 0, 6);
}

const positionBufferEff = g.createBuffer();
const texcoordBufferEff = g.createBuffer();


export function renderPostProcessing(time: number, text: WebGLTexture){

g.bindFramebuffer(g.FRAMEBUFFER, null);

// render the cube with the texture we just rendered to
g.bindTexture(g.TEXTURE_2D, text);

g.viewport(0, 0, g.canvas.width, g.canvas.height);

// Clear the canvas AND the depth buffer.
//g.clearColor(  0.93333, 0.93333, 0.93333, 1.0);   // clear to white
g.clearColor(0.67800, 0.49800, 0.65900, 1.0);
g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
g.useProgram(effProgram);

rebindBuffers(a_tEffec, texcoordBufferEff);
g.bufferData(g.ARRAY_BUFFER, new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0,
]), g.STATIC_DRAW);


rebindBuffers(a_pEffec, positionBufferEff);
setRectangle(g, 0, 0, g.canvas.width, g.canvas.height);

g.uniform2f(u_rEffec, g.canvas.width, g.canvas.height);

g.drawArrays( g.TRIANGLES, 0, 6);
}

function setRectangle(g: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
var x1 = x;
var x2 = x + width;
var y1 = y;
var y2 = y + height;
g.bufferData(g.ARRAY_BUFFER, new Float32Array([
   x1, y1,
   x2, y1,
   x1, y2,
   x1, y2,
   x2, y1,
   x2, y2,
]), g.STATIC_DRAW);
}

function getAttrLoc(prog: WebGLProgram, name: string){
  return g.getAttribLocation(prog, name);
}

function getUniLoc(prog: WebGLProgram, name: string){
  return g.getUniformLocation(prog, name);
}

function rebindBuffers(location:number, buffer: WebGLBuffer){
  g.bindBuffer(g.ARRAY_BUFFER, buffer);
  g.enableVertexAttribArray(location);
  g.vertexAttribPointer(location, 2, g.FLOAT, false, 0, 0);
}
function createProgram(g: WebGLRenderingContext, fsSrc:string,vsSrc:string){
  const prgm = g.createProgram();
  const vshader = g.createShader(g.VERTEX_SHADER);
  g.shaderSource(vshader, vsSrc);
  g.compileShader(vshader);
  const fshader = g.createShader(g.FRAGMENT_SHADER);
  g.shaderSource(fshader, fsSrc);
  g.compileShader(fshader);
  g.attachShader(prgm, vshader);
  g.attachShader(prgm, fshader);
  g.linkProgram(prgm);
  return prgm;
}
