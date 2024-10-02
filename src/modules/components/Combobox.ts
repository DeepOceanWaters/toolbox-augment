// @ts-nocheck
import generateUniqueId from "../idGenerator.js";
import includesCaseInsensitive from "../includesCaseInsensitive.js";
import AriaOption from "./AriaOption.js";
import Component from "./Component.js";
import KeyboardNavigable from "./KeyboardNavigable.js";
import Listbox from "./Listbox.js";
import Mutable, { MutableItems } from "./Mutable.js";
import TextInput from "./TextInput.js";

const KMListbox = KeyboardNavigable(Mutable(Listbox));
type KMListbox = MutableItems<AriaOption> & Listbox;

export enum Autocomplete {
    LISTBOX = 'listbox',
    INLINE = 'inline',
    BOTH = 'both'
}

export default class Combobox extends Component {
    alwaysVisible: boolean;
    combobox: TextInput;
    listbox: KMListbox;
    clearButton?: HTMLButtonElement;
    arrowButton?: HTMLButtonElement;
    autocomplete: Autocomplete;
    selectOnly: boolean;

    constructor(
        label: string,
        options: string[],
        args?: {
            alwaysVisible?: boolean,
            autocomplete?: Autocomplete,
            selectOnly?: boolean
        }
    ) {
        super('div');
        this.selectOnly = !!(args?.selectOnly);
        this.alwaysVisible = !!(args?.alwaysVisible);
        this.alwaysVisible = args?.autocomplete ? args.autocomplete : Autocomplete.LISTBOX;

        this.listbox = new KMListbox(label, options, { hideLabel: true });
        this.listbox.component.hidden = true;
        this.listbox.addMutator(
            (options) => options.filter(
                (o: AriaOption) => includesCaseInsensitive(o.component.textContent, this.combobox.input.value)
            )
        );

        this.combobox = TextInput.asFloatLabel(label);
        this.combobox.input.setAttribute('autocomplete', 'off');

        this.setupComboboxElement();

        this.setupComboboxElement();
        
        this.arrowButton = this.createComboboxArrow(this.labelId);
        this.clearButton = this.createClearButton();

        this.addEventListeners();

        this.component.append(
            this.combobox.component,
            this.clearButton,
            this.arrowButton,
            this.listbox.component
        );
    }

    setupComboboxElement() {
        let input = this.combobox.input;
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-controls', this.listbox.component.id);
        input.setAttribute('aria-expanded', 'false');
        if (!this.selectOnly) {
            input.setAttribute('aria-autocomplete', this.autocomplete);
        }
    }

    createComboboxArrow() {
        let label = this.combobox.label;
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
        let combobox = this.combobox.input;
        combobox.addEventListener('input', (e) => {
            this.toggleListbox(true);
            this.clearButton.dataset.emptyValue = combobox.value === '';
            this.listbox.update();
        });
        combobox.addEventListener('click', (e) => {
            this.toggleListbox(true);
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
        this.listbox.component.addEventListener(
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
        this.combobox.input.value = '';
        this.combobox.input.focus();
        this.update();
    }

    keyRouter(e) {
        switch (e.key) {
            case 'Enter':
                if (this.combobox.input.value === '') {
                    this.toggleListbox(true);
                }
                else if (this.activateOptionCallback) {
                    this.activateOptionCallback(this.combobox.input.value);
                }
                e.preventDefault();
                break;
            case 'ArrowDown':
                this.toggleListbox(true);
                e.preventDefault();
                this.listbox.focus();
                return;
            case 'Control':
            case 'Escape':
                if (!this.listbox.component.hidden) this.toggleListbox();
                else this.combobox.input.value = '';
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
                nextFocus = this.combobox.input;
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
        this.listbox.component.style.left = '0px';
        let containerRect = this.combobox.input.parentElement.getBoundingClientRect();
        let comboboxRect = this.combobox.input.getBoundingClientRect();
        this.listbox.component.style.maxHeight = (viewportHeight - comboboxRect.bottom) + 'px';
        let listboxRect = this.listbox.component.getBoundingClientRect();
        this.listbox.component.style.left = (comboboxRect.x - listboxRect.x) + 'px';
        this.listbox.component.style.top = (comboboxRect.bottom - comboboxRect.top) + 'px';

    }


    toggleListbox(visibility) {
        if (this.alwaysVisibile) return;
        let expanded = this.combobox.input.getAttribute('aria-expanded') === 'true';
        if (visibility !== undefined) {
            expanded = !visibility;
        }
        this.listbox.component.hidden = expanded;
        this.combobox.input.setAttribute('aria-expanded', !expanded);
        this.positionListbox();
        return !expanded;
    }

    activateOption(option) {
        if (this.alwaysVisibile) return;
        let value = option.textContent;
        this.combobox.input.value = value;
        this.combobox.input.focus();
        this.clearButton.dataset.emptyValue = this.combobox.input.value === '';
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
