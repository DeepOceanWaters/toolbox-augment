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
            listbox.appendChild(optionElement);
        }

        return listbox;
    }

    createComboboxLabel(name, comboboxId) {
        let label = document.createElement('label');
        label.htmlFor = comboboxId;
        label.textContent = name;
        return label;
    }

    addEventListeners() {
        this.comboboxElement.addEventListener('input', this.searchOptions);
        this.comboboxElement.addEventListener('keydown', this.keyRouter);
        this.listboxElement.addEventListener('keydown', this.optionKeyRouter);
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
        [...this.listboxElement.children]
            .forEach(e => e.hidden = callback(e));
    }

    keyRouter(e) {
        switch (e.key) {
            case 'ArrowDown':
            case 'Enter':
                if (this.listboxElement.hidden) this.toggleListbox();
                this.listboxElement.querySelector('[role="option"]:not([hidden])').focus();
                return;
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


    toggleListbox(visibility) {
        let expanded = this.comboboxElement.getAttribute('aria-expanded') === 'true';
        if (visibility !== undefined) {
            expanded = !visibility;
        }
        this.listboxElement.hidden = expanded;
        this.comboboxElement.setAttribute('aria-expanded', !expanded);
        return !expanded;
    }

    activateOption(option) {
        // do stuff
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
}
