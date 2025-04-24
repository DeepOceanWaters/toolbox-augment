export default function wait(time) {
    return new Promise((resolve) => setTimeout(() => resolve(true), time));
}

/**
 * When callback returns true or times out, stop waiting and continue
 */
export async function waitUntil(callback, time = 1) {
    let count = 0;
    let output;
    do {
        output = callback();
        await wait(time);
    } while (!output && count++ < 50);
    return output;
}