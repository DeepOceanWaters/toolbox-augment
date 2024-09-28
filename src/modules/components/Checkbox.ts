import InputLabelPair from "./InputLabelPair.js";

export default class Checkbox extends InputLabelPair {
    textLabel: HTMLSpanElement;

    constructor(label: string) {
        super();

        this.textLabel  = document.createElement('span');
        this.textLabel .textContent = label;

        this.input.type = 'checkbox';
        this.label.appendChild(this.textLabel);
        this.label.classList.add('chkbox-pair');
        
        this.label.append(
            this.input,
            this.textLabel
        );

        this.component.append(
            this.label
        );
    }

    render() {
        return this.component;
    }
}