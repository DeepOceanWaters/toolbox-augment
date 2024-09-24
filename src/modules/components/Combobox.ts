// @ts-nocheck
import generateUniqueId from "../idGenerator.js";
import FilterBox from "./FilterBox.js";
import Listbox from "./Listbox.js";

export default class Combobox {
    alwaysVisible: boolean;
    filterBox: FilterBox;
    listbox: Listbox;



    constructor(
        label: string,
        options: string[],
        args?: {
            alwaysVisible?: boolean
        }
    ) {
        this.alwaysVisible = !!(args?.alwaysVisible);

        this.listbox = new Listbox(options);
        this.listbox.component.hidden = true;

        setupComboboxElement();

        filterBox.inputLabelPair.input = this.createComboboxElement(
            this.listboxElement, autocomplete
        );
        
        
        this.comboboxLabel = this.createComboboxLabel(
            label, filterBox.inputLabelPair.input.id, this.labelId
        );
        this.comboboxArrowButton = this.createComboboxArrow(this.labelId);
        this.clearButton = this.createClearButton();
        this.selectOnly = selectOnly;

        this.addEventListeners();
    }

    setupComboboxElement() {
        this.filterBox.type = 'text';
        this.filterBox.setAttribute('role', 'combobox');
        this.filterBox.setAttribute('aria-controls', this.listbox.component.id);
        this.filterBox.setAttribute('aria-expanded', 'false');
        if (!this.selectOnly) {
            this.filterBox.setAttribute('aria-autocomplete', autocomplete);
        }
    }

    createComboboxArrow() {
        let label = this.filterBox.inputLabelPair.label;
        label.id = label.id || generateUniqueId();
        let arrowButton = document.createElement('button');
        arrowButton.setAttribute('aria-labelledby', label.id);
        arrowButton.classList.add('combobox-click-helper');
        arrowButton.tabIndex = -1;
        return arrowButton;
    }

    createClearButton() {
        let clearButton = document.createElement('button');
        let visibleText = document.createElement('span');
        let srOnlyText = document.createElement('span');

        visibleText.textContent = 'X';
        srOnlyText.textContent = 'clear';
        srOnlyText.classList.add('sr-only');
        clearButton.append(visibleText, srOnlyText);

        clearButton.classList.add('combobox-clear');

        return clearButton;
    }

    addEventListeners() {
        let combobox = filterBox.inputLabelPair.input;
        combobox.addEventListener('input', (e) => {
            this.toggleListbox(true);
            this.clearButton.dataset.emptyValue = combobox.value === '';
            this.searchOptions(e);

        });
        combobox.addEventListener('click', (e) => {
            this.toggleListbox(true);
            this.searchOptions(e);
        });
        this.arrowButton.addEventListener(
            'click', (e) => {
                this.toggleListbox();
                e.preventDefault();
                e.stopPropagation();
            }
        );
        combobox.addEventListener(
            'keydown', (e) => {
                this.keyRouter(e);
            }
        );
        this.listboxElement.addEventListener(
            'keydown', (e) => {
                this.optionKeyRouter(e);
            }
        );
        combobox.addEventListener(
            'focusin', (e) => {
                this.toggleListbox(true);
            }
        );
        this.listbox.component.addEventListener(
            'click', (e) => {
                this.activateOption(e.target);
            }
        );
        this.clearButton.addEventListener(
            'click', (e) => {
                this.clearCombobox();
                e.preventDefault();
                e.stopPropagation();
            }
        );
    }

    clearCombobox() {
        this.clearButton.dataset.emptyValue = true;
        filterBox.inputLabelPair.input.value = '';
        filterBox.inputLabelPair.input.focus();
        this.update();
    }

    keyRouter(e) {
        switch (e.key) {
            case 'Enter':
                if (filterBox.inputLabelPair.input.value === '') {
                    this.toggleListbox(true);
                }
                else if (this.activateOptionCallback) {
                    this.activateOptionCallback(filterBox.inputLabelPair.input.value);
                }
                e.preventDefault();
                break;
            case 'ArrowDown':
                this.toggleListbox(true);
                e.preventDefault();
                if (this.listboxElement.tagName === 'SELECT') {
                    this.listboxElement.querySelector(':is([role="option"], option):not([hidden])')
                }
                this.listboxElement.querySelector(':is([role="option"], option):not([hidden])').focus();
                return;
            case 'Control':
            case 'Escape':
                if (!this.listboxElement.hidden) this.toggleListbox();
                else filterBox.inputLabelPair.input.value = '';
                break;
            default:
                return;
        }
        e.preventDefault();
    }

    optionKeyRouter(e) {
        if (this.alwaysVisibile) return;
        let currentOption = e.target;
        // choose non-hidden options, and filter out any other options
        // that aren't visible
        switch (e.key) {
            case 'Enter':
            case ' ':
                this.toggleListbox();
                this.activateOption(currentOption);
                return;
            case 'Escape':
                nextFocus = filterBox.inputLabelPair.input;
                break;
            default:
                return;
        }
        e.preventDefault();
        nextFocus.focus();
    }

    positionListbox() {
        let viewportHeight = Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
        );
        this.listboxElement.style.left = '0px';
        let containerRect = filterBox.inputLabelPair.input.parentElement.getBoundingClientRect();
        let comboboxRect = filterBox.inputLabelPair.input.getBoundingClientRect();
        this.listboxElement.style.maxHeight = (viewportHeight - comboboxRect.bottom) + 'px';
        let listboxRect = this.listboxElement.getBoundingClientRect();
        this.listboxElement.style.left = (comboboxRect.x - listboxRect.x) + 'px';
        this.listboxElement.style.top = (comboboxRect.bottom - comboboxRect.top) + 'px';

    }


    toggleListbox(visibility) {
        if (this.alwaysVisibile) return;
        let expanded = filterBox.inputLabelPair.input.getAttribute('aria-expanded') === 'true';
        if (visibility !== undefined) {
            expanded = !visibility;
        }
        this.listboxElement.hidden = expanded;
        filterBox.inputLabelPair.input.setAttribute('aria-expanded', !expanded);
        this.positionListbox();
        return !expanded;
    }

    activateOption(option) {
        if (this.alwaysVisibile) return;
        let value = option.textContent;
        this.filterBox.inputLabelPair.input.value = value;
        this.filterBox.inputLabelPair.input.focus();
        this.clearButton.dataset.emptyValue = filterBox.inputLabelPair.input.value === '';
        this.toggleListbox(false);
        if (this.activateOptionCallback) this.activateOptionCallback(value);
    }

    /**
     * 
     * @param {Function(combobox value)} callback passes the combobox value and activates when activating an option
     */
    setActivateOptionCallback(callback) {
        this.activateOptionCallback = callback;
    }
}