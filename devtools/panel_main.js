(async () => {
    main();

    function main() {
        let pageSearch = document.getElementById('page-search');
        let exposeAltText = document.getElementById('expose-alt-text');
        let elementStyle = document.getElementById('get-element-style');

        pageSearch.addEventListener('click', executePageSearch);
        exposeAltText.addEventListener('click', executeExposeAltText);
        elementStyle.addEventListener('click', executeGetElementStyle);
    }

    async function executePageSearch() {
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'pageSearch'
        });
    }

    async function executeExposeAltText() {
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'exposeAltText'
        });
    }

    async function executeGetElementStyle() {
        console.log('request: getElementStyle');
        let result = await chrome.devtools.inspectedWindow.eval('$0.dataset.getElementStyle = "true"');
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'getElementStyle'
        });
    }
})();