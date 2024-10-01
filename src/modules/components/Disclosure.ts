import generateUniqueId from "../idGenerator.js";
import Component from "./Component.js";

export default class Disclosure extends Component {
    controller: HTMLButtonElement;
    controlled: HTMLDivElement;
    controllerLabel: HTMLSpanElement;

    constructor(label: string) {
        super('div');
        [this.controller, this.controllerLabel] = this.createController(label);
        this.controlled = this.createControlled();
        this.addEventListeners();
    }

    private createController(label: string): [HTMLButtonElement, HTMLSpanElement] {
        let controller = document.createElement('button');
        controller.id = generateUniqueId();
        let labelSpan = document.createElement('span');
        controller.append(labelSpan);
        controller.setAttribute('aria-expanded', 'false');
        labelSpan.textContent = label;
        return [controller, labelSpan];
    }

    private createControlled(): HTMLDivElement {
        let section = document.createElement('div');
        section.setAttribute('aria-labelledby', this.controller.id);
        section.role = 'group';
        section.hidden = true;
        return section;
    }

    private addEventListeners() {
        this.controller.addEventListener('click', (e) => {
            this.controlled.hidden = !this.controlled.hidden;
            this.controller.setAttribute('aria-expanded', String(!this.controlled.hidden));
            e.preventDefault();
        });
    
        this.controlled.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            this.controller.click();
            this.controller.focus();
        });
    }

    render() {
        this.component.append(
            this.controller,
            this.controlled
        );
        return this.component;
    }
}