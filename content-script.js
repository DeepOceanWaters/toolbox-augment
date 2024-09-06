/**
 * @typedef {import("./modules/components/filterableMultiselect.js").FilterableMultiselect} FilterableMultiselect
 * @typedef {import("./modules/components/partneredMultiselect.js").CreatePartneredMultiselect} CreatePartneredMultiselect
 * @typedef {import("./modules/components/partneredMultiselect.js").RealignPartneredMultiselect} RealignPartneredMultiselect
 * @typedef {import("./modules/components/filterableMultiselect.js").Filterable} Filterable
 * @typedef {import("./modules/components/filterableMultiselect.js").FilterOutcomeCallback} FilterOutcomeCallback
 * 
 * 
 */
(async () => {
    const src = chrome.runtime.getURL("modules/components/partneredMultiselect.js");
    /** @type {{default: CreatePartneredMultiselect, realignPartneredMultiselect: RealignPartneredMultiselect}} */
    const { default: createPartneredMultiselect, realignPartneredMultiselect: realignPartneredMultiselect } = await import(src);

    let issueCustomStyle;
    let issueToCopy;
    let recommendationToCopy;
    const [pagesId, scId, statesId] = [
        'pages',
        'success_criteria',
        'audit_status'
    ]

    main();

    async function main() {
        // wait until the app is done loading
        if (!isLoaded()) {
            setTimeout(main, 80);
            return;
        }
        _main();
    }

    function isLoaded() {
        let isLoaded = true;
        let pages = document.getElementById(pagesId);
        let successCriteria = document.getElementById(scId);
        let states = document.getElementById(statesId);
        isLoaded = pages && successCriteria && states;
        isLoaded &&= pages.options.length > 0;
        isLoaded &&= successCriteria.options.length > 0;
        isLoaded &&= states.options.length > 0;
        return isLoaded;
    }

    async function _main() {
        chrome.runtime.onMessage.addListener(messageRouter);
        initCopyEventListeners();
        issueCustomStyle = injectStyles(chrome.runtime.getURL('css/addIssueCustomStyle.css'));
        comboboxStyle = injectStyles(chrome.runtime.getURL('css/combobox.css'));
        replaceMultiselects();
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
     */
    async function replaceMultiselects() {
        // hides selects and labels
        injectStyles(chrome.runtime.getURL('css/augmentAddIssues.css'));
        // replace pages multiselect
        /**
         * Current html structure:
         *  div:
         *      div:
         *          label[select]
         *          label[working sample - contains input]
         *      select:
         */
        // insertbefore select
        /** @type {HTMLSelectElement} */
        let pagesMultiselect = document.getElementById(pagesId);
        let [pagesFilterableMultiselect, pagesFilterableMultiselectWidget] = await toFilterableMultiselect(pagesMultiselect);
        pagesMultiselect.parentElement.insertBefore(pagesFilterableMultiselectWidget, pagesMultiselect);
        pagesFilterableMultiselectWidget.classList.add('multiselect-group');
        // replace success criteria multiselect
        let scMultiselect = document.getElementById(scId);
        let [scFilterableMultiselect, scFilterableMultiselectWidget] = await toFilterableMultiselect(scMultiselect);
        scMultiselect.parentElement.insertBefore(scFilterableMultiselectWidget, scMultiselect);
        scFilterableMultiselectWidget.classList.add('multiselect-group');
        // replace states multiselect
        let statusMultiselect = document.getElementById(statesId);
        let [statusFilterableMultiselect, statusFilterableMultiselectWidget] = await toFilterableMultiselect(statusMultiselect);
        statusMultiselect.parentElement.insertBefore(statusFilterableMultiselectWidget, statusMultiselect);
        statusFilterableMultiselectWidget.classList.add('multiselect-group');
        // add realign events
        let addIssue = document.querySelector('button[title="Add Issue"]');

        addIssue.parentElement.addEventListener('click', (e) => {
            if (!["Add Issue", "Edit Issue", "Copy Issue"].includes(e.target.title)) {
                return;
            }
            setTimeout(() => {
                let selectPairs = [
                    [pagesFilterableMultiselect, pagesMultiselect],
                    [scFilterableMultiselect, scMultiselect],
                    [statusFilterableMultiselect, statusMultiselect]
                ];
                for (let pair of selectPairs) {
                    realignPartneredMultiselect(pair[0], pair[1]);
                }
            }, 20);
        });
    }

    /**
     * 
     * @param {HTMLSelectElement} multiselect 
     * @returns {Promise<[FilterableMultiselect, HTMLFieldSetElement]>}
     */
    async function toFilterableMultiselect(multiselect) {
        let multiselectLabel = document.querySelector(`[for="${multiselect.id}"]`);
        let filterableMultiselect = createPartneredMultiselect(
            multiselectLabel.textContent,
            multiselect,
            /** @type {FilterOutcomeCallback}  */
            (filterable) => {
                filterable.item.input.parentElement.hidden = false;
            },
            /** @type {FilterOutcomeCallback}  */
            (filterable) => {
                filterable.item.input.parentElement.hidden = true;
            }
        );

        let filterableMultiselectWidget = filterableMultiselect.fieldset.fieldset;

        let filterBoxContainer = document.createElement('div');
        filterBoxContainer.classList.add('filter-box-pair');
        filterBoxContainer.append(
            filterableMultiselect.filterBox.label,
            filterableMultiselect.filterBox.input
        );

        let checkboxesContainer = document.createElement('div');
        checkboxesContainer.classList.add('checkboxes-container');
        for (let checkbox of filterableMultiselect.checkboxes) {
            let checkboxPairContainer = document.createElement('div');
            checkboxPairContainer.classList.add('checkbox-pair');
            checkboxPairContainer.append(
                checkbox.input,
                checkbox.label
            );
            checkboxesContainer.appendChild(checkboxPairContainer);
        }

        filterableMultiselectWidget.append(
            filterBoxContainer,
            checkboxesContainer
        );

        return [filterableMultiselect, filterableMultiselectWidget];
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