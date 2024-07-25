import { tokens } from "../data/tokens.js";
import { main as replaceTokens, getRecommendation, getPossibleTokens } from "../modules/replaceTokens.js";
import Combobox from "../modules/combobox.js";

(async () => {
    main();

    function main() {
        let pageSearch = document.getElementById('page-search');
        let exposeAltText = document.getElementById('expose-alt-text');
        let elementStyle = document.getElementById('get-element-style');
        let scrollToForm = document.getElementById('scroll-to-form');
        let stylesheetState = document.getElementById('stylesheet-state');
        let replaceTokens = document.getElementById('add-recommendation');
        let screenCapture = document.getElementById('screen-capture');

        pageSearch.addEventListener('click', executePageSearch);
        exposeAltText.addEventListener('click', executeExposeAltText);
        elementStyle.addEventListener('click', executeGetElementStyle);
        scrollToForm.addEventListener('submit', executeScrollTo);
        stylesheetState.addEventListener('click', executeToggleIssueDialogStyles);
        replaceTokens.addEventListener('click', executeReplaceTokens);
        screenCapture.addEventListener('click', executeScreenCaptureTest);

        initRecommendationWiget();
    }

    async function executeScreenCaptureTest() {
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        const imageDataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });
        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'screenCaptureTest',
            imageDataUrl: imageDataUrl
        });
    }

    async function executePageSearch() {
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'pageSearch'
        });
    }

    async function executeExposeAltText() {
        let exposeAltText = document.getElementById('expose-alt-text');
        toggleAttribute(exposeAltText, 'aria-pressed');
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'exposeAltText'
        });
    }

    async function executeGetElementStyle() {
        let result = await chrome.devtools.inspectedWindow.eval('$0.dataset.getElementStyle = "true"');
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'getElementStyle'
        });
    }

    async function executeScrollTo(e) {
        e.preventDefault();
        let scrollToNum = document.getElementById('scroll-to-num');
        let index = scrollToNum.value;

        let scrollToId = document.getElementById('scroll-to-id');
        let id = scrollToId.value;

        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });

        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'scrollTo',
            index: index,
            id: id
        });
    }

    async function executeToggleIssueDialogStyles() {
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });

        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'toggleIssueDialogStylesheet'
        });
    }

    async function executeReplaceTokens() {
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });

        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'replaceTokens'
        });
    }

    async function executeCopyToClipboard(text) {
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });

        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'copyToClipboard',
            text: text
        });
    }

    async function executeSetTemplateDataToCopy(issue, recommendation) {
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });

        const response = await chrome.tabs.sendMessage(tab.id, {
            name: 'setTemplateDataToCopy',
            issue: issue,
            recommendation: recommendation
        });
    }

    /***************************************************/

    async function initRecommendationWiget() {
        let tokensOutput = document.getElementById('tokens-output');
        let recommendation = document.getElementById('recommendation');
        let copyRecommendation = document.getElementById('copy-recommendation');
        let issue = document.getElementById('issue');
        let copyIssue = document.getElementById('copy-issue');
        let recourcesList = document.getElementById('resources');

        copyRecommendation.addEventListener('click', async (e) => {
            let response = await executeCopyToClipboard(recommendation.value);
        });
        copyIssue.addEventListener('click', async (e) => {
            let response = await executeCopyToClipboard(issue.value);
        });


        let widgetElement = document.getElementById('tokens-combobox-widget');
        let possibleTokens = getPossibleTokens();
        let combobox = new Combobox('Tokens Search', 'Tokens', possibleTokens);
        combobox.setActivateOptionCallback(async () => {
            let recommendationObj = getRecommendation(combobox.getComboboxElement().value);

            issue.value = 
                recommendationObj.template.issue || "";
            
            recommendation.value = recommendationObj.template.requirement || "";
            if (recommendationObj.template.requirement) {
                recommendation.value += '\n\n';
            }   
            recommendation.value += (recommendationObj.template.recommendation || "");
            
            recourcesList.innerHTML = '';
            for(const resource of recommendationObj.template.resources || []) {
                let li = document.createElement('li');
                li.textContent = resource;
                recourcesList.appendChild(li);
            }

            tokensOutput.value = recommendationObj.text;

            await executeSetTemplateDataToCopy(
                issue.value,
                recommendation.value
            );
        });
        widgetElement.append(
            combobox.getComboboxLabel(),
            combobox.getComboboxElement(),
            combobox.getComboboxClearButton(),
            combobox.getComboboxArrowButton(),
            combobox.getListboxElement()
        );
        widgetElement.classList.add('combobox-widget');
    }


    // normal element.toggleAttribute() doesn't work as needed
    function toggleAttribute(element, attributeName) {
        let state = element.getAttribute(attributeName) === 'true';
        element.setAttribute(attributeName, !state);
        return !state;
    }
})();