import InputLabelPair from "./inputLabelPair.js";

export default class CheckboxWidget extends HTMLDivElement {
    public inputPair: InputLabelPair;
    public textLabel: HTMLSpanElement;
    public checkbox: HTMLInputElement;

    constructor(label: string) {
        super();
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

    public render() {
        this.inputPair.label.append(
            this.inputPair.input,
            this.textLabel
        )
        this.append(
            this.inputPair.label
        )
    }
}