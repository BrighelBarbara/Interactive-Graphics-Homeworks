// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.

// constant for the invers of 255 (just for faster computation)
// it is used to convert the alpha value from a range [0,255] to a range [0,1]
const SCALE = 1 / 255; 

function composite(bgImg, fgImg, fgOpac, fgPos) {

    // Get the pixel data of the images
    let bgData = bgImg.data;
    let fgData = fgImg.data;

    // Get the width and height of both the images
    let bgWidth = bgImg.width;
    let bgHeight = bgImg.height;
    let fgWidth = fgImg.width;
    let fgHeight = fgImg.height;
    
    // iterate over the pixels of the foreground image, treating it as a one-dimensional array
    let totalPixels = fgWidth * fgHeight;
        for (let i = 0; i < totalPixels; i++) {
            // I extract the x and y position 
            let x = i % fgWidth; // column
            let y = Math.floor(i / fgWidth); // row

            //first pixel starts at index = 0, second pixel starts at index = 4, third pixel starts at index = 8, and so on... (because of RGBA)
            let fgIndex = i * 4; 

            // I calculate the absoluto position of the foreground image on the background image
            let fgX = x + fgPos.x;
            let fgY = y + fgPos.y;

            // I ignore pixels outside the background image borders as suggested in the assignment
            if (fgX < 0 || fgX >= bgWidth || fgY < 0 || fgY >= bgHeight) {
                continue;
            }

            // the image is stored in the array bgData, so we need to convert (fgX, fgY) to an index
            let bgIndex = (fgY * bgWidth + fgX) * 4;

            // I extract the RGBA values of the foreground and background images
            let fgR = fgData[fgIndex];
            let fgG = fgData[fgIndex + 1];
            let fgB = fgData[fgIndex + 2];
            let fgA = (fgData[fgIndex + 3] * SCALE) * fgOpac; // Scale alpha with fgOpac

            let bgR = bgData[bgIndex];
            let bgG = bgData[bgIndex + 1];
            let bgB = bgData[bgIndex + 2];
            let bgA = bgData[bgIndex + 3] * SCALE;
            
            // if fgA = 1 ==> outA = fgA = 1 and the bgImage is ignored
            // if fgA = 0 ==> outA = bgA and the fgImage is ignored
            let outA = fgA + bgA * (1 - fgA);

            // intermediate values
            if (outA > 0 && outA <= 1) {

                //apply the alpha blending formula to compute the output RGBA values
                bgData[bgIndex] = (fgR * fgA + bgR * bgA * (1 - fgA)) / outA;
                bgData[bgIndex + 1] = (fgG * fgA + bgG * bgA * (1 - fgA)) / outA;
                bgData[bgIndex + 2] = (fgB * fgA + bgB * bgA * (1 - fgA)) / outA;
                bgData[bgIndex + 3] = outA / SCALE;
            }
        }
}
