import createFilterableMultiselect from "./filterableMultiselect.js";
import includesCaseInsensitive from "../includesCaseInsensitive.js";
import { spoofOptionSelected } from "../spoofUserInput.js";

/**
 * @callback ToTextCallback
 * @param {HTMLOptionElement} option
 * @return {String}
 * 
 * @callback CreatePartneredMultiselect
 * @param {String} label
 * @param {HTMLSelectElement} multiselect 
 * @param {FilterOutcomeCallback} filterPositiveCallback called when item meets criteria
 * @param {FilterOutcomeCallback} filterNegativeCallback called when item does not meet criteria
 * @param {FilterCallback} filteringCallback determines if item meets criteria
 * @param {ToTextCallback} optionsToTextCallback
 * @returns {FilterableMultiselect}
 * 
 * 
 * @callback RealignPartneredMultiselect
 * @param {FilterableMultiselect} partneredMultiselect 
 * @param {HTMLSelectElement} multiselect
 * @returns {void}
 *  
 * @typedef {import("./filterableMultiselect.js").FilterableMultiselect} FilterableMultiselect
 * @typedef {import("./filterableMultiselect.js").FilterOutcomeCallback} FilterOutcomeCallback
 * @typedef {import("./filterableMultiselect.js").FilterCallback} FilterCallback
 */

/**
 * 
 * @param {String} label
 * @param {HTMLSelectElement} multiselect 
 * @param {FilterOutcomeCallback} filterPositiveCallback called when item meets criteria
 * @param {FilterOutcomeCallback} filterNegativeCallback called when item does not meet criteria
 * @param {FilterCallback} filteringCallback determines if item meets criteria
 * @param {Function} postFilterCallback
 * @param {ToTextCallback} optionsToTextCallback
 * @returns {FilterableMultiselect}
 */
export default function createPartneredMultiselect(
    label, 
    multiselect, 
    filterPositiveCallback, 
    filterNegativeCallback, 
    filteringCallback, 
    postFilterCallback, 
    optionsToTextCallback
) {
    let options = [...multiselect.querySelectorAll('option')];
    if (!optionsToTextCallback) { 
        optionsToTextCallback = (options) => options.map(o => o.textContent);
    }
    let filterableMultiselect = createFilterableMultiselect(
        label,
        optionsToTextCallback(options),
        filterPositiveCallback,
        filterNegativeCallback,
        filteringCallback,
        postFilterCallback,
        optionsToTextCallback
    );

    for (let checkbox of filterableMultiselect.checkboxes) {
        let option = options.find(
            option => includesCaseInsensitive(option.textContent, checkbox.label.textContent)
        );
        checkbox.input.addEventListener('change', (e) => {
            spoofOptionSelected(option.closest('select'), option, checkbox.checked);
        });
    }

    return filterableMultiselect;
}

/**
 * Sets the partnered multiselect's state to reflect the current multiselect's state. Used when the multiselect updates independently of the partneredMultiselect.
 * @param {FilterableMultiselect} partneredMultiselect 
 * @param {HTMLSelectElement} multiselect 
 */
export function realignPartneredMultiselect(partneredMultiselect, multiselect) {
    for (let option of [...multiselect.options]) {
        let checkboxPair = getAssociatedCheckbox(partneredMultiselect, option);
        checkboxPair.input.checked = option.selected;
    }
}

/**
 * 
 * @param {FilterableMultiselect} partneredMultiselect 
 * @param {HTMLOptionElement} option 
 * @returns {import("./filterableMultiselect.js").CheckboxPair}
 */
function getAssociatedCheckbox(partneredMultiselect, option) {
    for(let checkbox of partneredMultiselect.checkboxes) {
        if (includesCaseInsensitive(option.textContent, checkbox.label.textContent)) {
            return checkbox;
        }
    }
}