import ZoomCanvas from "../modules/ZoomCanvas.js";
import ShortcutManager from "../modules/ShortcutManager.js";
import {
    ratio,
    hex2rgb,
    rgb2hex,
    hsl2rgb,
    rgb2hsl,
} from "../modules/colorful.js";
import makeButton from "../modules/components/button.js";
import BlankPair from "../modules/components/BlankPair.js";
import Disclosure from "../modules/components/Disclosure.js";
import CustomButton from "../modules/components/CustomButton.js";

main();

function main() {
    const fileIn = document.getElementById('input');
    const colorHtml = document.getElementById('color');
    const ratioIn = document.getElementById('ratio');
    
    
    const sideSettings = document.getElementById('settings-side');
    const inputCanv = document.getElementById('input-canvas');
    const inputZoomCanv = document.getElementById('input-zoom');
    const canvas = document.getElementById('output');
    const imgUnprocessed = document.getElementById('unprocessed');
    const imgOut = document.getElementById('imgOut');
    const keepColor = document.getElementById('keep-color');
    let curColorTable = document.getElementById('colors-table');
    
    let maxColorRows = 15;
    
    const threeCanvas = document.getElementById('three-ratio-canvas');
    const fourPointFiveCanvas = document.getElementById('four-point-five-ratio-canvas');

    // make settings
    let color = new BlankPair('Color', { description: 'Accepts hex only (#000fff)' });
    color.input.addEventListener('change', () => setColorDescription(color));

    let process = new CustomButton('Process Image');
    process.button.addEventListener('click', () => submitProcess(color));

    // color table

    // output
    let [unprocessed, unprocessedCanvas] = makeCanvasDislcosure('Unprocessed');
    let [threeToOne, threeToOneCanvas] = makeCanvasDislcosure('Processed (3:1)');
    let [fourPointFiveToOne, fourPointFiveToOneCanvas] = makeCanvasDislcosure('Processed (4.5:1)');

    // add functionality

}

function makeCanvasDislcosure(label: string) {
    let disclosure = new Disclosure(label);
    let canvas = document.createElement('canvas');
    disclosure.controlled.appendChild(canvas);
    return [disclosure, canvas];
}

function setColorDescription(color: BlankPair) {
    let colorDesc = document.getElementById('color-desc');
    colorDesc.style.backgroundColor = color.input.value;
    let colorRatio = ratio(hex2rgb(color.input.value), [0, 0, 0]);
    colorDesc.style.color = colorRatio < 4.5 ? 'white' : 'black';
}

function submitProcess(color: BlankPair) {
    let processStatus = document.getElementById('process-status');
    processStatus.textContent = 'processing image';
    // get user image
    let userColor = hex2rgb(color.input.value);
    canvas.parentElement.hidden = true;
    let colorCount = processImage(canvas, userColor, Number(ratioIn.value), true);
    processImage(threeCanvas, userColor, 3);
    processImage(fourPointFiveCanvas, userColor, 4.5);

    // replace old list
    let colorTable = createColorTable(colorCount);
    curColorTable.parentElement.replaceChild(colorTable, curColorTable);
    curColorTable = colorTable;

    setTimeout(() => {
        processStatus.textContent = 'Completed processing image';
    }, 200);
    // process image
}











/**
 * TODO:
 *  - Let users copy the ratio text from the data table
 *  - let users get a percentage of how much the text color vs background color has a good color contrast ratio
 *  - port to electron
 *  - save images/comparison
 */



let canvases = [
    canvas,
    threeCanvas,
    fourPointFiveCanvas
];

let canvasltt = new ZoomCanvas();

const submitBtn = document.getElementById('submit');

submitBtn.addEventListener('click', (e) => {
    let processStatus = document.getElementById('process-status');
    processStatus.textContent = 'processing image';
    // get user image
    let userColor = hex2rgb(colorHtml.value);
    canvas.parentElement.hidden = true;
    let colorCount = processImage(canvas, userColor, Number(ratioIn.value), true);
    processImage(threeCanvas, userColor, 3);
    processImage(fourPointFiveCanvas, userColor, 4.5);

    // replace old list
    let colorTable = createColorTable(colorCount);
    curColorTable.parentElement.replaceChild(colorTable, curColorTable);
    curColorTable = colorTable;

    setTimeout(() => {
        processStatus.textContent = 'Completed processing image';
    }, 200);
    // process image
});

imgUnprocessed.onload = () => imgLoaded(imgUnprocessed);

