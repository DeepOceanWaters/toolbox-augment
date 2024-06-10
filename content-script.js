(() => {
    main();

    function main() {
        // const response = await chrome.runtime.sendMessage({ greeting: "hello" });
        // // do something with response here, not outside the function
        // console.log(response);
        console.log('hello');
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
                if (request.greeting === "hello") {
                    let auditData = getAuditData();
                    console.log(auditData);
                    sendResponse(auditData);
                }
            }
        );

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
            rows: []
        };
        /* 
            {
                id: number,
                columnHeaders: Array<string>,
                rows: Array<Array<string>>
            }
        */
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
        let rowsOfValues = [];
        for(const row of rows) {
            rowsOfValues.push(getRowValues(row));
        }
        return rowsOfValues;
    }

    function getRowValues(row) {
        return getRowInfo(row, (cell) => cell.children.item(0).children.item(0).innerHTML);
    }

    function getRowInfo(row, callback) {
        let outputRow = new Array(row.children.length);
        for (let i = 0; i < row.children.length; i++) {
            let cell = row.children.item(i);
            let value = callback(cell);
            outputRow[i] = htmlUnescape(value);// name
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