import { ratioAcceptable } from "../modules/colorful.js";

/**
 * msg.data = {
 *      image: HTMLImageElement,
 *      outputSAB: SharedArrayBuffer,
 *      msg.color: [red, green, blue],
 *      msg.slice: Number,
 *      msg.isCounting: Boolean
 * }
 */
onmessage = function(msg) {
    let colorCount = {};
    let obj = msg.data;
    let colorToCheckAgainst = obj.color;
    let start = obj.start;
    let sliceSize = obj.sliceSize;
    let outputSAB = obj.outputSAB

    let end = start + sliceSize;
    // slice, image, length

    for(let i = start; i < end; i++) {
        let index = 4 * i;
        let rgb = [
            Atomics.load(outputSAB, index),
            Atomics.load(outputSAB, index + 1),
            Atomics.load(outputSAB, index + 2)
        ]
        if (msg.isCounting) {
            if (typeof colorCount[rgb] !== 'number') colorCount[rgb] = 1;
            else colorCount[rgb] += 1;
        }
        let isAcceptable = !ratioAcceptable(rgb, colorToCheckAgainst, obj.limit)
        let outputColor = [0, 0, 0, 0];
        if (isAcceptable) {
            outputColor = msg.isRetainingColor ? [...rgb, 255] : [255, 255, 255, 255];
        }
        outputColor.forEach((color, subIndex) => Atomics.store(outputSAB, index + subIndex, color));
    }

    postMessage({ slice: obj.slice, colorCount: colorCount });
}