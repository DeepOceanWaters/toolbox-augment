import generateUniqueId from "../idGenerator.js";
import InputLabelPair from "./InputLabelPair.js";

export default class BlankPair extends InputLabelPair {
    description: HTMLSpanElement;

    constructor(label: string, options?: {description?: string}) {
        super();

        this.component.classList.add('input-section', 'blank-pair');
        // set up description
        this.description = document.createElement('p');
        this.description.classList.add('post', 'note');
        this.description.id = generateUniqueId();
        this.input.setAttribute('aria-describedby', this.description.id);
        
        if (!options?.description) {
            this.description.hidden = true;
        }
        
        this.component.append(
            this.label,
            this.input,
            this.description
        );
    }

    updateDescription(text: string) {
        this.description.textContent = text;
    }
}