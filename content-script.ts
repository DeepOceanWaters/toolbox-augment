main();
async function main(): Promise<void> {
    const { default: contentScript } = await import(
        chrome.runtime.getURL("./content-script-main.js")
    );
    contentScript();
}

