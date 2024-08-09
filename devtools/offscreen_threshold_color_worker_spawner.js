let numWorkers = navigator.hardwareConcurrency - 1;
let numWorkersFinished = 0;
let colorCount = {};
let outputSAB, outputUint;

chrome.runtime.onMessage.addListener(handleMessages);


function checkColorContrast(e) {

}

// This function performs basic filtering and error checking on messages before
// dispatching the
// message to a more specific message handler.
async function handleMessages(request, sender, sendResponse) {
    // Return early if this message isn't meant for the offscreen document.
    if (request.target !== 'offscreen') {
        return;
    }

    // Dispatch the message to an appropriate handler.
    switch (request.name) {
        case 'processImageThresholdOffscreen':
            // imgData = ImageData.data (UIntClampedArray)
            let img = document.createElement('img');
            img.onload = () => handleImageThreshold(img, request.color);
            img.src = request.imageDataUrl;
            break;
        default:
            console.warn(`Unexpected message type received: '${message.type}'.`);
            break;
    }
}

async function handleImageThreshold(img, color) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let imageData = ctx.getImageData(0, 0, img.width, img.height);

    numWorkers = navigator.hardwareConcurrency - 1;
    const workers = (function () {
        let arr = [];
        for (let i = 0; i < numWorkers; i++) {
            arr.push(new Worker('check_color_contrast_worker.js', { type: 'module' }));
        }
        return arr;
    })();
    outputSAB = new SharedArrayBuffer(imageData.data.byteLength);
    for(let i = 0; i < imageData.data.byteLength; i++) {
        outputSAB[i] = imageData.data[i];
    }
    outputUint = new Uint8Array(outputSAB);
    let numPixels = (imageData.data.byteLength / 4);
    let sliceSize = Math.floor(numPixels / numWorkers);
    let leftoverSlice = numPixels - (sliceSize * numWorkers);
    for(let i = 0; i < workers.length; i++) {
        let workersSliceSize = sliceSize;
        if (!(i + 1 < workers.length)) workersSliceSize += leftoverSlice;
        workers[i].postMessage({
            start: i * sliceSize,
            sliceSize: workersSliceSize,
            isCounting: true,
            color: color,
            outputSAB: outputUint
        });
        workers[i].onmessage = handleWorkerReturn;
    }
}

function handleWorkerReturn(e) {
    let data = e.data;
    numWorkersFinished += 1;
    for(const [rgb, count] of Object.entries(data.colorCount)) {
        if (colorCount.hasOwnProperty(rgb)) {
            colorCount[rgb] += count;
        }
        else {
            colorCount[rgb] = count;
        }
    }
    if (numWorkersFinished >= numWorkers) {
        chrome.runtime.sendMessage({
            target: 'threshold_panel',
            name: 'imageProcessed',
            colorCount: colorCount,
            outputSAB: outputSAB
        });
        numWorkersFinished = 0;
        colorCount = {};
    }
}

