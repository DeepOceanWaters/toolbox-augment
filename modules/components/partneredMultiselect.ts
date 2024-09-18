import includesCaseInsensitive from "../includesCaseInsensitive.js";
import { spoofOptionSelected } from "../spoofUserInput.js";
import CheckboxWidget from "./CheckboxWidget.js";
import FilterabMultiselect from "./FilterableMultiselect.js";


export default class PartneredMultiselect extends FilterabMultiselect {
    multiselect: HTMLSelectElement;

    constructor(multiselect: HTMLSelectElement) {
        let label = document.querySelector(`[for="${multiselect.id}"]`);
        let options = [...multiselect.querySelectorAll('option')];

        super(label.textContent, options.map(o => o.textContent));

        this.multiselect = multiselect;

        for (let checkboxWidget of this.checkboxWidgets.originalItems) {
            let option = options.find(
                option => includesCaseInsensitive(
                    option.textContent, 
                    checkboxWidget.textLabel.textContent
                )
            ) as HTMLOptionElement;

            let select = option.closest('select');
            checkboxWidget.checkbox.addEventListener('change', (e) => {
                if (select) spoofOptionSelected(select, option, checkboxWidget.checkbox.checked);
            });
        }
    }

    realign() {
        for (let option of [...this.multiselect.options]) {
            let checkboxWidget = this.getAssociatedCheckbox(option);
            checkboxWidget.checkbox.checked = option.selected;
        }
    }

    private getAssociatedCheckbox(option: HTMLOptionElement): CheckboxWidget | never {
        for (let checkboxWidget of this.checkboxWidgets.originalItems) {
            if (includesCaseInsensitive(option.textContent, checkboxWidget.textLabel.textContent)) {
                return checkboxWidget;
            }
        }
        throw new Error(`Could not find associated chekcbox for: ${option.textContent}`);
    }

    render() {
        this.realign();
        return super.render();
    }
}