import generateUniqueId from "../idGenerator.js";

export default class InputLabelPair {
    input: HTMLInputElement;
    label: HTMLLabelElement;
    
    constructor() {
        this.label = document.createElement('label');
        this.input = document.createElement('input');
        this.input.id = generateUniqueId();
        this.label.htmlFor = this.input.id;
    }
}