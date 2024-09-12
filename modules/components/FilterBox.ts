import InputLabelPair from "./inputLabelPair";

export default class FilterBox extends InputLabelPair {
    clear: HTMLButtonElement;
    component: HTMLDivElement;

    constructor(label: string) {
        super(label);
    }
}