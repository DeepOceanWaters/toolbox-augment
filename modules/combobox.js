export default class Combobox {
    constructor(
        comboboxName, 
        listboxName, 
        options, 
        { autocomplete, comboboxId } = 
        { autocomplete: 'listbox', comboboxId: 'comboxbox-a1'}
    ) {
        this.listboxElement = this.createListboxElement(listboxName, options, comboboxId);
        this.comboboxElement = this.createComboboxElement(this.listboxElement, autocomplete);
        this.comboboxLabel = this.createComboboxLabel(comboboxName, this.comboboxElement.id);

        this.addEventListeners();
    }

    createComboboxElement(listbox, autocomplete, id) {
        let comboboxElement = document.createElement('input');
        comboboxElement.type = 'text';
        comboboxElement.setAttribute('role', 'combobox');
        comboboxElement.setAttribute('aria-controls', listbox.id);
        comboboxElement.setAttribute('aria-expanded', 'false');
        comboboxElement.setAttribute('aria-autocomplete', autocomplete);
        if (id) comboboxElement.id = id;
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

    createComboboxLabel(name, comboboxId) {
        let label = document.createElement('label');
        label.htmlFor = comboboxId;
        label.textContent = name;
        return label;
    }

    addEventListeners() {
        this.comboboxElement.addEventListener('input', (e) => {
            this.toggleListbox(true);
            this.searchOptions(e);
        });
        this.comboboxElement.addEventListener('keydown', (e) => this.keyRouter(e));
        this.listboxElement.addEventListener('keydown', (e) => this.optionKeyRouter(e));
        this.comboboxElement.addEventListener('focusin', (e) => this.toggleListbox(true));
        this.listboxElement.addEventListener('click', (e) => this.activateOption(e.target));
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
        for(let option of options) {
            option.hidden = !callback(option);
        }
    }

    keyRouter(e) {
        switch (e.key) {
            case 'ArrowDown':
            case 'Enter':
                if (this.listboxElement.hidden) this.toggleListbox();
                e.preventDefault();
                this.listboxElement.querySelector('[role="option"]:not([hidden])').focus();
                return;
            case 'Control':
            case 'Escape':
                if (!this.listboxElement.hidden) this.toggleListbox();
                break;
            default:
                return;
        }
        e.preventDefault();
    }

    optionKeyRouter(e) {
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
        let value = option.textContent;
        this.comboboxElement.value = value;
        this.comboboxElement.focus();
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

    setActivateOptionCallback(callback) {
        this.activateOptionCallback = callback;
    }
}
