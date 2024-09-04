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
 * @param {ToTextCallback} optionsToTextCallback
 * @returns {FilterableMultiselect}
 * 
 *  
 * @typedef {import("./filterableMultiselect.js").FilterableMultiselect} FilterableMultiselect
 */

/**
 * 
 * @param {String} label
 * @param {HTMLSelectElement} multiselect 
 * @param {ToTextCallback} optionsToTextCallback
 * 
 * @returns {FilterableMultiselect}
 */
export default function createPartneredMultiselect(label, multiselect, optionsToTextCallback) {
    let options = [...multiselect.querySelectorAll('option')];
    if (!optionsToTextCallback) { 
        optionsToTextCallback = (options) => options.map(o => o.textContent);
    }
    let filterableMultiselect = createFilterableMultiselect(
        label,
        optionsToTextCallback(options)
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