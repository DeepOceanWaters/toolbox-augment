(async () => {
    main();

    async function main() {
        
        // const response = await chrome.runtime.sendMessage({ greeting: "hello" });
        // // do something with response here, not outside the function
        // console.log(response);
        console.log('hello');
        chrome.runtime.onMessage.addListener(messageRouter);
    }

    async function messageRouter(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        // stuff
        switch (request.name) {
            case 'pageSearch':
                console.log('request: pageSearch');
                const psSrc = chrome.runtime.getURL('modules/pageSearch.js');
                const pageSearch = await import(psSrc);
                pageSearch.main();
                break;
            case 'exposeAltText':
                console.log('request: exposeAltText');
                const eatSrc = chrome.runtime.getURL('modules/exposeAltText.js');
                const exposeAltText = await import(eatSrc);
                exposeAltText.main();
                break;
            case 'getElementStyle':
                console.log('request: getElementStyle');
                const gesSrc = chrome.runtime.getURL('modules/getElementStyle.js');
                const getElementStyle = await import(gesSrc);
                let element = document.querySelector('[data-get-element-style]');
                let style = getElementStyle.main(element);
                delete element.dataset.getElementStyle;
                sendResponse(style);
                break;
            default:
                console.log(`unknown request: ${request.name}`);
                break;
        }
        return;
    }

    function stuff() {
        // does stuff
    }

    // copy and paste this into the chrome dev tools while on
    // the audit's table of issues. After pasting hit enter and
    // the csv content will be output in text, you should be
    // able to copy that text output. There should be a button in
    // the devtools called "copy" that shows after the text length,
    // of the text output to the console.
    // I recommend copying the text, then create a 
    // csv or txt file and paste into that file,
    // then import the file into google sheets (file -> import,
    // choose the 'upload' tab in the top right of the dialog)
    // I had no trouble uploading a plain txt file
    // I tried with my own audit, and all the information seems to be there
    // 
    function getAuditData() {
        let audit = {
            id: -1,
            columnHeaders: [],
            rows: {}
        };
        audit.columnHeaders = getColumnHeaders();
        audit.rows = getAllRowValues();

        return audit;
    }

    function getColumnHeaders() {
        let table = document.querySelector('table.issues-table');
        let tbody = table.querySelector('tbody');

        let rows = tbody.querySelectorAll('tr');
        let row = rows[0];
        let columnHeaders = getRowInfo(row, (cell) => cell.dataset.key);
        return columnHeaders;
    }

    function getAllRowValues() {
        let table = document.querySelector('table.issues-table');
        let tbody = table.querySelector('tbody');

        let rows = tbody.querySelectorAll('tr');
        let rowsOfValues = {};
        for (const row of rows) {
            let rowValues = getRowValues(row);
            rowsOfValues[rowValues.id] = rowValues;
        }
        return rowsOfValues;
    }

    function getRowValues(row) {
        return getRowInfo(row, (cell) => cell.children.item(0).children.item(0).innerHTML);
    }

    function getRowInfo(row, callback) {
        let outputRow = {};
        for (let i = 0; i < row.children.length; i++) {
            let cell = row.children.item(i);
            let value = callback(cell);
            outputRow[cell.dataset.key] = htmlUnescape(value);
        }
        return outputRow;
    }

    function htmlUnescape(text) {
        let htmlConversion = [
            ['&', '&amp;'],
            ['<', '&lt;'],
            ['>', '&gt;']
        ];
        for (let converter of htmlConversion) {
            text = text.replaceAll(converter[1], converter[0]);
        }
        return text;
    }
})();