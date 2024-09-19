import InputLabelPair from "./InputLabelPair.js";

export default class CheckboxWidget implements Widget {
    component: HTMLDivElement;
    inputPair: InputLabelPair;
    textLabel: HTMLSpanElement;
    checkbox: HTMLInputElement;

    constructor(label: string) {
        this.component = document.createElement('div');
        this.inputPair = new InputLabelPair();
        this.textLabel = this.makeLabelText(label);
        this.checkbox = this.inputPair.input;

        this.inputPair.input.type = 'checkbox';
        this.inputPair.label.appendChild(this.textLabel);
        this.inputPair.label.classList.add('chkbox-pair');
        this.render();
    }

    private makeLabelText(labelText: string) {
        let label = document.createElement('span');
        label.textContent = labelText;
        return label;
    }

    render() {
        this.inputPair.label.append(
            this.inputPair.input,
            this.textLabel
        );
        this.component.append(
            this.inputPair.label
        );
        return this.component;
    }
}