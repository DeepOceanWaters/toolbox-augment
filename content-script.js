/**
 * @typedef {import("./modules/components/filterableMultiselect.js").FilterableMultiselect} FilterableMultiselect
 * @typedef {import("./modules/components/partneredMultiselect.js").CreatePartneredMultiselect} CreatePartneredMultiselect
 * @typedef {import("./modules/components/partneredMultiselect.js").RealignPartneredMultiselect} RealignPartneredMultiselect
 * @typedef {import("./modules/components/filterableMultiselect.js").Filterable} Filterable
 * @typedef {import("./modules/components/filterableMultiselect.js").FilterOutcomeCallback} FilterOutcomeCallback
 * @typedef {import("./modules/spoofUserInput.js").SpoofOptionSelected} SpoofOptionSelected
 * @typedef {import("./modules/spoofUserInput.js").SpoofUpdateTextareaValue} SpoofUpdateTextareaValue
 * @typedef {import("./modules/spoofUserInput.js").SetQuillEditorText} SetQuillEditorText
 * @typedef {import("./modules/replaceTokens.js").IssueTemplate} IssueTemplate
 * @typedef {import("./modules/replaceTokens.js").GetRecommendationReturn} GetRecommendationReturn
 * @typedef {import("./data/successCriteria.js").SuccessCriteria} SuccessCriteria
 */
