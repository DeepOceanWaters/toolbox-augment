// @ts-nocheck
import Listbox from "./components/Listbox.js";

export default class Combobox {
    alwaysVisible: boolean;
    combobox: HTMLInputElement;
    listbox: Listbox;


    constructor(
        comboboxName: string,
        listboxName: string,
        options: string[],
        args?: {
            alwaysVisible?: boolean
        }
    ) {
        this.alwaysVisible = !!(args?.alwaysVisible);
        this.comboboxElement = this.createComboboxElement(
            this.listboxElement, autocomplete
        );
        this.listboxElement = this.createListboxElement(
            listboxName, options, comboboxId
        );
        
        this.comboboxLabel = this.createComboboxLabel(
            comboboxName, this.comboboxElement.id, this.labelId
        );
        this.comboboxArrowButton = this.createComboboxArrow(this.labelId);
        this.comboboxClearButton = this.createClearButton();
        this.selectOnly = selectOnly;

        this.addEventListeners();
    }

    createComboboxElement(listbox, autocomplete, id) {
        let comboboxElement = document.createElement('input');
        comboboxElement.type = 'text';
        comboboxElement.setAttribute('role', 'combobox');
        comboboxElement.setAttribute('aria-controls', listbox.id);
        comboboxElement.setAttribute('aria-expanded', 'false');
        if (!this.selectOnly) {
            comboboxElement.setAttribute('aria-autocomplete', autocomplete);
        }
        if (id) comboboxElement.id = id;
        if (this.selectOnly) comboboxElement.setAttribute('readonly', 'true');
        return comboboxElement;
    }

    createListboxElement(name, options, comboboxId) {
        let listbox = document.createElement('ul');
        listbox.id = comboboxId + '-listbox';
        listbox.setAttribute('role', 'listbox');
        listbox.setAttribute('aria-label', name);

        for (let option of options) {
            let optionElement = document.createElement('li');
            optionElement.setAttribute('role', 'option');
            optionElement.textContent = option;
            optionElement.tabIndex = -1;
            listbox.appendChild(optionElement);
        }

        listbox.hidden = true;
        return listbox;
    }

    createComboboxLabel(name, comboboxId, labelId) {
        let label = document.createElement('label');
        label.id = labelId;
        label.htmlFor = comboboxId;
        label.textContent = name;
        return label;
    }

    createComboboxArrow(comboboxLabelId) {
        let arrowButton = document.createElement('button');
        arrowButton.setAttribute('aria-labelledby', comboboxLabelId);
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
        this.comboboxElement.addEventListener('input', (e) => {
            this.toggleListbox(true);
            this.comboboxClearButton.dataset.emptyValue = this.comboboxElement.value === '';
            this.searchOptions(e);

        });
        this.comboboxElement.addEventListener('click', (e) => {
            this.toggleListbox(true);
            this.searchOptions(e);
        });
        this.comboboxArrowButton.addEventListener(
            'click', (e) => {
                this.toggleListbox();
                e.preventDefault();
                e.stopPropagation();
            }
        );
        this.comboboxElement.addEventListener(
            'keydown', (e) => {
                this.keyRouter(e);
            }
        );
        this.listboxElement.addEventListener(
            'keydown', (e) => {
                this.optionKeyRouter(e);
            }
        );
        this.comboboxElement.addEventListener(
            'focusin', (e) => {
                this.toggleListbox(true);
            }
        );
        this.listboxElement.addEventListener(
            'click', (e) => {
                this.activateOption(e.target);
            }
        );
        this.comboboxClearButton.addEventListener(
            'click', (e) => {
                this.clearCombobox();
                e.preventDefault();
                e.stopPropagation();
            }
        );
    }

    clearCombobox() {
        this.comboboxClearButton.dataset.emptyValue = true;
        this.comboboxElement.value = '';
        this.comboboxElement.focus();
        this.searchOptions();
    }

    searchOptions() {
        if (this.comboboxElement.value === '') {
            this.filerOptions(() => true);
        }
        else {
            this.filerOptions((el) => {
                return el.textContent.toLowerCase().includes(
                    this.comboboxElement.value.toLowerCase()
                )
            });
        }
    }

    filerOptions(callback) {
        let options = [...this.listboxElement.children];
        for (let option of options) {
            option.hidden = !callback(option);
        }
    }

    keyRouter(e) {
        switch (e.key) {
            case 'Enter':
                if (this.comboboxElement.value === '') {
                    this.toggleListbox(true);
                }
                else if (this.activateOptionCallback) {
                    this.activateOptionCallback(this.comboboxElement.value);
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
                else this.comboboxElement.value = '';
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
        let options = Array.from(this.listboxElement.children).filter(e => e.checkVisibility());
        let currentIndex = options.indexOf(currentOption);
        let nextFocus, nextIndex;
        let direction;
        switch (e.key) {
            case 'ArrowDown':
                direction = 1;
                nextIndex = (currentIndex + 1);
            case 'ArrowUp':
                // if next index is set 
                // (aka arrow down was hit), don't set it
                direction ??= -1;
                nextIndex ??= (options.length + currentIndex - 1);
                nextIndex %= options.length;
                nextFocus = options[nextIndex];
                break;
            case 'Enter':
            case ' ':
                this.toggleListbox();
                this.activateOption(currentOption);
                return;
            case 'Escape':
                nextFocus = this.comboboxElement;
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
        let containerRect = this.comboboxElement.parentElement.getBoundingClientRect();
        let comboboxRect = this.comboboxElement.getBoundingClientRect();
        this.listboxElement.style.maxHeight = (viewportHeight - comboboxRect.bottom) + 'px';
        let listboxRect = this.listboxElement.getBoundingClientRect();
        this.listboxElement.style.left = (comboboxRect.x - listboxRect.x) + 'px';
        this.listboxElement.style.top = (comboboxRect.bottom - comboboxRect.top) + 'px';

    }


    toggleListbox(visibility) {
        if (this.alwaysVisibile) return;
        let expanded = this.comboboxElement.getAttribute('aria-expanded') === 'true';
        if (visibility !== undefined) {
            expanded = !visibility;
        }
        this.listboxElement.hidden = expanded;
        this.comboboxElement.setAttribute('aria-expanded', !expanded);
        this.positionListbox();
        return !expanded;
    }

    activateOption(option) {
        if (this.alwaysVisibile) return;
        let value = option.textContent;
        this.comboboxElement.value = value;
        this.comboboxElement.focus();
        this.comboboxClearButton.dataset.emptyValue = this.comboboxElement.value === '';
        this.toggleListbox(false);
        if (this.activateOptionCallback) this.activateOptionCallback(value);
    }

    getComboboxLabel() {
        return this.comboboxLabel;
    }

    getComboboxElement() {
        return this.comboboxElement;
    }

    getListboxElement() {
        return this.listboxElement;
    }

    getComboboxArrowButton() {
        return this.comboboxArrowButton;
    }

    getComboboxClearButton() {
        return this.comboboxClearButton;
    }

    /**
     * 
     * @param {Function(combobox value)} callback passes the combobox value and activates when activating an option
     */
    setActivateOptionCallback(callback) {
        this.activateOptionCallback = callback;
    }
}
