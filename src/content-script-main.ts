import includesCaseInsensitive from "./modules/includesCaseInsensitive.js";
import { getNextResource, setQuillEditorText, spoofOptionSelected, spoofUpdateTextareaValue, spoofClickTableRow } from "./modules/spoofUserInput.js";
import { getPossibleTokens, getRecommendation } from "./modules/replaceTokens.js";
import Combobox from "./modules/components/Combobox.js";
import { successCriteria } from "./data/successCriteria.js";
import { issueTemplate, state2names, states } from "./data/tokens.js";
import FilterableMultiselect from "./modules/components/FilterableMultiselect.js";
import CheckboxGroup from "./modules/components/CheckboxGroup.js";
import Fieldset from "./modules/components/Fieldset.js";
import TestingSoftwareCombo from "./modules/components/TestingSoftwareCombo.js";
import Settings, { StorageType, TestingEnvironment } from "./modules/AuditSettings.js";
import BasicSelect from "./modules/components/BasicSelect.js";
import Checkbox from "./modules/components/Checkbox.js";
import PartneredCheckboxGroup from "./modules/components/PartneredMultiselect.js";
import XLSX from '../external_libraries/xlsx.mjs';
import InputLabelPair from "./modules/components/InputLabelPair.js";
import wait, { waitUntil } from "./modules/wait.js";

enum EditorType {
    ADD,
    EDIT,
    COPY
}

