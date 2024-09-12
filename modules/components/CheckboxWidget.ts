import InputLabelPair from "./inputLabelPair.js";

export default class CheckboxWidget {
    public inputPair: InputLabelPair;
    public component: HTMLLabelElement;
    public textLabel: HTMLSpanElement;
    public checkbox: HTMLInputElement;

    constructor(label: string) {
        this.inputPair = new InputLabelPair();
        this.textLabel = this.makeLabelText(label);
        this.checkbox = this.inputPair.input;
        this.component = this.inputPair.label;

        this.inputPair.input.type = 'checkbox';
        this.inputPair.label.appendChild(this.textLabel);
        this.inputPair.label.classList.add('chkbox-pair');
    }

    private makeLabelText(labelText: string) {
        let label = document.createElement('span');
        label.textContent = labelText;
        return label;
    }
}