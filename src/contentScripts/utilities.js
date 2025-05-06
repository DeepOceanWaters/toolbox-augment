chrome.runtime.onMessage.addListener(messageRouter);

async function messageRouter(request, sender, sendResponse) {
    switch (request.name) {
        case 'exposeAltText':
            console.log('request: exposeAltText');
            const eatSrc = chrome.runtime.getURL('modules/exposeAltText.js');
            const exposeAltText = await import(eatSrc);
            exposeAltText.main();
            break;
        case 'getElementStyle':
            /*
            console.log('request: getElementStyle');
            const gesSrc = chrome.runtime.getURL('modules/getElementStyle.js');
            const getElementStyle = await import(gesSrc);
            let element = document.querySelector('[data-get-element-style]') as HTMLElement;
            let style = getElementStyle.main(element);
            delete element!.dataset.getElementStyle;
            sendResponse(style);*/
            break;
        case 'showHeadings':
            console.log('request: showHeadings');
            const shSrc = chrome.runtime.getURL('modules/showHeadings.js');
            const showHeadings = await import(shSrc);
            showHeadings.main();
            break;
        case 'copyToClipboard':
            console.log('request: copyToClipboard');
            copyTextToClipboard(request.text);
            break;
        case 'screenCaptureTest':
            console.log('request: screenCaptureTest');
            let img = document.getElementById('page-img');
            if (img) {
                img.remove();
                document.documentElement.style.overflow = '';
            }
            else {
                img = document.createElement('img');
                img.id = 'page-img';
                img.setAttribute('src', request.imageDataUrl);
                document.documentElement.appendChild(img);
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.width = img.style.height = '100%';
                img.style.zIndex = '10000';
                document.documentElement.style.overflow = 'hidden';
            }
            sendResponse({ imgSize: img.width * img.height * 4 });
            break;
        default:
            console.log(`unknown request: ${request.name}`);
            break;
    }
    return;
}

function copyTextToClipboard(text) {
    let fakeInput = document.createElement('textarea');
    fakeInput.value = text;
    document.documentElement.appendChild(fakeInput);
    fakeInput.select();
    document.execCommand('copy');
    fakeInput.remove();
}