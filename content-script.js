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
 * @typedef {import("./modules/components/checkbox.js").CheckboxComponent} CheckboxComponent
 */
(async () => {
    /** @type {{default: CreatePartneredMultiselect, realignPartneredMultiselect: RealignPartneredMultiselect}} */
    const {
        default: createPartneredMultiselect,
        realignPartneredMultiselect: realignPartneredMultiselect
    } = await import(
        chrome.runtime.getURL("modules/components/partneredMultiselect.js")
    );

    const {
        addKeyboardNavigation: addKeyboardNavigation
    } = await import(
        chrome.runtime.getURL("modules/components/filterableMultiselect.js")
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

    /**
     * @type {{
     *      default: CheckboxComponent
     * }}
     */
    const { default: createCheckboxComponent } = await import(
        chrome.runtime.getURL("modules/components/checkbox.js")
    );

    const { default: createDisclosure } = await import(
        chrome.runtime.getURL("modules/components/disclosure.js")
    );


    let issueCustomStyle;
    let issueToCopy;
    let recommendationToCopy;
    const pagesId = 'pages';
    const scId = 'success_criteria';
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
        injectAllStyles();
        ({
            pagesFilterableMultiselect: pagesFilterableMultiselect,
            scFilterableMultiselect: scFilterableMultiselect,
            statusFilterableMultiselect: statusFilterableMultiselect
        } = await replaceMultiselects());
        addIssueTemplateSearch();
    }

    function injectAllStyles() {
        let cssVariablesStyle = injectStyles(chrome.runtime.getURL('css/variables.css'));
        let cssColorVariablesStyle = injectStyles(chrome.runtime.getURL('css/colorVars.css'));
        let issueCustomStyle = injectStyles(chrome.runtime.getURL('css/addIssueCustomStyle.css'));
        let comboboxStyle = injectStyles(chrome.runtime.getURL('css/combobox.css'));
        let checkboxStyle = injectStyles(chrome.runtime.getURL('css/checkbox.css'));
        let filterableMultiselectStyle = injectStyles(chrome.runtime.getURL('css/filterableMultiselects.css'));
        let floatLabelStyle = injectStyles(chrome.runtime.getURL('css/floatLabel.css'));
        let srOnly = injectStyles(chrome.runtime.getURL('css/sr-only.css'));
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
            for (let sc of template.relatedsc) {
                let scInput = scFilterableMultiselect.checkboxes.find(
                    (inputPair) => includesCaseInsensitive(inputPair.label.textContent, sc)
                ).input;
                if (!scInput.checked) scInput.click();
            }

            // set issue description
            if (template.issue) {
                let issueDesc = document.getElementById(issueDescId);
                spoofUpdateTextareaValue(issueDesc, template.issue);
            }

            // set recommendation
            const _prepare = (paragraph) => {
                let items = paragraph.split('\n');
                return `${items.join('<br>')}`;
            }
            let recommendationParagraphs = [];
            if (template.requirement) {
                recommendationParagraphs.push(
                    _prepare(template.requirement)
                );
            }
            if (template.recommendation) {
                recommendationParagraphs.push(
                    _prepare(template.recommendation)
                )
            }
            //recommendationParagraphs.filter(a => a);

            let recommendationQuillEditor =
                document.getElementById(recommendationEditorId).querySelector('.ql-editor');
            await setQuillEditorText(recommendationQuillEditor, recommendationParagraphs, false);
            combobox.toggleListbox(false);


            // add default resources
            for (const resource of template.resources || []) {
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
        const padderClass = 'top-padder';
        const multiselectWidgetClass = 'multiselect-group';
        const createPadder = () => {
            let div = document.createElement('div');
            div.classList.add(padderClass);
            return div;
        }
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
        const _createFilterableMultiselect = (multiselect) => {
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
                },
                null,
                (positiveMatches, negativeMatches) => {
                    let tabindexedItem =
                        positiveMatches.find(filterable => filterable.item.input.tabIndex === 0)
                        || negativeMatches.find(filterable => filterable.item.input.tabIndex === 0);
                    tabindexedItem.tabIndex = -1;
                    positiveMatches.item.input.tabIndex = 0;
                }
            );
            return filterableMultiselect;
        }
        //
        const _createShowOnly = (filterableMultiselect) => {
            let showOnly = createCheckboxComponent('Only Selected ' + filterableMultiselect.fieldset.legend.textContent);
            showOnly.checkbox.addEventListener('change', (e) => {
                let firstShowingCheckbox;
                for (let checkboxPair of filterableMultiselect.checkboxes) {
                    if (showOnly.checked) {
                        checkboxPair.input.parentElement.hidden = !checkboxPair.input.checked;
                        if (!firstShowingCheckbox && !checkboxPair.input.hidden) {
                            firstShowingCheckbox = checkboxPair.input;
                        }
                        else {
                            checkboxPair.input.tabIndex = -1;
                        }
                    }
                    else {
                        checkboxPair.input.parentElement.hidden = false;
                        if (!firstShowingCheckbox) {
                            firstShowingCheckbox = checkboxPair.input;
                        }
                        else {
                            checkboxPair.input.tabIndex = -1;
                        }
                    }
                }
                firstShowingCheckbox.tabIndex = 0;
            });
            return showOnly;
        }
        // insertbefore select
        /** @type {HTMLSelectElement} */
        let pagesMultiselect = document.getElementById(pagesId);
        let pagesFilterableMultiselect = _createFilterableMultiselect(pagesMultiselect);
        addKeyboardNavigation(pagesFilterableMultiselect);
        let pagesShowOnly = _createShowOnly(pagesFilterableMultiselect);
        let pagesFilterableMultiselectWidget = await toFilterableMultiselectWidget(
            pagesFilterableMultiselect, [pagesShowOnly.component]);
        pagesMultiselect.parentElement.insertBefore(
            pagesFilterableMultiselectWidget,
            pagesMultiselect
        );
        pagesFilterableMultiselectWidget.classList.add(multiselectWidgetClass);
        pagesFilterableMultiselectWidget.parentElement.children.item(0).classList.add(padderClass);
        // replace success criteria multiselect
        /** @type {CheckboxSortCallback} */
        const scSort = (a, b) => {
            let regex = /(\d+)\.(\d+)\.(\d+)/i;
            let [aMatch, a1, a2, a3] = a.filterableText.match(regex);
            let [bMatch, b1, b2, b3] = b.filterableText.match(regex);
            let aNums = [a1, a2, a3];
            let bNums = [b1, b2, b3];
            for (let i = 0; i < 3; i++) {
                let aNum = Number(aNums[i]);
                let bNum = Number(bNums[i]);
                if (aNum === 0) return 1;
                if (aNum > bNum) return 1;
                if (aNum < bNum) return -1;
            }
            return 0;
        }
        let scMultiselect = document.getElementById(scId);
        let scFilterableMultiselect = _createFilterableMultiselect(scMultiselect);
        scFilterableMultiselect.filterableCheckboxes = scFilterableMultiselect.filterableCheckboxes.sort(scSort);
        addKeyboardNavigation(scFilterableMultiselect);
        let scShowOnly = _createShowOnly(scFilterableMultiselect);
        let scFilterableMultiselectWidget = await toFilterableMultiselectWidget(
            scFilterableMultiselect, [scShowOnly.component]);
        scMultiselect.parentElement.insertBefore(scFilterableMultiselectWidget, scMultiselect);
        scFilterableMultiselectWidget.classList.add(multiselectWidgetClass);
        scFilterableMultiselectWidget.parentElement.insertBefore(
            createPadder(),
            scFilterableMultiselectWidget
        );
        // replace states multiselect
        let statusMultiselect = document.getElementById(statesId);
        let statusFilterableMultiselect = _createFilterableMultiselect(statusMultiselect);
        addKeyboardNavigation(statusFilterableMultiselect);
        let statusShowOnly = _createShowOnly(statusFilterableMultiselect);
        let statusFilterableMultiselectWidget = await toFilterableMultiselectWidget(
            statusFilterableMultiselect, [statusShowOnly.component]);
        statusMultiselect.parentElement.insertBefore(statusFilterableMultiselectWidget, statusMultiselect);
        statusFilterableMultiselectWidget.classList.add(multiselectWidgetClass);
        statusFilterableMultiselectWidget.parentElement.insertBefore(
            createPadder(),
            statusFilterableMultiselectWidget
        );
        // add success criteria description updater
        // sometimes the sc descriptions does not update properly when selecting an sc. 
        // this makes sure that it updates properly - both when selecting and unselecting.
        let successCriteriaDescEditor = document.getElementById(successCriteriaDescEditorId).querySelector('.ql-editor');
        let checkboxPairsContainer = scFilterableMultiselectWidget.querySelector('.checkboxes-container');
        checkboxPairsContainer.addEventListener('change', (e) => {
            let issuesDescriptions = scFilterableMultiselect.checkboxes
                .filter(cPairs => cPairs.input.checked)
                .map(cPairs => {
                    let num = cPairs.label.querySelector('span').textContent.match(/\d+\.\d+\.\d+/gi)[0];
                    return `${num} - ${successCriteria[num].description}`;
                });
            let scDescReset = successCriteriaDescEditor.parentElement.parentElement.querySelector('button');
            scDescReset.click();
            setQuillEditorText(successCriteriaDescEditor, issuesDescriptions, false);
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
     * @callback CheckboxSortCallback
     * @param {Filterable} a
     * @param {Filterable} b
     * @returns {Boolean}
     */

    /**
     * 
     * @param {FilterableMultiselect} filterableMultiselect
     * @returns {Promise<[FilterableMultiselect, HTMLFieldSetElement]>}
     */
    async function toFilterableMultiselectWidget(filterableMultiselect, options) {


        let filterableMultiselectWidget = filterableMultiselect.fieldset.fieldset;

        // create filter box
        let filterBoxContainer = document.createElement('div');
        filterBoxContainer.append(
            filterableMultiselect.filterBox.label,
            filterableMultiselect.filterBox.input
        );
        filterBoxContainer.classList.add(
            'filter-box-pair',
            'float-label-pair'
        );
        filterableMultiselect.filterBox.label.classList.add('float-label');
        filterableMultiselect.filterBox.input.placeholder = ' ';

        // create checkboxes
        let checkboxesContainer = document.createElement('div');
        checkboxesContainer.classList.add('checkboxes-container');
        checkboxesContainer.classList.add('vertical');

        for (let { item: checkboxPair } of filterableMultiselect.filterableCheckboxes) {
            let checkboxComponent = createCheckboxComponent(null, {
                input: checkboxPair.input,
                label: checkboxPair.label
            });
            checkboxesContainer.appendChild(checkboxComponent.component);
        }

        // create settings
        let settingsWidget;
        if (options) {
            settingsWidget = document.createElement('div');
            settingsWidget.classList.add('settings-widget');
            /**
             * <button class="fa fa-cog"><span class="sr-only">[name] settings />/> 
             */

            let disclosure = createDisclosure(
                filterableMultiselect.fieldset.legend.textContent + ' settings',
                true
            );


            // create controller
            disclosure.controller.classList.add('settings-controller');
            disclosure.controller.setAttribute('aria-expanded', 'false');

            let cog = document.createElement('span');
            cog.classList.add('fa', 'fa-cog');
            disclosure.controller.prepend(cog);

            disclosure.label.classList.add('sr-only');
            // create settings container
            for (let option of options) {
                let optionRow = document.createElement('div');
                optionRow.classList.add('settings-option');
                optionRow.appendChild(option);
                disclosure.controlled.appendChild(optionRow);
            }
            settingsWidget.append(disclosure.controller, disclosure.controlled);
        }

        // create header
        let header = document.createElement('div');
        header.classList.add('header');

        header.appendChild(filterableMultiselect.fieldset.legend);
        if (settingsWidget) header.appendChild(settingsWidget);

        // append to widget
        filterableMultiselectWidget.append(
            header,
            filterBoxContainer,
            checkboxesContainer
        );

        filterableMultiselectWidget.classList.add('toolbox-augmentor');

        return filterableMultiselectWidget;
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

    /* #region getAuditData */

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

    /* #endregion */



})();