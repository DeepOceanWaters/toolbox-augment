import includesCaseInsensitive from "./modules/includesCaseInsensitive.js";
import { setQuillEditorText, spoofOptionSelected, spoofUpdateTextareaValue } from "./modules/spoofUserInput.js";
import { getPossibleTokens, getRecommendation } from "./modules/replaceTokens.js";
import Combobox from "./modules/combobox.js";
import { successCriteria } from "./data/successCriteria.js";
import { issueTemplate } from "./data/tokens.js";
import PartneredMultiselect from "./modules/components/PartneredMultiselect.js";


export default function main() {
    (async () => {

        let issueCustomStyle;
        let issueToCopy;
        let recommendationToCopy;

        const pagesId = 'pages';
        const scId = 'success_criteria';
        const statesId = 'audit_status';
        const issueDescId = 'issue_description';
        const successCriteriaDescEditorId = 'editor1';
        const recommendationEditorId = 'editor2';



        let pagesPartneredMultiselect: PartneredMultiselect;
        let scPartneredMultiselect: PartneredMultiselect;
        let statesPartneredMultiselect: PartneredMultiselect;

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
                pagesPartneredMultiselect: pagesPartneredMultiselect,
                scPartneredMultiselect: scPartneredMultiselect,
                statesPartneredMultiselect: statesPartneredMultiselect
            } = await replaceMultiselects());
            //addIssueTemplateSearch();
        }

        function injectAllStyles() {
            let cssVariablesStyle = injectStyles(chrome.runtime.getURL('../css/variables.css'));
            let cssColorVariablesStyle = injectStyles(chrome.runtime.getURL('../css/colorVars.css'));
            let issueCustomStyle = injectStyles(chrome.runtime.getURL('../css/addIssueCustomStyle.css'));
            let comboboxStyle = injectStyles(chrome.runtime.getURL('../css/combobox.css'));
            let checkboxStyle = injectStyles(chrome.runtime.getURL('../css/checkbox.css'));
            let filterableMultiselectStyle = injectStyles(chrome.runtime.getURL('../css/filterableMultiselects.css'));
            let floatLabelStyle = injectStyles(chrome.runtime.getURL('../css/floatLabel.css'));
            let srOnly = injectStyles(chrome.runtime.getURL('../css/sr-only.css'));
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
                let { text: text, template: template }: { text: string, template: issueTemplate }
                    = getRecommendation(combobox.getComboboxElement().value);

                // set success criteria
                for (let sc of template.relatedsc) {
                    let checkbox = 
                        scPartneredMultiselect
                        .checkboxWidgets
                        .originalItems
                        .find(
                            (checkboxWidget) => includesCaseInsensitive(checkboxWidget.textLabel.textContent!, sc)
                        )!
                        .checkbox;
                    if (!checkbox.checked) checkbox.click();
                    if (!scPartneredMultiselect.showOnlyCheckbox.checkbox.checked) {
                        scPartneredMultiselect.showOnlyCheckbox.checkbox.click();
                        scPartneredMultiselect.render();
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
                    document
                    .getElementById(recommendationEditorId)
                    .querySelector('.ql-editor') as HTMLElement;
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
                let at = document.getElementById('assistive_tech') as HTMLInputElement;
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


        async function replaceMultiselects(): Promise<{
            pagesPartneredMultiselect: PartneredMultiselect,
            scPartneredMultiselect: PartneredMultiselect,
            statesPartneredMultiselect: PartneredMultiselect
        }> {
            const createPartneredMultiselect = (id: string): PartneredMultiselect => {
                let multiselect = document.getElementById(id) as HTMLSelectElement;
                let filterableMultiselect = new PartneredMultiselect(multiselect);
                //addKeyboardNavigation(filterableMultiselect);
                multiselect.parentElement.insertBefore(
                    filterableMultiselect.render(),
                    multiselect
                );
                return filterableMultiselect;
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
            // insertbefore select
            let pagesPartneredMultiselect = createPartneredMultiselect(pagesId);
            // replace success criteria multiselect
            let scPartneredMultiselect = createPartneredMultiselect(scId);
            scPartneredMultiselect.checkboxWidgets.originalItems.sort(
                (a, b) => {
                    let regex = /(\d+)\.(\d+)\.(\d+)/i;
                    let [aMatch, a1, a2, a3] = a.inputPair.label.textContent.match(regex);
                    let [bMatch, b1, b2, b3] = b.inputPair.label.textContent.match(regex);
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
                });
            scPartneredMultiselect.render();
            // replace states multiselect
            let statesPartneredMultiselect = createPartneredMultiselect(statesId);
            // add success criteria description updater
            // sometimes the sc descriptions does not update properly when selecting an sc. 
            // this makes sure that it updates properly - both when selecting and unselecting.
            let successCriteriaDescEditor =
                document
                    .getElementById(successCriteriaDescEditorId)
                    .querySelector('.ql-editor') as HTMLElement;
            scPartneredMultiselect
                .checkboxContainer
                .addEventListener('change', (e) => {
                    let issuesDescriptions =
                        scPartneredMultiselect
                            .checkboxWidgets
                            .originalItems
                            .filter(cw => cw.inputPair.input.checked)
                            .map(cw => {
                                let num = 
                                    cw
                                    .inputPair
                                    .label
                                    .querySelector('span')
                                    .textContent
                                    .match(/\d+\.\d+\.\d+/gi)[0];
                                return `${num} - ${successCriteria[num].description}`;
                            });
                    let scDescReset = 
                        successCriteriaDescEditor
                        .parentElement
                        .parentElement
                        .querySelector('button');
                    scDescReset.click();
                    setQuillEditorText(
                        successCriteriaDescEditor, 
                        issuesDescriptions, 
                        false
                    );
                });
            // add realign events
            let addIssue = document.querySelector('button[title="Add Issue"]');
            addIssue.parentElement.addEventListener('click', (e) => {
                let button = e.target as HTMLElement;
                if (!["Add Issue", "Edit Issue", "Copy Issue"].includes(button.title)) {
                    return;
                }
                let pMultiselects = [
                    scPartneredMultiselect,
                    pagesPartneredMultiselect,
                    statesPartneredMultiselect
                ];
                for (let partneredMultiselect of pMultiselects) {
                    partneredMultiselect.realign();
                    let showOnlyCheckbox = 
                        partneredMultiselect
                        .showOnlyCheckbox
                        .checkbox;
                    if (showOnlyCheckbox.checked) {
                        showOnlyCheckbox.click();
                    }
                    if (["Edit Issue", "Copy Issue"].includes(button.title)) {
                        showOnlyCheckbox.click();
                    }
                    partneredMultiselect.render();
                }
            });
            // return 
            return {
                pagesPartneredMultiselect: pagesPartneredMultiselect,
                scPartneredMultiselect: scPartneredMultiselect,
                statesPartneredMultiselect: statesPartneredMultiselect
            };
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

        function injectStyles(url: string) {
            let element = document.createElement('link');
            element.rel = 'stylesheet';
            element.setAttribute('href', url);
            document.head.appendChild(element);
            return element;
        }

        /* #region getAuditData */
/*
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
*/
        /* #endregion */



    })();
}