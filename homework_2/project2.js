// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform(positionX, positionY, rotation, scale) {
    let rad = rotation * Math.PI / 180;
    let cosR = Math.cos(rad);
    let sinR = Math.sin(rad);

    // Scale matrix
    const ScaleMatrix = [
        scale, 0,     0,
        0,     scale, 0,
        0,     0,     1
    ];

    // Rotation matrix
    const RotateMatrix= [
        cosR,  sinR,  0,
       -sinR,  cosR,  0,
        0,     0,     1
    ];

    // Translation matrix
    const TranslationMatrix = [
        1, 0, 0,
        0, 1, 0,
        positionX, positionY, 1
    ];

    // First I scale, then rotate and then Transform
    const RotateScale = ApplyTransform(ScaleMatrix, RotateMatrix);   
    const TranslateRotateScale = ApplyTransform(RotateScale, TranslationMatrix); 

    return TranslateRotateScale;
}


// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform(matrix1, matrix2) {
    let result = new Array(9);
    // Loop through each row and column
    for (let row = 0; row < 3; ++row) {
        for (let col = 0; col < 3; ++col) {
            result[col * 3 + row] =
			    // Multiply and sum corresponding elements
                matrix2[0 * 3 + row] * matrix1[col * 3 + 0] +
                matrix2[1 * 3 + row] * matrix1[col * 3 + 1] +
                matrix2[2 * 3 + row] * matrix1[col * 3 + 2];
        }
    }

    return result;
}

