// This function takes the translation and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// You can use the MatrixMult function defined in project5.html to multiply two 4x4 matrices in the same format.
function GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
{
    // Rotation around X-axis
    var rotX = [
        1, 0, 0, 0,
        0, Math.cos(rotationX), Math.sin(rotationX), 0,
        0, -Math.sin(rotationX), Math.cos(rotationX), 0,
        0, 0, 0, 1
    ];

    // Rotation around Y-axis
    var rotY = [
        Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
        0, 1, 0, 0,
        Math.sin(rotationY), 0, Math.cos(rotationY), 0,
        0, 0, 0, 1
    ];

    // Translation
    var trans = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translationX, translationY, translationZ, 1
    ];

    // Combine transformations: Translation * RotationY * RotationX
    var mv = MatrixMult(trans, MatrixMult(rotY, rotX));
    return mv;
}

// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
    // The constructor is a good place for taking care of the necessary initializations.
    constructor()
    {
        // [TO-DO] initializations
        // Create shader program
        this.prog = InitShaderProgram(this.vertexShaderSource(), this.fragmentShaderSource());
        
        // Get attribute/uniform locations
        this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp');
        this.mvLoc = gl.getUniformLocation(this.prog, 'mv');
        this.nrmLoc = gl.getUniformLocation(this.prog, 'normalMatrix');
        this.swapLoc = gl.getUniformLocation(this.prog, 'swap');
        this.showTexLoc = gl.getUniformLocation(this.prog, 'showTex');
        this.lightDirLoc = gl.getUniformLocation(this.prog, 'lightDir');
        this.shininessLoc = gl.getUniformLocation(this.prog, 'shininess');

        this.vertPosLoc = gl.getAttribLocation(this.prog, 'pos');
        this.texCoordLoc = gl.getAttribLocation(this.prog, 'texCoord');
        this.normalLoc = gl.getAttribLocation(this.prog, 'normal');

        // Create buffers
        this.vertBuffer = gl.createBuffer();
        this.texBuffer = gl.createBuffer();
        this.normBuffer = gl.createBuffer();

        // Create texture
        this.texture = gl.createTexture();
        
        this.numTriangles = 0;
    }

    // This method is called every time the user opens an OBJ file.
    // The arguments of this function are an array of 3D vertex positions,
    // an array of 2D texture coordinates, and an array of vertex normals.
    setMesh( vertPos, texCoords, normals )
    {
        // [TO-DO] Update the contents of the vertex buffer objects.
        this.numTriangles = vertPos.length / 3;

        // Upload vertex positions
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

        // Upload texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        // Upload normals
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    }

    // This method is called when the user changes the state of the
    // "Swap Y-Z Axes" checkbox. 
    // The argument is a boolean that indicates if the checkbox is checked.
    swapYZ( swap )
    {
        // [TO-DO] Set the uniform parameter(s) of the vertex shader
        gl.useProgram(this.prog);
        gl.uniform1i(this.swapLoc, swap ? 1 : 0);
    }

    // This method is called to draw the triangular mesh.
    // The arguments are the model-view-projection transformation matrixMVP,
    // the model-view transformation matrixMV, and the normal transformation matrix.
    draw( matrixMVP, matrixMV, matrixNormal )
    {
        // [TO-DO] Complete the WebGL initializations before drawing
        gl.useProgram(this.prog);

        // Set matrices
        gl.uniformMatrix4fv(this.mvpLoc, false, matrixMVP);
        gl.uniformMatrix4fv(this.mvLoc, false, matrixMV);
        gl.uniformMatrix3fv(this.nrmLoc, false, matrixNormal);

        // Bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.vertexAttribPointer(this.vertPosLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vertPosLoc);

        // Bind texture coordinates buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.texCoordLoc);

        // Bind normal buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
        gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.normalLoc);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
    }

    // This method is called to set the texture of the mesh.
    // The argument is an HTML IMG element containing the texture data.
    setTexture( img )
    {
        // [TO-DO] Bind the texture
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

        // [TO-DO] Now that we have a texture, it might be a good idea to set
        // some uniform parameter(s) of the fragment shader, so that it uses the texture.
        
        // I added a repetition of the texture because I was having problems with the teapot
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Set flag to show texture
        this.showTexture(true);
    }

    // This method is called when the user changes the state of the
    // "Show Texture" checkbox. 
    // The argument is a boolean that indicates if the checkbox is checked.
    showTexture( show )
    {
        // [TO-DO] Set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
        gl.useProgram(this.prog);
        gl.uniform1i(this.showTexLoc, show ? 1 : 0);
    }

    // This method is called to set the incoming light direction
    setLightDir( x, y, z )
    {
        gl.useProgram(this.prog);
        gl.uniform3f(this.lightDirLoc, x, y, z);
    }

    // This method is called to set the shininess of the material
    setShininess( shininess )
    {
        gl.useProgram(this.prog);
        gl.uniform1f(this.shininessLoc, shininess);
    }

    vertexShaderSource()
    {
        return `
            attribute vec3 pos;
            attribute vec2 texCoord;
            attribute vec3 normal;
            uniform mat4 mvp;
            uniform mat4 mv;
            uniform mat3 normalMatrix;
            uniform bool swap;
            varying vec2 vTexCoord;
            varying vec3 vNormal;
            varying vec3 vPos;
            void main()
            {
                vec3 p = pos;
                if (swap) p = vec3(p.x, p.z, p.y);
                gl_Position = mvp * vec4(p, 1.0);
                vTexCoord = texCoord;
                vPos = (mv * vec4(p,1.0)).xyz;
                vNormal = normalize(normalMatrix * (swap ? vec3(normal.x, normal.z, normal.y) : normal));
            }
        `;
    }

    fragmentShaderSource()
    {
        return `
            precision mediump float;
            uniform sampler2D tex;
            uniform bool showTex;
            uniform vec3 lightDir;
            uniform float shininess;
            varying vec2 vTexCoord;
            varying vec3 vNormal;
            varying vec3 vPos;
            void main()
            {
                vec3 N = normalize(vNormal);
                vec3 L = normalize(lightDir);
                vec3 V = normalize(-vPos);
                vec3 H = normalize(L + V);

                float diff = max(dot(N, L), 0.0);
                float spec = pow(max(dot(N, H), 0.0), shininess);

                vec3 Kd = showTex ? texture2D(tex, vTexCoord).rgb : vec3(1.0, 1.0, 1.0);
                vec3 Ks = vec3(1.0);

                vec3 color = Kd * diff + Ks * spec;
                gl_FragColor = vec4(color, 1.0);
            }
        `;
    }
}
