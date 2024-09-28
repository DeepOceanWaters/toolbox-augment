import Checkbox from "./Checkbox.js";
import Fieldset from "./Fieldset.js";

export default class CheckboxGroup extends Fieldset {
    items: Checkbox[];
    
    constructor(label:string, checkboxes: Checkbox[] | string[]) {
        super(label);
        if (checkboxes.length <= 0) { 
            throw new Error("Cannot initialize CheckboxGroup with empty array.");
        }
        if (typeof checkboxes[0] === 'string') {
            for(let name of checkboxes as string[]) {
                this.items.push(new Checkbox(name));
            }
        }
        else {
            this.items = checkboxes as Checkbox[];
        }
    }

    update(): void {
        this.component.append(
            ...this.items.map(i => i.component)
        );
        super.update();
    }
}