export default function main() {
    (async () => {

        let issueCustomStyle;
        let issueToCopy;
        let recommendationToCopy;
        let chromeVersion;
        let previousAudit;

        const pagesId = 'pages';
        const scId = 'success_criteria';
        const statesId = 'audit_status';
        const issueDescId = 'issue_description';
        const successCriteriaDescEditorId = 'editor1';
        const recommendationEditorId = 'editor2';
        const softwareUseId = 'software_used';
        const atId = 'assistive_tech';


        let openIssueEditorCallbacks: ((type: EditorType) => void)[] = [];

        let testingSoftwareOptions: string[] = [];
        let assistiveTechOptions: string[] = [];
        let testingSection: HTMLDivElement;

        let currentCombos: TestingSoftwareCombo[] = [];

        let pagesPartneredMultiselect: FilterableMultiselect;
        let scPartneredMultiselect: FilterableMultiselect;
        let statesPartneredMultiselect: FilterableMultiselect;

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
            // for new audits, this won't load until the user switches to advanced issue
            let isLoaded = true;

            let pages: HTMLSelectElement | null = document.getElementById(pagesId) as HTMLSelectElement | null;
            let successCriteria: HTMLSelectElement | null = document.getElementById(scId) as HTMLSelectElement | null;
            let states: HTMLSelectElement | null = document.getElementById(statesId) as HTMLSelectElement | null;
            let software: HTMLSelectElement | null = document.getElementById(softwareUseId) as HTMLSelectElement | null;
            let at: HTMLSelectElement | null = document.getElementById(softwareUseId) as HTMLSelectElement | null;

            const selectIsLoaded = (select: HTMLSelectElement) => !!(select && select.options.length > 0);
            isLoaded &&= !!pages;
            isLoaded &&= selectIsLoaded(successCriteria);
            isLoaded &&= selectIsLoaded(states);
            isLoaded &&= selectIsLoaded(software);
            isLoaded &&= selectIsLoaded(at);
            return isLoaded;
        }

        async function _main() {
            // setup post issue editor opening callback
            let addIssue = document.querySelector('button[title="Add Issue"]');
            addIssue.parentElement.addEventListener('click', (e) => {
                let button = e.target as HTMLElement;
                let issueEditorType: EditorType;
                switch (button.title) {
                    case "Add Issue":
                        issueEditorType = EditorType.ADD;
                        break;
                    case "Edit Issue":
                        issueEditorType = EditorType.EDIT;
                        break;
                    case "Copy Issue":
                        issueEditorType = EditorType.COPY;
                        break;
                    default:
                        return;
                }
                for (let callback of openIssueEditorCallbacks) {
                    callback(issueEditorType);
                }
            });

            // rest
            testingSection = document.getElementById('software_used').parentElement.parentElement as HTMLDivElement;

            chrome.runtime.onMessage.addListener(messageRouter);
            repairIssueDescription();
            initCopyEventListeners();
            injectAllStyles();
            ({
                pagesPartneredMultiselect: pagesPartneredMultiselect,
                scPartneredMultiselect: scPartneredMultiselect,
                statesPartneredMultiselect: statesPartneredMultiselect
            } = await replaceMultiselects());
            addIssueTemplateSearch();
            addExpandTargetElementButton();
            hideSuccessCriteriaDescription();
            repositionStatusPriorityEffort();
            addPreviousAuditUpload();

            // setup opening callback
            openIssueEditorCallbacks.push((type) => {
                if (type !== EditorType.ADD) return;
                let lastCheckedPage = pagesPartneredMultiselect.checkboxGroup['lastChecked'];
                if (lastCheckedPage) {
                    pagesPartneredMultiselect.checkboxGroup.items.forEach(i => i.component.classList.remove('current'));
                    lastCheckedPage.component.scrollIntoView({ block: 'start' });
                    lastCheckedPage.component.classList.add('current');
                }
            });
        }

        /**
         * Replaces the INPUT type=text with a TEXTAREA. Sometimes the target 
         * description is long (I incorporate how to find the target into the 
         * name - CB). A TEXTAREA allows long names to wrap and allows users
         * to view the entire name. 
         */
        function addExpandTargetElementButton() {
            let target = document.getElementById('target') as HTMLInputElement;
            let targetTextarea = document.createElement('textarea');
            targetTextarea.id = 'target-custom';
            targetTextarea.classList.add('target');
            let targetStyle = window.getComputedStyle(target);
            targetTextarea.style.width = targetStyle.width;
            targetTextarea.value = target.value;
            targetTextarea.classList.add(...target.classList);
            targetTextarea.addEventListener('input', (e) => {
                spoofUpdateTextareaValue(target, targetTextarea.value, true);
            });
            target.parentElement.insertBefore(targetTextarea, target);
            target.style.display = 'none';
            openIssueEditorCallbacks.push((type) => {
                targetTextarea.value = target.value;
            });

            let targetLabel = document.querySelector('[for="target"]') as HTMLLabelElement;
            targetLabel.htmlFor = targetTextarea.id;
        }

        /**
         * Allows users to upload the previous audit to add the issue 
         * description that is always missing to each issue.
         * Currently only updates the first page of issues. Can run 
         * again on page 2 and it should work.
         */
        function addPreviousAuditUpload() {
            let toolbar = document.getElementById('toolbar');
            let upload = new InputLabelPair();
            upload.input.setAttribute('type', 'file');
            upload.component.append(upload.label, upload.input);
            upload.label.textContent = 'uplaod previous audit';
            toolbar.parentElement.append(upload.component);
            upload.input.addEventListener('change', (e) => {
                parsePreviousAudit(upload.input.files[0]);
            });
        }

        /**
         * Part of addPreviousAuditUpload()
         */
        async function parsePreviousAudit(file: File) {
            let fileArray = await file.arrayBuffer();
            let workbook = XLSX.read(fileArray, { dense: true });
            previousAudit = workbook.Sheets[workbook.SheetNames[0]]["!data"];
            setupIssueDescription();
            openIssueEditorCallbacks.push(async (type) => {
                if (type !== EditorType.EDIT) return;
                let editorOpen = await waitUntil(issueDialogIsOpen);
                if (!editorOpen) {
                    throw new Error(`couldn't open editor`);
                }
                let issue = findCurrentIssue();
                if (issue) {
                    //let UIIDs = [...document.querySelectorAll('[data-key="issue_number"]')].map(n => n.querySelector('span > span').textContent);
                    let issueDescription = document.getElementById(issueDescId) as HTMLTextAreaElement;
                    let issueDescriptionColNum = previousAudit[0].findIndex(c => includesCaseInsensitive(c.w, 'issue description'));
                    spoofUpdateTextareaValue(issueDescription, issue[issueDescriptionColNum]["v"]);
                }
            });
        }

        async function setupIssueDescription() {
            let UIIDs = [...document.querySelectorAll('[data-key="issue_number"]')].map(n => n.querySelector('span > span'));
            let issueDescriptionColNum = previousAudit[0].findIndex(c => includesCaseInsensitive(c.w, 'issue description'));
            for (const UIID of UIIDs) {
                let row = previousAudit.find(r => r.some(c => includesCaseInsensitive(c.w, UIID.textContent)));
                if (row) {
                    let htmlRow = UIID.closest('tr');
                    let issueDesc = htmlRow.querySelector('[data-key="issue_description"] span span');
                    // issueDesc.textContent = row[issueDescriptionColNum].v;
                    await spoofClickTableRow(htmlRow, (row: HTMLTableRowElement) => row.classList.contains('selected'));
                    let edit = await getEditIssue();
                    edit.click();
                    
                    let description = document.getElementById(issueDescId) as HTMLTextAreaElement;
                    await waitUntil(() => issueDialogIsOpen);
                    spoofUpdateTextareaValue(description, row[issueDescriptionColNum].v, true);
                    let saveBtn = [...description.closest('[role="dialog"]').querySelectorAll('button')]
                        .find(b => b.textContent.includes('Save'));
                    saveBtn.click();
                    await spoofClickTableRow(htmlRow, (row: HTMLTableRowElement) => !row.classList.contains('selected'));
                }
            }
        }

        function issueDialogIsOpen() {
            let description = document.getElementById(issueDescId) as HTMLTextAreaElement;
            return description.closest('[role="dialog"]').getBoundingClientRect().width > 0;
        }

        async function getEditIssue() {
            let count = 0;
            let edit;
            while(!edit && count++ < 50) {
                edit = document.querySelector('button[title="Edit Issue"]') as HTMLButtonElement;
                await wait(1);
            }
            if (!edit) {
                let selectedRows = [...document.querySelectorAll('tr.selected')];
                throw new Error(`Edit Issue is not showing up. ${selectedRows}`);
            }
            return edit;
        }

        

        function findRow(value: any, columnName: string) {
            let colIndex = previousAudit[0].findIndex(c => includesCaseInsensitive(c.w, columnName));
            if (colIndex === -1) {
                throw new Error('could not find column');
            }
            let out = previousAudit.find(r => r.some(c => c.v === value));
            return out;
        }

        function findCurrentIssue() {
            let currentIssue: { w, t, v }[] | null;
            let issueDescription = document.getElementById(issueDescId) as HTMLTextAreaElement;
            if (issueDescription.value === '') {
                let issueTarget = document.getElementById('target') as HTMLInputElement;
                let recommendationEditor = document.getElementById(recommendationEditorId);
                let recommendation = recommendationEditor.textContent;
                currentIssue = previousAudit.find(row => {
                    return row.find(c => c && includesCaseInsensitive(c.w, issueTarget.value));
                });
            }
            return currentIssue;
        }

        function repairIssueDescription() {
            let issueDescriptionLabel: HTMLLabelElement =
                document.querySelector(`[for="${issueDescId}"]`) as HTMLLabelElement;

            let issueDescription: HTMLTextAreaElement =
                issueDescriptionLabel
                    .parentElement!
                    .children
                    .item(1) as HTMLTextAreaElement;

            issueDescription.id = issueDescId;
        }

        function hideSuccessCriteriaDescription() {
            let editor = document.getElementById('editor1');
            editor.parentElement.classList.add('sr-only');
        }

        function repositionStatusPriorityEffort() {
            let status = document.getElementById('status');
            let column = status.parentElement.parentElement;
            column.parentElement.append(column);
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
                case 'chromeVersion':
                    chrome.storage.session.set({ "chrome-version": request.version });
                    break;
                default:
                    console.log(`unknown request: ${request.name}`);
                    break;
            }
            return;
        }

        async function initSettings() {
            let settingsByType = await Settings.getSettings();
            let oldSettingsSection = document.querySelector('[for="browser_combos"]').closest('form > div') as HTMLDivElement;
            let customSettingsSection = document.createElement('div');
            oldSettingsSection
                .parentElement
                .insertBefore(
                    customSettingsSection,
                    oldSettingsSection
                );
            oldSettingsSection.style.display = 'none';

            let settings = [];
            for (let type in settingsByType) {
                for (let settingName of type) {
                    let setting = type[settingName];
                    let environment = Settings.fromSettings(setting, setting.type);
                    settings.push(environment);
                }
            }
        }

        function addResetIssue() {

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
            let combobox = new Combobox('Issue Template', possibleTokens);
            combobox.setActivateOptionCallback(async () => {
                let { text: text, template: template }: { text: string, template: issueTemplate }
                    = getRecommendation(combobox.combobox.input.value);

                // set success criteria
                let relatedsc = [];
                if (template.relatedsc && Array.isArray(template.relatedsc)) {
                    relatedsc = template.relatedsc;
                }
                else if (typeof template.relatedsc === 'string') {
                    relatedsc.push(template.relatedsc);
                }
                for (let sc of relatedsc) {
                    let checkbox =
                        scPartneredMultiselect
                            .checkboxGroup
                            .originalItems
                            .find(
                                (checkbox) => includesCaseInsensitive(checkbox.textLabel.textContent!, sc)
                            )!
                            .input;
                    if (!checkbox.checked) {
                        checkbox.click();
                    }
                    if (!scPartneredMultiselect.showOnlyCheckbox.input.checked) {
                        scPartneredMultiselect.showOnlyCheckbox.input.click();
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

                if (template.notes) {
                    let auditorNotes = document.getElementById('auditor_notes') as HTMLTextAreaElement;
                    spoofUpdateTextareaValue(auditorNotes, template.notes);
                }

                if (template.states) {
                    setState(template.states);
                }


                // add default resources
                for (const resource of template.resources || []) {
                    let resourceInput = await getNextResource();
                    spoofUpdateTextareaValue(resourceInput, resource);
                }

                // set testing software automatically if previously set
                /*
                let at = document.getElementById('assistive_tech') as HTMLInputElement;
                if (at.value) {
                    let dialogBtns = [...at.closest('[role="dialog"]').querySelectorAll('button')];
                    let addCombo = dialogBtns.find(btn => btn.textContent === 'Add Combo');
                    addCombo.click();
                }*/
            });
            issueTemplateContainer.append(
                combobox.component
            );
            issueTemplateContainer.classList.add('combobox-widget');

            // reset issues
            let resetBtn = document.createElement('button');
            resetBtn.textContent = 'Reset Issue';
            resetIssueContainer.appendChild(resetBtn);
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                for (let pm of [scPartneredMultiselect, pagesPartneredMultiselect, statesPartneredMultiselect]) {
                    pm.checkboxGroup.originalItems.forEach(c => { if (c.input.checked) c.input.click(); });
                    if (pm.showOnlyCheckbox.input.checked) pm.showOnlyCheckbox.input.click();
                    pm.checkboxGroup.update();
                }
                let issueDescription = document.getElementById(issueDescId) as HTMLTextAreaElement;
                spoofUpdateTextareaValue(issueDescription, '', true);
                let recommendation = document.getElementById(recommendationEditorId);
                setQuillEditorText(recommendation, [''], true);
            });

        }

        async function setState(states: states[]) {
            let stateNames = states.map(s => state2names(s)).flat();
            // find states
            let stateCheckboxes = 
                statesPartneredMultiselect
                .checkboxGroup
                .items
                .filter(c => stateNames.includes(c.textLabel.textContent));
            // click them
            stateCheckboxes.forEach(
                c => {
                    if (!c.input.checked) c.input.click();
                }
            );
            // sort by selected
            statesPartneredMultiselect.showOnlyCheckbox.input.click();
            // if previously checked, we just unchecked it, so we're checking it again
            // we do this instead of leaving it checked as unchecking and rechecking 
            // automatically updates the sorting of the checkboxes
            if (!statesPartneredMultiselect.showOnlyCheckbox.input.checked) {
                statesPartneredMultiselect.showOnlyCheckbox.input.click();
            }
        }

        async function addCurrentPage(pagesPartneredMultiselect: FilterableMultiselect) {
            let pages = pagesPartneredMultiselect.checkboxGroup.originalItems;
            let form = document.getElementById(pagesId)!.closest('form') as HTMLFormElement;
            let topRow = form.children.item(0) as HTMLDivElement;
            let input = topRow.children.item(0).querySelector('input');

            let currentPage = new BasicSelect('Current Page', ['No Current Page', ...pages.map(c => c.textLabel.textContent)]);
            currentPage.select.options.item(0).selected = true;
            currentPage.select.classList.add(
                ...[...input.classList].filter(c => c !== 'appearance-none')
            );

            const setPage = () => {
                if (currentPage.select.selectedIndex > 0) {
                    let curPageName = currentPage.select.options.item(currentPage.select.selectedIndex).textContent;
                    let curCheckbox = pages.find(c => includesCaseInsensitive(c.textLabel.textContent, curPageName));
                    curCheckbox.input.click();
                    let showOnlyCheckbox = pagesPartneredMultiselect.showOnlyCheckbox.input;
                    showOnlyCheckbox.click();
                    if (!showOnlyCheckbox.checked) showOnlyCheckbox.click();
                }
            }

            currentPage.select.addEventListener('change', (e) => {
                setPage();
            });

            let nextButton = document.createElement('button');
            nextButton.setAttribute('tabindex', '-1');
            nextButton.setAttribute('aria-describedby', currentPage.select.id);
            nextButton.textContent = 'Next Page';
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                selectNextOption(currentPage.select);
                setPage();
            });

            openIssueEditorCallbacks.push((type: EditorType) => {
                if (type !== EditorType.ADD) return;
                setPage();
            });

            topRow.append(
                currentPage.component,
                nextButton
            );
        }

        /**
         * 
         * @param select 
         */
        function selectNextOption(select: HTMLSelectElement) {
            let curOptionIndex = select.selectedIndex;
            if (curOptionIndex === -1) {
                select.options.item(0).selected = true;
                curOptionIndex = 0;
            }
            let options = select.options;
            let curOption = options.item(curOptionIndex);
            curOption.selected = false;
            let nextOption = options.item(++curOptionIndex % options.length);
            nextOption.selected = true;
        }


        async function replaceMultiselects(): Promise<{
            pagesPartneredMultiselect: FilterableMultiselect,
            scPartneredMultiselect: FilterableMultiselect,
            statesPartneredMultiselect: FilterableMultiselect
        }> {
            const createPartneredMultiselect = (id: string): FilterableMultiselect => {
                let multiselect = document.getElementById(id) as HTMLSelectElement;
                let filterableMultiselect = new FilterableMultiselect(multiselect);
                multiselect.parentElement.insertBefore(
                    filterableMultiselect.component,
                    multiselect
                );
                filterableMultiselect.checkboxGroup.component.addEventListener('change', (e) => {
                    filterableMultiselect.checkboxGroup['lastChecked'] = filterableMultiselect.checkboxGroup.items.find(c => c.input === e.target);
                });
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
            pagesPartneredMultiselect.update();
            // replace success criteria multiselect
            let scPartneredMultiselect = createPartneredMultiselect(scId);
            scPartneredMultiselect.update();
            scPartneredMultiselect.checkboxGroup.originalItems.sort(
                (a, b) => {
                    let regex = /(\d+)\.(\d+)\.(\d+)/i;
                    let [aMatch, a1, a2, a3] = a.textLabel.textContent.match(regex);
                    let [bMatch, b1, b2, b3] = b.textLabel.textContent.match(regex);
                    let aNums = [a1, a2, a3];
                    let bNums = [b1, b2, b3];
                    for (let i = 0; i < 3; i++) {
                        let aNum = Number(aNums[i]);
                        let bNum = Number(bNums[i]);
                        if (aNum === 0) continue;
                        if (aNum > bNum) return 1;
                        if (aNum < bNum) return -1;
                    }
                    return 0;
                });
            scPartneredMultiselect.update();
            // replace states multiselect
            let statesPartneredMultiselect = createPartneredMultiselect(statesId);
            statesPartneredMultiselect.update();
            // add success criteria description updater
            // sometimes the sc descriptions does not update properly when selecting an sc. 
            // this makes sure that it updates properly - both when selecting and unselecting.
            let successCriteriaDescEditor =
                document
                    .getElementById(successCriteriaDescEditorId)
                    .querySelector('.ql-editor') as HTMLElement;
            scPartneredMultiselect
                .checkboxGroup
                .component
                .addEventListener('change', (e) => {
                    let issuesDescriptions =
                        scPartneredMultiselect
                            .checkboxGroup
                            .originalItems
                            .filter(checkbox => checkbox.input.checked)
                            .map(checkbox => {
                                let num =
                                    checkbox
                                        .textLabel
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
            const realignMultiselect = (editorType: EditorType) => {
                let pMultiselects = [
                    scPartneredMultiselect,
                    pagesPartneredMultiselect,
                    statesPartneredMultiselect
                ];
                for (let partneredMultiselect of pMultiselects) {
                    partneredMultiselect.filterer.input.value = '';
                    partneredMultiselect.update();
                    partneredMultiselect.checkboxGroup.realign();
                    let showOnlyCheckbox =
                        partneredMultiselect
                            .showOnlyCheckbox
                            .input;
                    if (showOnlyCheckbox.checked) {
                        showOnlyCheckbox.click();
                    }
                    if ([EditorType.EDIT, EditorType.COPY].includes(editorType)) {
                        showOnlyCheckbox.click();
                    }
                    partneredMultiselect.update();
                }
            }
            openIssueEditorCallbacks.push(realignMultiselect);
            // return 
            return {
                pagesPartneredMultiselect: pagesPartneredMultiselect,
                scPartneredMultiselect: scPartneredMultiselect,
                statesPartneredMultiselect: statesPartneredMultiselect
            };
        }

        function setupTestingSoftwareSection() {
            let softwareUsed = document.getElementById('software_used') as HTMLSelectElement;
            let softwareUsedLabel = document.querySelector(`[for="${softwareUsed.id}"]`);
            let assistiveTech = document.getElementById('assistive_tech') as HTMLSelectElement;
            let assistiveTechLabel = document.querySelector(`[for="${assistiveTech.id}"]`);

            let testingSection = softwareUsed.parentElement.parentElement;
            testingSection.hidden = true;

            const resetTestingSoftware = (editorType: EditorType) => {
                currentCombos = currentCombos.filter((combo, i) => {
                    if (i === 0) return true;
                    else {
                        combo.component.remove();
                    }
                    return false;
                });

                for (let combo of currentCombos) {
                    combo.update();
                }
            }
            openIssueEditorCallbacks.push();
        }

        function addTestingSoftwareCombo() {/*
            let softwareUsed = document.getElementById('software_used') as HTMLSelectElement;
            let assistiveTech = document.getElementById('assistive_tech') as HTMLSelectElement;

            let comboGroup = new TestingSoftwareCombo(
                currentCombos.length,
                [...softwareUsed.options].map(o => o.textContent),
                [...assistiveTech.options].map(o => o.textContent)
            );
            currentCombos.push(comboGroup);
            testingSection.append(comboGroup.component);*/
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

    })();
}