chrome.runtime.onMessage.addListener(handleMessages);

function handleMessages(request, sender, sendResponse) {
    switch (request.name) {
        case 'processImageThreshold':
            processImageThreshold(request.imageDataUrl, request.color);
            break;
        default:
            break;
    }
}

async function processImageThreshold(imageDataUrl, color) {
    const offscreenUrl = 'devtools/offscreen_threshold_color_worker_spawner.html';

    if (!await hasDocument(offscreenUrl)) {
        await chrome.offscreen.createDocument({
            url: offscreenUrl,
            reasons: [chrome.offscreen.Reason.WORKERS],
            justification: 'Parallel processing color contrast.'
        });
    }

    // Now that we have an offscreen document, we can dispatch the
    // message.
    chrome.runtime.sendMessage({
        target: 'offscreen',
        name: 'processImageThresholdOffscreen',
        imageDataUrl: imageDataUrl,
        color: color
    });
}

// taken from https://github.com/GoogleChrome/chrome-extensions-samples/blob/50fe8517954371c19d0c042c616887d24c17e167/functional-samples/cookbook.offscreen-dom/background.js#L74-L82
async function hasDocument(url) {
    // Check all windows controlled by the service worker if one of them is the offscreen document
    const matchedClients = await clients.matchAll();
    for (const client of matchedClients) {
      if (client.url.endsWith(url)) {
        return true;
      }
    }
    return false;
  }