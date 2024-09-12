import FilterableMultiselect from "./filterableMultiselect.ts";
import includesCaseInsensitive from "../includesCaseInsensitive.ts";
import { spoofOptionSelected } from "../spoofUserInput.ts";
import CheckboxWidget from "./CheckboxWidget.ts";

export default function partnerFilterableMultiselectAndSelect(
    filterableMultiselect: FilterableMultiselect,
    multiselect: HTMLSelectElement,
) {
    let options = [...multiselect.querySelectorAll('option')];

    for (let checkboxWidget of filterableMultiselect.checkboxes) {
        let option = options.find(
            option => includesCaseInsensitive(option.textContent || '', checkboxWidget.textLabel.textContent || '')
        ) as HTMLOptionElement;


        let select = option.closest('select');
        checkboxWidget.checkbox.addEventListener('change', (e) => {
            if (select) spoofOptionSelected(select, option, checkboxWidget.checkbox.checked);
        });
    }
}

/**
 * Sets the partnered multiselect's state to reflect the current multiselect's state. Used when the multiselect updates independently of the partneredMultiselect.
 * @param {FilterableMultiselect} partneredMultiselect 
 * @param {HTMLSelectElement} multiselect 
 */
export function realignPartneredMultiselect(filterableMultiselect: FilterableMultiselect, multiselect: HTMLSelectElement): void {
    for (let option of [...multiselect.options]) {
        let checkboxWidget = getAssociatedCheckbox(filterableMultiselect, option);
        if (checkboxWidget) {
            checkboxWidget.checkbox.checked = option.selected;
        }
        else {
            throw new Error("couldn't find associated checkbox");
        }
    }
}

/**
 * 
 * @param {FilterableMultiselect} partneredMultiselect 
 * @param {HTMLOptionElement} option 
 * @returns {import("./filterableMultiselect.js").CheckboxPair}
 */
function getAssociatedCheckbox(filterableMultiselect: FilterableMultiselect, option: HTMLOptionElement): CheckboxWidget | null {
    for (let checkboxWidget of filterableMultiselect.checkboxes) {
        if (includesCaseInsensitive(option.textContent || '', checkboxWidget.textLabel.textContent || '')) {
            return checkboxWidget;
        }
    }
    return null;
}