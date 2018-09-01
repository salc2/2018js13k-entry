import {gl, createAndSetupTexture, createProgram} from './render.webgl';

const vshaderSrcPE: string = require('./shaders/sl_v_shader.c');
const fshaderSrcPE: string = require('./shaders/sl_f_shader.c');

const program = createProgram(gl,fshaderSrcPE,vshaderSrcPE);
gl.useProgram(program);

var positionLocation = gl.getAttribLocation(program, "a_p");
var texcoordLocation = gl.getAttribLocation(program, "a_t");

var positionBuffer = gl.createBuffer();
var texcoordBuffer = gl.createBuffer();
var resolutionLocation = gl.getUniformLocation(program, "u_r");


export function renderPostProcessing(time,text){


gl.bindFramebuffer(gl.FRAMEBUFFER, null);

// render the cube with the texture we just rendered to
gl.bindTexture(gl.TEXTURE_2D, text);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas AND the depth buffer.
gl.clearColor(  0.93333, 0.93333, 0.93333, 1.0);   // clear to white
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.useProgram(program);


///
///
///

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// Set a rectangle the same size as the image.
setRectangle(gl, 0, 0, gl.canvas.width, gl.canvas.height);




gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0,
]), gl.STATIC_DRAW);

gl.enableVertexAttribArray(positionLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.vertexAttribPointer(
    positionLocation, 2, gl.FLOAT, false, 0, 0)

// Turn on the teccord attribute
gl.enableVertexAttribArray(texcoordLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

gl.vertexAttribPointer(
    texcoordLocation, 2, gl.FLOAT, false, 0, 0)

gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

gl.drawArrays( gl.TRIANGLES, 0, 6);
}



function setRectangle(gl, x, y, width, height) {
var x1 = x;
var x2 = x + width;
var y1 = y;
var y2 = y + height;
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
   x1, y1,
   x2, y1,
   x1, y2,
   x1, y2,
   x2, y1,
   x2, y2,
]), gl.STATIC_DRAW);
}
