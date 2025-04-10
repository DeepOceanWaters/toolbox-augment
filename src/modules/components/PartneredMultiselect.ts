import includesCaseInsensitive from "../includesCaseInsensitive.js";
import { spoofOptionSelected } from "../spoofUserInput.js";
import CheckboxWidget from "./Checkbox.js";
import CheckboxGroup from "./CheckboxGroup.js";


export default class PartneredCheckboxGroup extends CheckboxGroup {
    multiselect: HTMLSelectElement;

    constructor(multiselect: HTMLSelectElement) {
        let label = document.querySelector(`[for="${multiselect.id}"]`);
        let options = [...multiselect.querySelectorAll('option')];

        super(label.textContent, options.map(o => o.textContent));

        this.multiselect = multiselect;

        for (let checkbox of this.items) {
            let option = options.find(
                option => includesCaseInsensitive(
                    option.textContent, 
                    checkbox.textLabel.textContent
                )
            ) as HTMLOptionElement;

            let select = option.closest('select');
            checkbox.input.addEventListener('change', (e) => {
                if (select) spoofOptionSelected(select, option, checkbox.input.checked);
            });
        }
    }

    private getAssociatedCheckbox(option: HTMLOptionElement): CheckboxWidget | never {
        for (let checkbox of this.items) {
            if (option.textContent === checkbox.textLabel.textContent) {
                return checkbox;
            }
        }
        throw new Error(`Could not find associated chekcbox for: ${option.textContent}`);
    }

    realign() {
        for (let option of [...this.multiselect.options]) {
            let checkbox = this.getAssociatedCheckbox(option);
            checkbox.input.checked = option.selected;
        }
    }

    render() {
        this.realign();
        return super.render();
    }
}