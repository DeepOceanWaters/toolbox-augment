import Checkbox from "./Checkbox";
import Fieldset from "./Fieldset";

export default class CheckboxGroup extends Fieldset {
    constructor(checkboxes: Checkbox[] | string[]) {
        super('fieldset');
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
}