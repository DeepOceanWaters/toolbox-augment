(async () => {
    let issueCustomeStyle;
    main();

    async function main() {
        chrome.runtime.onMessage.addListener(messageRouter);
        issueCustomeStyle = injectStyles(chrome.runtime.getURL('css/addIssueCustomStyle.css'));
    }

    async function messageRouter(request, sender, sendResponse) {
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
            case 'scrollTo':
                console.log('request: getSelectedRow');
                const stSrc = chrome.runtime.getURL('modules/scrollTo.js');
                const scrollTo = await import(stSrc);
                scrollTo.scrollTo(request.index, request.id);
                break;
            case 'getSelectedRow':
                console.log('request: getSelectedRow');
                const gsrSrc = chrome.runtime.getURL('modules/scrollTo.js');
                const getSelectedRow = await import(gsrSrc);
                getSelectedRow.getSelectedRow();
                break;
            case 'toggleIssueDialogStylesheet':
                console.log('request: toggleIssueDialogStylesheet');
                issueCustomeStyle.disabled = !issueCustomeStyle.disabled;
                break;
            case 'replaceTokens':
                console.log('request: replaceTokens');
                const rtSrc = chrome.runtime.getURL('modules/replaceTokens.js');
                const replaceTokens = await import(rtSrc);
                replaceTokens.main();
                break;
            default:
                console.log(`unknown request: ${request.name}`);
                break;
        }
        return;
    }

    function injectStyles(url) {
        let element = document.createElement('link');
        element.rel = 'stylesheet';
        element.setAttribute('href', url);
        document.head.appendChild(element);
        return element;
    }

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


})();