import InputLabelPair from "./InputLabelPair.js";

export default class FilterBox implements Widget {
    component: HTMLDivElement;
    clear: HTMLButtonElement;
    inputLabelPair: InputLabelPair;

    constructor(label: string) {
        this.component = document.createElement('div');
        this.component.classList.add('float-label-pair');
        this.inputLabelPair = new InputLabelPair();
        this.inputLabelPair.label.textContent = label;
        this.inputLabelPair.label.classList.add('float-label');
        this.inputLabelPair.input.type = 'text';
    }

    public render() {
        this.component.append(
            this.inputLabelPair.label,
            this.inputLabelPair.input
        );
        return this.component;
    }
}