function imgLoaded(img) {
    inputCanv.width = img.width;
    inputCanv.height = img.height;
    for (const canvas of canvases) {
        canvas.width = img.width;
        canvas.height = img.height;
    }

    let ctx = inputCanv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
}

fileIn.addEventListener('change', (e) => {
    const file = e.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
        imgUnprocessed.setAttribute('src', fileReader.result);
    }
});

colorHtml.addEventListener('input', (e) => {
    let colorDesc = document.getElementById('color-desc');
    colorDesc.style.backgroundColor = colorHtml.value;
    colorDesc.style.color = ratio(hex2rgb(colorHtml.value), [0, 0, 0]) < 4.5 ? 'white' : 'black';
});

/* mostly taken from stack overflow */
document.addEventListener('paste', (e) => {
    let items = (e.clipboardData || e.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items));
    for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.onload = function (event) {
                imgUnprocessed.setAttribute('src', event.target.result);
            };
            reader.readAsDataURL(blob);
        }
    }
});

/**
 * 
 * @param {HTMLCanvasElement} outputCanvas the canvas that will display the processed image
 * @param {Array<Number>} color [r, g, b] the color that the threshold ratio is being calculated against
 * @param {Number} thresholdRatio The color contrast ratio threshold
 * @param {Boolean} shouldCount if set to true, each pixel's color will be counted and added to an object
 * @returns null, unless shouldCount is true, then returns an object of colors and their counts
 */
function processImage(outputCanvas, color, thresholdRatio, shouldCount = false) {
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
    for (let i = 0; i < outputCanvas.width; i++) {
        for (let j = 0; j < outputCanvas.height; j++) {
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

function sameColor(color1, color2) {
    let isSame = true;
    for (const [index, val] of color1.entries()) {
        if (val !== color2[index]) {
            isSame = false;
            break;
        }
    }
    return isSame;
}

function createColumnHeader(text) {
    let columnheader = document.createElement('th');
    columnheader.scope = 'col';
    columnheader.textContent = text;
    return columnheader;
}

function createColorTable(colors) {
    let table = document.createElement('table');
    table.id = 'colors-table';
    // make colgroup
    let colgroup = document.createElement('colgroup');
    let colorCol = document.createElement('col');
    colorCol.classList.add('color-box-column');

    let hexCol = document.createElement('col');
    hexCol.classList.add('hex-code-column');

    let countCol = document.createElement('col');
    countCol.classList.add('count-column');

    let ratioCol = document.createElement('col');
    ratioCol.classList.add('ratio-col');

    colgroup.append(colorCol, hexCol, countCol, ratioCol);
    table.appendChild(colgroup);
    // make thead
    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    let colorHeader = createColumnHeader('color box');
    let hexHeader = createColumnHeader('hex code');
    let countHeader = createColumnHeader('count');
    let ratioHeader = createColumnHeader('ratio vs ' + colorHtml.textContent);
    headerRow.append(colorHeader, hexHeader, countHeader, ratioHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // make tbody
    let tbody = document.createElement('tbody');
    let largestFirstSortedEntries = Object.entries(colors).sort((a, b) => b[1] - a[1]);
    for (const [colorString, count] of largestFirstSortedEntries.slice(0, 16)) {
        let color = colorString.split(',').map(a => Number(a));
        // remove the opacity part of color so we only have rgb
        color.pop();
        tbody.appendChild(createColorRow(color, count));
    }
    table.appendChild(tbody);
    return table;
}
/**
 * 
 * @param {String} color hex format #XXXXXX
 * @param {Number} count total number of pixels in the image that is this color
 * @returns HTMLElementTableRow the TR element for the TABLE.
 */
function createColorRow(color, count) {
    let row = document.createElement('tr');
    let colorBox = document.createElement('span');
    let colorText = document.createElement('span');
    let countText = document.createElement('span');
    let ratioText = document.createElement('span');

    let colorBoxCell = document.createElement('td');
    let colorTextCell = document.createElement('td');

    let countTextCell = document.createElement('td');
    let ratioTextCell = document.createElement('td');

    colorBoxCell.classList.add('color-cell');
    colorTextCell.classList.add('hex-cell');
    countTextCell.classList.add('count-cell');
    ratioTextCell.classList.add('ratio-cell');

    row.append(colorBoxCell, colorTextCell, countTextCell, ratioTextCell);
    colorBoxCell.appendChild(colorBox);
    colorTextCell.appendChild(colorText);
    countTextCell.appendChild(countText);
    ratioTextCell.appendChild(ratioText);

    let hexText = rgb2hex(color);

    let colorTextCopyBtn = makeButton('Copy', 'secondary', { extraClasses: ['copy-btn', 'small'] })
    colorTextCell.appendChild(colorTextCopyBtn);
    colorTextCopyBtn.addEventListener('click', () => copyHexText(hexText));

    
    ratioText.textContent = colorText.textContent = colorTextCopyBtn.dataset.hexCode = hexText;

    countText.textContent = count;
    let ratiothe = ratio(color, hex2rgb(colorHtml.value));
    ratioText.textContent = ratiothe.toFixed(2) + ":1";
    let blackratio = ratio([0, 0, 0], color);
    let whiteratio = ratio([255, 255, 255], color);
    colorBoxCell.classList.add(blackratio > whiteratio ? 'black' : 'white');

    colorBox.classList.add('color-box');
    colorBox.style.backgroundColor = hexText;

    row.classList.add('color-item');
    console.log(color, colorHtml.value);
    if (hexText === colorHtml.value) row.classList.add('same-color');
    return row;
}

async function copyHexText(color) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { name: "copyToClipboard", text: color });
}

function arrSame(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((v, i) => arr2[i] === v);
}

canvasltt.zoomPixel(inputCanv, inputZoomCanv);
inputCanv.addEventListener('mousemove', (e) => {
    inputZoomCanv.style.top = `calc(${canvasltt.pos.y}px - ${inputZoomCanv.style.height} / 2)`;
    inputZoomCanv.style.left = `calc(${canvasltt.pos.x}px - ${inputZoomCanv.style.width} / 2)`;
    //inputZoomCanv.style.top = `${canvasltt.pos.y - (inputZoomCanv.height / 2)}px`;
    //inputZoomCanv.style.left = `${canvasltt.pos.x - (inputZoomCanv.width / 2)}px`;
});

inputCanv.addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let ctx = inputCanv.getContext('2d');
    let rgb = getColor(inputCanv, [x, y]);
    colorHtml.value = rgb2hex(rgb);
    colorHtml.dispatchEvent(new Event('input'));
});