(async () => {
    /** @type {{default: CreatePartneredMultiselect, realignPartneredMultiselect: RealignPartneredMultiselect}} */
    const { 
        default: createPartneredMultiselect, 
        realignPartneredMultiselect: realignPartneredMultiselect 
    } = await import(
        chrome.runtime.getURL("modules/components/partneredMultiselect.js")
    );

    const { default: includesCaseInsensitive } = await import(
        chrome.runtime.getURL("./modules/includesCaseInsensitive.js")
    );

    /**
     * @type {{
     *      spoofOptionSelected: SpoofOptionSelected, 
     *      spoofUpdateTextareaValue: SpoofUpdateTextareaValue,
     *      setQuillEditorText: SetQuillEditorText
     * }}
     */
    const {
        spoofOptionSelected: spoofOptionSelected,
        spoofUpdateTextareaValue: spoofUpdateTextareaValue, 
        setQuillEditorText: setQuillEditorText
    } = await import(
        chrome.runtime.getURL("modules/spoofUserInput.js")
    );


    let issueCustomStyle;
    let issueToCopy;
    let recommendationToCopy;
    const pagesId = 'pages';
    const scId ='success_criteria';
    const statesId = 'audit_status';
    const issueDescId = 'issue_description';
    const successCriteriaDescEditorId = 'editor1';
    const recommendationEditorId = 'editor2';

    /** @type {{successCriteria: SuccessCriteria}} */
    const { successCriteria: successCriteria } = await import(
        chrome.runtime.getURL("data/successCriteria.js")
    );

    /** @type {FilterableMultiselect} */
    let pagesFilterableMultiselect;
    /** @type {FilterableMultiselect} */
    let scFilterableMultiselect;
    /** @type {FilterableMultiselect} */
    let statusFilterableMultiselect;

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
        let addIssue = document.querySelector('button[title="Add Issue"]');
        isLoaded = pages && successCriteria && states && addIssue;
        isLoaded &&= pages.options.length > 0;
        isLoaded &&= successCriteria.options.length > 0;
        isLoaded &&= states.options.length > 0;
        return isLoaded;
    }

    async function _main() {
        chrome.runtime.onMessage.addListener(messageRouter);
        let issueDescription = document.querySelector(`[for="${issueDescId}"]`).parentElement.children.item(1);
        issueDescription.id = issueDescId;
        initCopyEventListeners();
        issueCustomStyle = injectStyles(chrome.runtime.getURL('css/addIssueCustomStyle.css'));
        comboboxStyle = injectStyles(chrome.runtime.getURL('css/combobox.css'));
        ({ 
            pagesFilterableMultiselect: pagesFilterableMultiselect,
            scFilterableMultiselect: scFilterableMultiselect,
            statusFilterableMultiselect: statusFilterableMultiselect
        } = await replaceMultiselects());
        addIssueTemplateSearch();
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

    async function getNextResource() {
        let resources = document.querySelectorAll('input[name="resources"]');
        let resource = [...resources].find(r => r.value.trim() === '');
        let resolver;
        if (resource) {
            resolver = (resolve) => resolve(resource);
        }
        else {
            resolver = (resolve) => {
                setTimeout(async () => resolve(await getNextResource()), 10);
            }
            let addResource = resources.item(0).parentElement.querySelector(':scope > button');
            addResource.click();
        }
        return new Promise((resolve) => {
            resolver(resolve);
        })
    }

    async function addIssueTemplateSearch() {
        /**
         * form[form]:
         *      div[topRow]:
         *          div:
         *              target element description input
         *          div:
         *              added issue template search
         */
        const { 
            getPossibleTokens: getPossibleTokens, 
            getRecommendation: getRecommendation 
        } = await import(
            chrome.runtime.getURL("modules/replaceTokens.js")
        );

        const { default: Combobox } = await import(
            chrome.runtime.getURL("modules/combobox.js")
        );
    

        let form = document.getElementById(pagesId).closest('form');
        let topRow = form.children.item(0);
        topRow.style.alignItems = 'baseline';
        topRow.style.gap = '1rem';
        
        let issueTemplateContainer = topRow.children.item(0).cloneNode();
        issueTemplateContainer.classList.remove(...issueTemplateContainer.classList);
        topRow.appendChild(issueTemplateContainer);

        let possibleTokens = getPossibleTokens();
        let combobox = new Combobox('Issue Template', 'Issue Templates', possibleTokens);
        combobox.setActivateOptionCallback(async () => {

            /** @type {{text: String, template: IssueTemplate}} */
            let { text: text, template: template } = getRecommendation(combobox.getComboboxElement().value);

            // set success criteria
            for(let sc of template.relatedsc) {
                let scInput = scFilterableMultiselect.checkboxes.find(
                    (inputPair) => includesCaseInsensitive(inputPair.label.textContent, sc)
                ).input;
                scInput.click();
            }
            
            // set issue description
            if (template.issue) {
                let issueDesc = document.getElementById(issueDescId);
                spoofUpdateTextareaValue(issueDesc, template.issue);
            }
            
            // set recommendation
            let recommendation = [
                template.requirement, 
                template.recommendation
            ].filter(a => a).join('\n\n'); 

            let recommendationQuillEditor = 
                document.getElementById(recommendationEditorId).querySelector('.ql-editor');
            await setQuillEditorText(recommendationQuillEditor, recommendation, false);
            combobox.toggleListbox(false);

            
            // add default resources
            for(const resource of template.resources || []) {
                let resourceInput = await getNextResource();
                spoofUpdateTextareaValue(resourceInput, resource);
            }
        });
        issueTemplateContainer.append(
            combobox.getComboboxLabel(),
            combobox.getComboboxElement(),
            combobox.getComboboxClearButton(),
            combobox.getComboboxArrowButton(),
            combobox.getListboxElement()
        );
        issueTemplateContainer.classList.add('combobox-widget');
    }

    /**
     * @returns {Promise<{ 
     *      pagesFilterableMultiselect: FilterableMultiselect, 
     *      scFilterableMultiselect: FilterableMultiselect,  
     *      statusFilterableMultiselect: FilterableMultiselect
     * }>}
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
        // add success criteria description updater
        let successCriteriaDescEditor = document.getElementById(successCriteriaDescEditorId).querySelector('.ql-editor');
        let checkboxPairsContainer = scFilterableMultiselectWidget.querySelector('.checkboxes-container');
        checkboxPairsContainer.addEventListener('change', (e) => {
            setTimeout(async () => {
                let issuesDescriptions = scFilterableMultiselect.checkboxes
                    .filter(cPairs => cPairs.input.checked)
                    .map(cPairs => {
                        let num = cPairs.label.textContent.match(/\d+\.\d+\.\d+/gi)[0];
                        return `<div>${num} - ${successCriteria[num].description}</div>`;
                    })
                    .join('<div></div>');
                await new Promise((resolve) => {
                    let scDescReset = successCriteriaDescEditor.parentElement.parentElement.querySelector('button');
                    scDescReset.click();
                    setTimeout(() => resolve(), 5);
                });
                await setQuillEditorText(successCriteriaDescEditor, issuesDescriptions, false);
            }, 1000);
        });
        // add realign events
        // realigns new multiselects with old multiselects when opening a different issue
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
        return { 
            pagesFilterableMultiselect: pagesFilterableMultiselect, 
            scFilterableMultiselect: scFilterableMultiselect, 
            statusFilterableMultiselect: statusFilterableMultiselect
        };
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