export default function wait(time) {
    return new Promise((resolve) => setTimeout(() => resolve(true), time));
}

export function waitUntil(callback, time = 1) {
    let count = 0;
    let output = callback();
    do {
        output = callback();
    } while (!output && count++ < 50);
    return output;
}