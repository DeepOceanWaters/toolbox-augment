export default class MultiselectFilter {
    constructor(container, name, multiselect) {
        this.container = container;
        this.name = name;
        this.multiselect = multiselect;
        this.input = this.createFilterBox();
        this.label = this.createFilterBoxLabel();
    }


    createFilterBox() {
        let input = document.createElement('input');
        input.type = 'text';
        input.id = this.name + '-filtering-box';
        return input;
    }

    createFilterBoxLabel() {
        let label = document.createElement('label');
        label.htmlFor = this.input.id;
        label.textContent = `Filter ${this.name}`;
        return label;
    }

    addEventListners() {
        this.input.addEventListener('')
    }
}