/**
 * 
 * @param {HTMLCanvasElement} outputCanvas the canvas that will display the processed image
 * @param {Array<Number>} color [r, g, b] the color that the threshold ratio is being calculated against
 * @param {Number} thresholdRatio The color contrast ratio threshold
 * @param {Boolean} shouldCount if set to true, each pixel's color will be counted and added to an object
 * @returns null, unless shouldCount is true, then returns an object of colors and their counts
 */
export default function processColorContrast(outputCanvas, color, thresholdRatio, shouldCount = false) {
    let colors = {
        // [r, g, b]: count
    };
    // assumes canvas is prepped
    let ctx = outputCanvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(imgUnprocessed, 0, 0);
    let image = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    let newImage = ctx.createImageData(outputCanvas.width, outputCanvas.height);
    let newData = newImage.data;
    const shouldRetainColor = !keepColor.checked;

    let data = image.data;
    for(let i = 0; i < outputCanvas.width; i++) {
        for(let j = 0; j < outputCanvas.height; j++) {
            let index = 4 * (j * outputCanvas.width + i);
            // unacceptable ratio will be black
            let colorOut = [0, 0, 0, 255];
            // color of the current pixel
            let colorIn = [
                data[index],
                data[index + 1],
                data[index + 2],
                data[index + 3]
            ];

            // count number of times we've come across a color
            if (shouldCount) {
                if (colors.hasOwnProperty(colorIn)) {
                    colors[colorIn]++;
                }
                else {
                    colors[colorIn] = 1;
                }
            }
            // if ratio is acceptable, set color to white
            if (shouldRetainColor) {
                if (sameColor(color, colorIn)) {
                    colorOut = colorIn;
                }
                else if (ratio(color, colorIn) >= thresholdRatio) {
                    colorOut = colorIn;
                }
                else {
                    colorOut = [0, 0, 0, 255];
                }
            }
            else {
                if (ratio(color, colorIn) >= thresholdRatio) {
                    colorOut = [255, 255, 255, 255];
                }
                else {
                    colorOut = [0, 0, 0, 255];
                }
            }
            newData[index] = colorOut[0];
            newData[index + 1] = colorOut[1];
            newData[index + 2] = colorOut[2];
            newData[index + 3] = colorOut[3];
        }
    }
    ctx.putImageData(newImage, 0, 0);
    return shouldCount ? colors : null;
}