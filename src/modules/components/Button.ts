import Component from "./Component.js";

export default class CustomButton extends Component {
    button: HTMLButtonElement;
    
    constructor(label: string) {
        super();
        this.component.appendChild(this.button = document.createElement('button'));
        this.button.textContent = label;
    }

    focus() {
        this.button.focus();
    }
} 