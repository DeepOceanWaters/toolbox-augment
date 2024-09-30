import generateUniqueId from "../idGenerator.js";
import Component from "./Component.js";

export default class InputLabelPair extends Component {
    input: HTMLInputElement;
    label: HTMLLabelElement;
    
    constructor() {
        super('div');
        this.label = document.createElement('label');
        this.input = document.createElement('input');
        this.input.id = generateUniqueId();
        this.label.htmlFor = this.input.id;
    }

    focus() {
        this.input.focus();
    }
}