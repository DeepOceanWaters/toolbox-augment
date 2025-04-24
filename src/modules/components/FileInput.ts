import generateUniqueId from "../idGenerator.js";
import Component from "./Component.js";
import InputLabelPair from "./InputLabelPair.js";

export enum FileInputType {
    DROP,
    VANILLA
}

export default class FileInput extends InputLabelPair {
    fileUploadedMessage: string;
    fileUploadedMessageEl: HTMLSpanElement;
    dropCallbacks: Function[];
    // states: file uploaded, no file uploaded, clear after closing dialog

    constructor(label: string, type: FileInputType = FileInputType.VANILLA) {
        super();
        this.label.textContent = label;
        this.component.append(this.label, this.input)
        this.component.classList.add('file-input');
        this.input.type = 'file';
        this.dropCallbacks = [];

        if (type === FileInputType.DROP) {

            this.component.classList.add('zone');
            this.component.addEventListener('drop', (e) => this.processDrop(e));
            this.component.addEventListener('dragover', (e) => {
                this.component.classList.add('file-hover');
                e.preventDefault()
            });
            this.component.addEventListener('dragleave',
                () => this.component.classList.remove('file-hover')
            );
            this.component.addEventListener('dragend',
                () => this.component.classList.remove('file-hover')
            );
        }
    }

    addDropCallback(callback: Function) {
        this.dropCallbacks.push(callback);
    }

    processDrop(e: DragEvent) {
        this.input.files = e.dataTransfer.files;
        this.component.classList.remove('file-hover');
        this.component.classList.add('processing');
        for (let callback of this.dropCallbacks) {
            callback(e);
        }
        e.preventDefault();
    }

    clear() {
        // clear file input
    }
}