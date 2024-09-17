import InputLabelPair from "./inputLabelPair";

export default class FilterBox extends HTMLDivElement {
    clear: HTMLButtonElement;
    component: HTMLDivElement;
    inputLabelPair: InputLabelPair;

    constructor(label: string) {
        super();
        this.inputLabelPair = new InputLabelPair(label);
        this.inputLabelPair.input.type = 'text';
    }

    public render() {
        this.append(
            this.inputLabelPair.label,
            this.inputLabelPair.input
        );
    }
}