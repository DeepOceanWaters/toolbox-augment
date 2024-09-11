chrome.runtime.onMessage.addListener(handleMessages);

main();

function main() {
    let screenCapture = document.getElementById('screen-capture');

    screenCapture.addEventListener('click', executeScreenCaptureTest);
}

async function executeScreenCaptureTest() {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    const imageDataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });
    /*
    const response = await chrome.tabs.sendMessage(tab.id, {
        target: 'content-script',
        name: 'screenCaptureTest',
        imageDataUrl: imageDataUrl
    });*/
    const responseThreshold = await chrome.runtime.sendMessage({
        target: 'background',
        name: 'processImageThreshold',
        color: [255, 255, 255],
        imageDataUrl: imageDataUrl
    });
}

async function handleMessages(request, sender, sendResponse) {
    if (request.target !== 'threshold_panel') return;
    switch (request.name) {
        case 'imageProcessed':
            await chrome.runtime.sendMessage({
                target: 'content-script',
                name: 'threshold',
                outputSAB: request.outputSAB
            });
            break;
        default:
            break;
    }
}


