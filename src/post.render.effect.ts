import {gl, createAndSetupTexture} from './render.webgl';

const vshaderSrcPE: string = require('./shaders/sl_v_shader.c');
const fshaderSrcPE: string = require('./shaders/sl_f_shader.c');

const program = gl.createProgram();

var vshader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vshader, vshaderSrcPE);
gl.compileShader(vshader);

var fshader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fshader, fshaderSrcPE);
gl.compileShader(fshader);


// Attach pre-existing shaders
gl.attachShader(program, vshader);
gl.attachShader(program, fshader);

gl.linkProgram(program);
gl.useProgram(program);

// look up where the vertex data needs to go.
var positionLocation = gl.getAttribLocation(program, "a_position");
var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

// Create a buffer to put three 2d clip space points in
var positionBuffer = gl.createBuffer();



// provide texture coordinates for the rectangle.
var texcoordBuffer = gl.createBuffer();




// lookup uniforms
var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
var uTimeLocation = gl.getUniformLocation(program, "uTime");

//webglUtils.resizeCanvasToDisplaySize(gl.canvas);

// // Tell WebGL how to convert from clip space to pixels
// gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// // Clear the canvas
// gl.clearColor(0, 0, 0, 0);
// gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
//gl.useProgram(program);

// Turn on the position attribute

// Create a texture.
//var texture = createAndSetupTexture(gl);

// Upload the image into the texture.

 
    // Attach a texture to it.

/*  gl.uniform1f(uTimeLocation, 2.6);

// Draw the rectangle.
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6;
gl.drawArrays(primitiveType, offset, count);*/
export function renderPostProcessing(time,text){


gl.bindFramebuffer(gl.FRAMEBUFFER, null);

// render the cube with the texture we just rendered to
gl.bindTexture(gl.TEXTURE_2D, text);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas AND the depth buffer.
gl.clearColor(1, 1, 1, 1);   // clear to white
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

// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
    positionLocation, size, type, normalize, stride, offset)

// Turn on the teccord attribute
gl.enableVertexAttribArray(texcoordLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

// Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
    texcoordLocation, size, type, normalize, stride, offset)

// set the resolution
gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);



gl.uniform1f(uTimeLocation, time);
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6;
gl.drawArrays(primitiveType, offset, count);
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
