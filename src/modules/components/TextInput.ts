import InputLabelPair from "./InputLabelPair.js";

export default class TextInput extends InputLabelPair {
    constructor(label: string) {
        super();
        this.label.textContent = label;
        this.input.type = 'text';
    }

    static asFloatLabel(label: string): TextInput {
        let textInput = new TextInput(label);

        textInput.component.classList.add('filter-box-pair', 'float-label-pair');
        textInput.label.classList.add('float-label');
        textInput.component.append(
            textInput.label,
            textInput.input
        );
        return textInput;
    }
}