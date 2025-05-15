import generateUniqueId from "../idGenerator.js";
import Component from "./Component.js";
import CustomButton from "./CustomButton.js";
import { IconType } from "./Icon.js";

type DisclosureOptions = {
    controller?: CustomButton,
    floats?: boolean,
    headingLevel?: (1|2|3|4|5|6),
}

export default class Disclosure extends Component {
    controller: CustomButton;
    controlled: HTMLDivElement;

    constructor(label: string, options?: DisclosureOptions) {
        super('div');
        this.controller = options.controller || this.createController(label);
        this.controlled = this.createControlled();
        this.addEventListeners();

        if (options?.headingLevel) {
            let heading = document.createElement(`h${options.headingLevel}`);
            heading.appendChild(this.controller.component);
            this.component.appendChild(heading);
        }
        else {
            this.component.appendChild(this.controller.component);
        }

        this.component.append(this.controlled);
        
        if (options?.floats) {
            this.component.classList.add('floating');
        }
        
        this.component.classList.add('disclosure');
        this.controller.component.classList.add('controller');
        this.controlled.classList.add('controlled');
    }

    private createController(label: string): CustomButton {
        let controller = new CustomButton(label);
        controller.component.id = generateUniqueId();
        controller.button.setAttribute('aria-expanded', 'false');
        return controller;
    }

    private createControlled(): HTMLDivElement {
        let section = document.createElement('div');
        section.hidden = true;
        return section;
    }

    private addEventListeners() {
        this.controller.button.addEventListener('click', (e) => {
            this.controlled.hidden = !this.controlled.hidden;
            this.controller.button.setAttribute(
                'aria-expanded', 
                String(!this.controlled.hidden)
            );
            e.preventDefault();
        });
    
        this.controlled.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            this.controller.button.click();
            this.controller.focus();
        });
    }
}