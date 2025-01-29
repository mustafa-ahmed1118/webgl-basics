function showError(errorText){
    const errorBoxDiv = document.getElementById('error-box');
    const errorTextElement = document.createElement('p');
    errorTextElement.innerText = errorText;
    errorBoxDiv.appendChild(errorTextElement);
    console.log(errorText);
}

showError('This is  what an error looks like!');

function helloTriangle(){

    //Initializing the Web Gl canvas - catch error 
    /** @type {HTMLCanvasElement|null} */
    const canvas = document.getElementById('demo-canvas');
    if(!canvas){
        showError('Cannot get demo-canvas reference - check for typos or loading script too early in HTMl');
        return;
    }
    const gl = canvas.getContext('webgl2');
    if(!gl){
        showError('This browser does not suppport Web Gl 2 - demo will no work!')
        return;
    }

    //clear the buffers to prepare
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //define data the GPU will use

    //Raw triangle
    const triangleVertices = [
        // top middle
        0.0, 0.5,
        // bottom left
        -0.5, -0.5,
        // bottom right
        0.5, -0.5
    ];
    //makes the triangle usable by GPU
    const triangleVerticesCpuBuffer = new Float32Array(triangleVertices)

    //sending the buffer to gpu
    const triangleGeoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesCpuBuffer, gl.STATIC_DRAW);

    //preparing vertex shader
    const vertexShaderSourceCode = `#version 300 es
    precision mediump float;

    in vec2 vertexPosition;

    void main(){
        gl_Position = vec4(vertexPosition, 0.0, 1.0);
    }`;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        const compileError = gl.getShaderInfoLog(vertexShader);
        showError(`Failed to COMPILE vertex shader - ${compileError}`);
        return;
    }

    //preparing fragment shader
    const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;

    out vec4 outputColor;

    void main(){
        outputColor = vec4(0.294, 0.0, 0.51, 1.0);    
    }`;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader , gl.COMPILE_STATUS)){
        const compileError = gl.getShaderInfoLog(fragmentShader);
        showError(`Failed to COMPILE fragment shader - ${compileError}`);
        return;
    }

    //combine the vertex and fragment shaders into one programs
    const triangleShaderProgram = gl.createProgram();
    gl.attachShader(triangleShaderProgram, vertexShader); 
    gl.attachShader(triangleShaderProgram, fragmentShader); 
    gl.linkProgram(triangleShaderProgram);
    if(!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)){
        const linkError = gl.getProgramInfoLog(triangleShaderProgram);
        showError(`Failed to LINK shaders - ${linkError}`);
        return;
    }
}
try{
    helloTriangle();
}catch(e){
    showError(`Uncaught JavaScript exception ${e}`);
}