document.addEventListener('keydown', moveZoom);

let movingZoom = true;
function moveZoom(e) {
    if (!movingZoom) return;
    let step = e.getModifierState('Shift') ? 7 : 1;
    switch (e.key) {
        case "ArrowDown":
            canvasltt.moveDown(step);
            e.preventDefault();
            break;
        case "ArrowUp":
            canvasltt.moveUp(step);
            e.preventDefault();
            break;
        case "ArrowLeft":
            canvasltt.moveLeft(step);
            e.preventDefault();
            break;
        case "ArrowRight":
            canvasltt.moveRight(step);
            e.preventDefault();
            break;
        case "Enter":
        case " ":
            colorHtml.value = rgb2hex(canvasltt.getCurrentColor());
            colorHtml.dispatchEvent(new Event('input'));
            e.preventDefault();
            break;
        default:
            break;
    }
    inputZoomCanv.style.top = `calc(${canvasltt.pos.y}px - ${inputZoomCanv.style.height} / 2)`;
    inputZoomCanv.style.left = `calc(${canvasltt.pos.x}px - ${inputZoomCanv.style.width} / 2)`;
}


function getColor(canvas, pos) {
    let ctx = canvas.getContext('2d');
    let image = ctx.getImageData(pos[0], pos[1], 1, 1);
    return [image.data[0], image.data[1], image.data[2]];
}


let manager = new ShortcutManager();

const toggleZoomSC = manager.add(
    ['shift', 'd'],
    toggleZoom,
    {
        name: 'Toggle Zoom on Unprocessed Image',
        description: "Hides the zoom, and prevents keyboard interaction.",
        throttle: 400
    }
);

const toggleZoomControlSC = manager.add(
    ['shift', 'c'],
    toggleZoomControl,
    {
        name: 'Toggle Controlling Zoom With Keyboard',
        description: "Stops controlling zoom with keyboard. This will prevent keyboard arrows from moving the zoom, and Enter/Space from selecting the current pixel's color.",
        throttle: 400
    }
);
/*
const exitZoomControlSC = manager.add(
    ['escape'],
    toggleZoomControl,
    { 
        name: 'Exit Controlling Zoom With Keyboard', 
        description: "",
        throttle: 400 
    }
);
*/
function toggleZoom() {
    let hidden = !inputZoomCanv.hidden;
    inputZoomCanv.hidden = hidden;
    inputCanv.style.cursor = !hidden ? 'none' : 'auto';
    movingZoom = !hidden;
    canvasltt.setAnimation(!hidden, 'complex');
}

function toggleZoomControl() {
    movingZoom = !movingZoom;
}