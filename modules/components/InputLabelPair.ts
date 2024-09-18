import generateUniqueId from "../idGenerator.js";

export default class InputLabelPair {
    input: HTMLInputElement;
    label: HTMLLabelElement;
    
    constructor(label?: HTMLLabelElement | string, input?: HTMLInputElement) {
        if (typeof label === 'string') {
            this.label = document.createElement('label');
            this.label.textContent = label;
        }
        else {
            this.label = label || document.createElement('label');
        }
        this.input = input || document.createElement('input');
        if (this.label.htmlFor && this.input.id !== this.label.htmlFor) {
            this.label.htmlFor = this.input.id;
        }
        else {
            this.label.htmlFor = this.label.id ??= generateUniqueId();
        }
    }
}