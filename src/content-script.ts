main();
// this wrapper ensures that we don't need to dynamically import content in the main
// funciton and can use typical module import statements.
async function main(): Promise<void> {
    const { default: contentScript } = await import(
        chrome.runtime.getURL("./out/content-script-main.js")
    );
    contentScript();
}

