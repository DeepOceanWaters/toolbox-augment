import { HTMLAutocomplete } from "../HTMLAttributes.js";
import { Autocomplete } from "./Combobox.js";
import InputLabelPair from "./InputLabelPair.js";

interface TextInputArguments {
    autocomplete?: [HTMLAutocomplete] | string[] ,
    value?: string
}

export default class TextInput extends InputLabelPair {
    constructor(
        label: string, 
        { 
            autocomplete = [HTMLAutocomplete.OFF],
            value = null
        }: TextInputArguments = {}
    ) {
        super();
        this.label.textContent = label;
        this.input.type = 'text';
        this.input.setAttribute('autocomplete', autocomplete.join(' '));
        this.component.append(
            this.label,
            this.input
        );
        if (value !== null) {
            this.input.value = value;
        }
    }

    static asFloatLabel(label: string, args?: TextInputArguments): TextInput {
        let textInput = new TextInput(label, args);

        textInput.component.classList.add('filter-box-pair', 'float-label-pair');
        textInput.label.classList.add('float-label');
        textInput.component.append(
            textInput.label,
            textInput.input
        );
        return textInput;
    }

    focus() {
        this.input.focus();
    }
}