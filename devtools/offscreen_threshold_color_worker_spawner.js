let numWorkers = navigator.hardwareConcurrency - 1;
let numWorkersFinished = 0;
let colorCount = {};
let outputSAB;

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
            handleImageThreshold(request.imgSize, request.color);
            break;
        default:
            console.warn(`Unexpected message type received: '${message.type}'.`);
            break;
    }
}

function handleImageThreshold(imgSize, color) {
    numWorkers = navigator.hardwareConcurrency - 1;
    const workers = (function () {
        let arr = [];
        for (let i = 0; i < numWorkers; i++) {
            arr.push(new Worker('check_color_contrast_worker.js', { type: 'module' }));
        }
        return arr;
    })();
    outputSAB = new SharedArrayBuffer(imgSize);
    for(let i = 0; i < workers.length; i++) {
        workers[i].postMessage({
            totalNumSlices: numWorkers,
            slice: i,
            isCounting: true,
            color: color,
            outputSAB: outputSAB
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

