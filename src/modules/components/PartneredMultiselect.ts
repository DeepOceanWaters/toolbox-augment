import includesCaseInsensitive from "../includesCaseInsensitive.js";
import { spoofOptionSelected } from "../spoofUserInput.js";
import CheckboxWidget from "./Checkbox.js";
import CheckboxGroup from "./CheckboxGroup.js";
import FilterableCheckboxGroup from "./FilterableCheckbox.js";
import FilterabMultiselect from "./FilterableMultiselect.js";


export default class PartneredCheckboxGroup extends CheckboxGroup {
    multiselect: HTMLSelectElement;

    constructor(multiselect: HTMLSelectElement) {
        let label = document.querySelector(`[for="${multiselect.id}"]`);
        let options = [...multiselect.querySelectorAll('option')];

        super(options.map(o => o.textContent));

        this.multiselect = multiselect;

        for (let checkbox of this.items) {
            let option = options.find(
                option => includesCaseInsensitive(
                    option.textContent, 
                    checkbox.textLabel.textContent
                )
            ) as HTMLOptionElement;

            let select = option.closest('select');
            checkbox.pair.input.addEventListener('change', (e) => {
                if (select) spoofOptionSelected(select, option, checkbox.pair.input.checked);
            });
        }
    }

    private getAssociatedCheckbox(option: HTMLOptionElement): CheckboxWidget | never {
        for (let checkbox of this.items) {
            if (includesCaseInsensitive(option.textContent, checkbox.textLabel.textContent)) {
                return checkbox;
            }
        }
        throw new Error(`Could not find associated chekcbox for: ${option.textContent}`);
    }

    realign() {
        for (let option of [...this.multiselect.options]) {
            let checkbox = this.getAssociatedCheckbox(option);
            checkbox.pair.input.checked = option.selected;
        }
    }

    render() {
        this.realign();
        return super.render();
    }
}