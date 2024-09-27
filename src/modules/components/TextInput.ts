import InputLabelPair from "./InputLabelPair";

export default class TextInput extends InputLabelPair {
    descriptionContainer: HTMLParagraphElement;
    errorContainer: HTMLParagraphElement; 

    constructor(label: string) {
        super();
        this.label.textContent = label;
    }
}