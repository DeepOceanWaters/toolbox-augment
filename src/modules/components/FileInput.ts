import generateUniqueId from "../idGenerator.js";
import Component from "./Component.js";
import InputLabelPair from "./InputLabelPair.js";

export default class FileInput extends InputLabelPair {
    fileUploadedMessage: string;
    fileUploadedMessageEl: HTMLSpanElement;
    // states: file uploaded, no file uploaded, clear after closing dialog

    constructor(label: string) {
        super();
        this.label.textContent = label;
        this.component.append(this.label, this.input)
        this.component.classList.add('file-input', 'zone');
        this.input.type = 'file';
    }

    clear() {
        // clear file input
    }
}