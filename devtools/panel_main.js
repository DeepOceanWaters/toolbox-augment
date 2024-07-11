import { tokens } from "../data/tokens.js";
import { main as replaceTokens, getPossibleTokens } from "../modules/replaceTokens.js";
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

        pageSearch.addEventListener('click', executePageSearch);
        exposeAltText.addEventListener('click', executeExposeAltText);
        elementStyle.addEventListener('click', executeGetElementStyle);
        scrollToForm.addEventListener('submit', executeScrollTo);
        stylesheetState.addEventListener('click', executeToggleIssueDialogStyles);
        replaceTokens.addEventListener('click', executeReplaceTokens);

        initRecommendationWiget();
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

    /***************************************************/

    function initRecommendationWiget() {
        let widgetElement = document.getElementById('tokens-combobox-widget');
        let possibleTokens = getPossibleTokens();
        let combobox = new Combobox('Tokens Search', 'Tokens', possibleTokens);
        widgetElement.append(
            combobox.getComboboxLabel(), 
            combobox.getComboboxElement(), 
            combobox.getListboxElement()
        );
    }


    // normal element.toggleAttribute() doesn't work as needed
    function toggleAttribute(element, attributeName) {
        let state = element.getAttribute(attributeName) === 'true';
        element.setAttribute(attributeName, !state);
        return !state;
    }
})();