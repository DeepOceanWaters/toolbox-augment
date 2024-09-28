import InputLabelPair from "./InputLabelPair.js";

export default class TextInput extends InputLabelPair {
    constructor(label: string) {
        super();
        this.label.textContent = label;
    }

    static asFloatLabel(label: string): TextInput {
        let textInput = new TextInput(label);
        // add classes
        return textInput;
    }
}