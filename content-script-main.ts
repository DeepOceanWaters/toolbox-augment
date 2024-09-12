import CheckboxWidget from "./modules/components/CheckboxWidget";
import FilterableMultiselect from "./modules/components/filterableMultiselect";
import partnerFilterableMultiselectAndSelect, { realignPartneredMultiselect } from "./modules/components/partneredMultiselect";
import includesCaseInsensitive from "./modules/includesCaseInsensitive";
import { setQuillEditorText, spoofOptionSelected, spoofUpdateTextareaValue } from "./modules/spoofUserInput";
import { getPossibleTokens, getRecommendation } from "./modules/replaceTokens.js";
import Combobox from "./modules/combobox";


export default function main() {
    (async () => {

        // REDO
        const {
            addKeyboardNavigation: addKeyboardNavigation
        } = await import(
            chrome.runtime.getURL("modules/components/filterableMultiselect.js")
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



        let pagesFilterableMultiselect: FilterableMultiselect;
        let scFilterableMultiselect: FilterableMultiselect;
        let statusFilterableMultiselect: FilterableMultiselect;

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
            let pages: HTMLSelectElement | null = document.getElementById(pagesId) as HTMLSelectElement | null;
            let successCriteria: HTMLSelectElement | null = document.getElementById(scId) as HTMLSelectElement | null;
            let states: HTMLSelectElement | null = document.getElementById(statesId) as HTMLSelectElement | null;
            //let addIssue = document.querySelector('button[title="Add Issue"]');
            isLoaded &&= !!(pages && pages.options.length > 0);
            isLoaded &&= !!(successCriteria && successCriteria.options.length > 0);
            isLoaded &&= !!(states && states.options.length > 0);
            return isLoaded;
        }

        async function _main() {
            chrome.runtime.onMessage.addListener(messageRouter);
            let issueDescriptionLabel: HTMLLabelElement =
                document.querySelector(`[for="${issueDescId}"]`) as HTMLLabelElement;

            let issueDescription: HTMLTextAreaElement =
                issueDescriptionLabel
                    .parentElement!
                    .children
                    .item(1) as HTMLTextAreaElement;

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

        async function messageRouter(request: any, sender: any, sendResponse: Function) {
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
                    let element = document.querySelector('[data-get-element-style]') as HTMLElement;
                    let style = getElementStyle.main(element);
                    delete element!.dataset.getElementStyle;
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
                case 'setTemplateDataToCopy':/*
                console.log('request: setTemplateDataToCopy');
                issueToCopy = request.issue as string;
                recommendationToCopy = request.recommendation as string;
                let pageSelect = document.getElementById('pages') as HTMLSelectElement;
                let successCriterionSelect = document.getElementById('success_criteria') as HTMLSelectElement;
                scrollSelectOptionIntoView(pageSelect, request.pageURL);
                if (request.relatedsc) {
                    let sc = request.relatedsc[0];
                    scrollSelectOptionIntoView(successCriterionSelect, sc);
                }
                let resetDescription = ((select: HTMLSelectElement) => {
                    let form = select.closest('form');
                    let buttons = form!.querySelectorAll('button');
                    return [...buttons].find(b => b.textContent!.includes("Reset Descriptions"));
                })(pageSelect as HTMLSelectElement);
                // if no success criteria already selected, reset the description
                // this helps when you select the same SC for two issues  in a row - when doing this
                // TOOLBOX will not properly fill the SC description textarea
                if (!successCriterionSelect.querySelectorAll(':checked').length) resetDescription.click();
                // set*/
                    break;
                case 'screenCaptureTest':
                    console.log('request: screenCaptureTest');
                    let img: HTMLImageElement = document.getElementById('page-img') as HTMLImageElement;
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
                    /*
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
                    }*/
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
         * Gets the next resource input element. If no empty resource 
         * input elements exists, clicks the "add resource" button,
         * waits just a little for the events to resolve, and returns 
         * the next resouce.
         * NOTE: click() executes events synchronously, so using promises
         * with timeouts probably isn't necessary. Will want to change in
         * the future.
         * @returns promise returning the next resource input
         */
        async function getNextResource(): Promise<HTMLInputElement> {
            let resources: NodeListOf<HTMLInputElement> =
                document.querySelectorAll('input[name="resources"]') as NodeListOf<HTMLInputElement>;
            let resource = [...resources].find(r => r.value.trim() === '');
            let resolver: (resolve: Function) => void;
            if (resource) {
                resolver = (resolve) => resolve(resource);
            }
            else {
                resolver = (resolve) => {
                    setTimeout(async () => resolve(await getNextResource()), 1);
                }
                let addResource: HTMLButtonElement =
                    resources.item(0).parentElement.querySelector(':scope > button') as HTMLButtonElement;
                addResource.click();
            }
            return new Promise((resolve) => {
                resolver(resolve);
            })
        }

        async function addIssueTemplateSearch(): Promise<void> {
            /**
             * form[form]:
             *      div[topRow]:
             *          div:
             *              target element description input
             *          div:
             *              added issue template search
             */


            let form = document.getElementById(pagesId)!.closest('form') as HTMLFormElement;
            let topRow = form.children.item(0) as HTMLElement;
            topRow.style.alignItems = 'baseline';
            topRow.style.gap = '1rem';

            let issueTemplateContainer = topRow.children.item(0)!.cloneNode() as HTMLElement;
            issueTemplateContainer.classList.remove(...issueTemplateContainer.classList);
            topRow.appendChild(issueTemplateContainer);

            let resetIssueContainer = issueTemplateContainer.cloneNode();
            topRow.appendChild(resetIssueContainer);


            let possibleTokens = getPossibleTokens();
            let combobox = new Combobox('Issue Template', 'Issue Templates', possibleTokens);
            combobox.setActivateOptionCallback(async () => {
                let { text: text, template: template }: { text: string, template: IssueTemplate }
                    = getRecommendation(combobox.getComboboxElement().value);

                // set success criteria
                for (let sc of template.relatedsc) {
                    let scInput = scFilterableMultiselect.checkboxes.find(
                        (checkboxWidget) => includesCaseInsensitive(checkboxWidget.textLabel.textContent!, sc)
                    )!.checkbox;
                    if (!scInput.checked) scInput.click();
                    if (!scFilterableMultiselect.showOnlyCheckbox.checkbox.checked) {
                        scFilterableMultiselect.showOnlyCheckbox.checkbox.click();
                    }
                }

                // set issue description
                if (template.issue) {
                    let issueDesc = document.getElementById(issueDescId) as HTMLTextAreaElement;
                    spoofUpdateTextareaValue(issueDesc, template.issue);
                }

                // set recommendation
                const _prepare = (paragraph: string): string => {
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
                // this gets rid of the extra newline when setting a template for the first time
                await setQuillEditorText(recommendationQuillEditor, [], false);
                combobox.toggleListbox(false);


                // add default resources
                for (const resource of template.resources || []) {
                    let resourceInput = await getNextResource();
                    spoofUpdateTextareaValue(resourceInput, resource);
                }

                // set testing software automatically if previously set
                let at = document.getElementById('assistive_tech');
                if (at.value) {
                    let dialogBtns = [...at.closest('[role="dialog"]').querySelectorAll('button')];
                    let addCombo = dialogBtns.find(btn => btn.textContent === 'Add Combo');
                    addCombo.click();
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

            // reset issues
            // let reset = document.createElement('button');
            // reset.textContent = 'reset issue';
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

                );
                return filterableMultiselect;
            }
            // insertbefore select
            /** @type {HTMLSelectElement} */
            let pagesMultiselect = document.getElementById(pagesId);
            let pagesFilterableMultiselect = _createFilterableMultiselect(pagesMultiselect);
            addKeyboardNavigation(pagesFilterableMultiselect);
            let pagesFilterableMultiselectWidget = await toFilterableMultiselectWidget(
                pagesFilterableMultiselect);
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
            let scFilterableMultiselectWidget = await toFilterableMultiselectWidget(
                scFilterableMultiselect);
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
            let statusFilterableMultiselectWidget = await toFilterableMultiselectWidget(
                statusFilterableMultiselect);
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
                let selectPairs = [
                    [pagesFilterableMultiselect, pagesMultiselect],
                    [scFilterableMultiselect, scMultiselect],
                    [statusFilterableMultiselect, statusMultiselect]
                ];
                for (let pair of selectPairs) {
                    realignPartneredMultiselect(pair[0], pair[1]);
                    let showOnlyCheckbox = pair[0].showOnlyCheckbox.checkbox;
                    if (showOnlyCheckbox.checked) showOnlyCheckbox.click();
                    if (["Edit Issue", "Copy Issue"].includes(e.target.title)) {
                        showOnlyCheckbox.click();
                    }
                }
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

            // show only selected chekcboxes 
            let showOnlyCheckbox = filterableMultiselect.showOnlyCheckbox;

            // filter grouping
            let grouping = document.createElement('div');
            grouping.classList.add('filtering-group');
            grouping.append(
                showOnlyCheckbox.component,
                filterBoxContainer,
                checkboxesContainer
            );
            // append to widget
            filterableMultiselectWidget.append(
                header,
                grouping
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
}