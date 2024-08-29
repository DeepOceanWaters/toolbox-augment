(async () => {
    let issueCustomStyle;
    let issueToCopy;
    let recommendationToCopy;

    main();

    async function main() {
        chrome.runtime.onMessage.addListener(messageRouter);
        initCopyEventListeners();
        issueCustomStyle = injectStyles(chrome.runtime.getURL('css/addIssueCustomStyle.css'));
        comboboxStyle = injectStyles(chrome.runtime.getURL('css/combobox.css'));
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
                issueCustomStyle.disabled = !issueCustomStyle.disabled;
                break;
            case 'replaceTokens':
                console.log('request: replaceTokens');
                const rtSrc = chrome.runtime.getURL('modules/replaceTokens.js');
                const replaceTokens = await import(rtSrc);
                replaceTokens.main();
                break;
            case 'showHeadings':
                console.log('request: showHeadings');
                const shSrc = chrome.runtime.getURL('modules/showHeadings.js');
                const showHeadings = await import(shSrc);
                showHeadings.main();
                break;
            case 'copyToClipboard':
                console.log('request: copyToClipboard');
                copyTextToClipboard(request.text);
                break;
            case 'setTemplateDataToCopy':
                console.log('request: setTemplateDataToCopy');
                issueToCopy = request.issue;
                recommendationToCopy = request.recommendation;
                let pageSelect = document.getElementById('pages');
                let successCriterionSelect = document.getElementById('success_criteria');
                scrollSelectOptionIntoView(pageSelect, request.pageURL);
                if (request.relatedsc) {
                    let sc = request.relatedsc[0];
                    scrollSelectOptionIntoView(successCriterionSelect, sc);
                }
                let resetDescription = ((select) => {
                    let form = select.closest('form');
                    let buttons = form.querySelectorAll('button');
                    return [...buttons].find(b => b.textContent.includes("Reset Descriptions"));
                })(pageSelect);
                // if no success criteria already selected, reset the description
                // this helps when you select the same SC for two issues  in a row - when doing this
                // TOOLBOX will not properly fill the SC description textarea
                if (!successCriterionSelect.querySelectorAll(':checked').length) resetDescription.click();
                // set 
                break;
            case 'screenCaptureTest':
                console.log('request: screenCaptureTest');
                let img = document.getElementById('page-img');
                if (img) {
                    img.remove();
                    document.documentElement.style.overflow = '';
                }
                else {
                    img = document.createElement('img');
                    img.id = 'page-img';
                    img.setAttribute('src', request.imageDataUrl);
                    document.documentElement.appendChild(img);
                    img.style.position = 'absolute';
                    img.style.top = '0';
                    img.style.left = '0';
                    img.style.width = img.style.height = '100%';
                    img.style.zIndex = '10000';
                    document.documentElement.style.overflow = 'hidden';
                }
                sendResponse({ imgSize: img.width * img.height * 4 });
                break;
            case 'threshold':
                console.log('request: screenCaptureTest');
                let img2 = document.getElementById('page-img');
                if (img2) {
                    img2.remove();
                    document.documentElement.style.overflow = '';
                }
                else {
                    img2 = document.createElement('img');
                    img2.id = 'page-img';
                    img2.setAttribute('src', request.imageDataUrl);
                    document.documentElement.appendChild(img);
                    img2.style.position = 'absolute';
                    img2.style.top = '0';
                    img2.style.left = '0';
                    img2.style.width = img.style.height = '100%';
                    img2.style.zIndex = '10000';
                    document.documentElement.style.overflow = 'hidden';
                }
                break;
            case "colorContrast":
                break;
            default:
                console.log(`unknown request: ${request.name}`);
                break;
        }
        return;
    }

    /**
     * 
     * @param {HTMLSelectElement} select 
     * @param {String} text 
     */
    function scrollSelectOptionIntoView(select, text, timeout = 5000) {
        if (!text) return;
        let options = [...select.querySelectorAll('option')];
        let targetOption = options.find((o) => o.textContent.includes(text));
        targetOption.scrollIntoView({ block: 'nearest' });
        targetOption.style.fontWeight = '800';
        setTimeout(() => targetOption.style.fontWeight = '', 5000);
    }

    async function initCopyEventListeners() {
        let issueDescriptionLabel = document.querySelector('[for="issue_description"]');
        if (!issueDescriptionLabel) {
            setTimeout(initCopyEventListeners, 20);
            return;
        }
        let issueDescription = issueDescriptionLabel.parentElement.querySelector('textarea');
        let recommendation = document.getElementById('issue_recommendations');
        issueDescription.addEventListener('click', (e) => {
            if (!issueToCopy) return;
            navigator.clipboard.writeText(issueToCopy);
            issueToCopy = undefined;
        });
        recommendation.addEventListener('click', (e) => {
            if (!recommendationToCopy) return;
            navigator.clipboard.writeText(recommendationToCopy);
            recommendationToCopy = undefined;
        });
        // new
        let pages = document.getElementById('pages');
        let pagesFilterWrapper = pages.parentElement.children[0].cloneNode();
        const src = chrome.runtime.getURL("modules/combobox.js");
        const { default: Combobox } = await import(src);
        let pagesCombobox = new Combobox('Search Pages', '', [...pages.options].map(op => op.textContent));
        pagesFilterWrapper.append(
            pagesCombobox.getComboboxLabel(),
            pagesCombobox.getComboboxElement(),
            pagesCombobox.getComboboxClearButton(),
            pagesCombobox.getComboboxArrowButton(),
            pagesCombobox.getListboxElement()
        );
        pages.parentElement.insertBefore(pagesFilterWrapper, pages);
        pagesCombobox.setActivateOptionCallback(async (value) => {
            let option = [...pages.options].find(op => op.textContent === value);
            option.selected = true;
        });
    }

    function copyTextToClipboard(text) {
        let fakeInput = document.createElement('textarea');
        fakeInput.value = text;
        document.documentElement.appendChild(fakeInput);
        fakeInput.select();
        document.execCommand('copy');
        fakeInput.remove();
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