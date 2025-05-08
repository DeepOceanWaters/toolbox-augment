import Component from "./Component.js";
import Icon, { IconType } from "./Icon.js";

export default class CustomButton extends Component {
    button: HTMLButtonElement;
    textLabel: HTMLSpanElement;
    iconLabel: Icon;
    
    constructor(label: string, iconType?: IconType, iconOnly: boolean = false) {
        super();
        this.component.appendChild(this.button = document.createElement('button'));

        if (iconType) {
            this.iconLabel = new Icon(iconType);
            this.button.append(this.iconLabel.component);
        }

        this.textLabel = document.createElement('span');
        this.textLabel.textContent = label;
        if (iconOnly) {
            this.textLabel.classList.add('sr-only');
        }
        this.button.append(this.textLabel);
    }

    focus() {
        this.button.focus();
    }
} 