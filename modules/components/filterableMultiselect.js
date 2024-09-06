import generateUniqueId from "../idGenerator.js";
import includesCaseInsensitive from "../includesCaseInsensitive.js";

/**
 * @typedef {Object} InputLabelPair
 * @property {HTMLInputElement} input
 * @property {HTMLLabelElement} label
 * 
 * @typedef {InputLabelPair} CheckboxPair
 * 
 * @typedef {InputLabelPair} FilterBox
 * 
 * @typedef {Object} FieldSet
 * @property {HTMLFieldSetElement} fieldset
 * @property {HTMLLegendElement} legend
 * 
 * @typedef {Object} FilterableMultiselect
 * @property {FieldSet} fieldset
 * @property {FilterBox} filterBox
 * @property {CheckboxPair[]} checkboxes
 * 
 * @typedef {Object} Filterable
 * @property {any} item
 * @property {String} filterableText
 * 
 * @callback FilterCallback
 * @param {Filterable} filterable
 * @returns {Boolean} false items are filtered out
 * 
 * @callback ToFilterableTextCallback
 * @param {any} item
 * @returns {Filterable}
 * 
 * @callback FilterOutcomeCallback called when the outcome is determined
 * @param {Filterable} filterable item being checked
 * 
 * @typedef {Object} MultiselectExtraOptions
 * @property {String} instructions 
 */

/**
 * 
 * @param {String} label
 * @param {String[]} options 
 * @param {FilterOutcomeCallback} filterPositiveCallback called when item meets criteria
 * @param {FilterOutcomeCallback} filterNegativeCallback called when item does not meet criteria
 * @param {FilterCallback} filteringCallback determines if item meets criteria
 * @param {MultiselectExtraOptions} args 
 * @returns {FilterableMultiselect}
 */
export default function createFilterableMultiselect(label, options, filterPositiveCallback, filterNegativeCallback, filteringCallback, args) {
    let filterBox = createMultiselectFilterTextBox(label);
    let checkboxes = createCheckboxList(options);
    let fieldset = createFieldset(label);
    let filterableCheckboxes = createFilterables(
        checkboxes, 
        (checkbox) => checkbox.label.textContent
    );
    addFilterEvents(filterBox, filterableCheckboxes, filterPositiveCallback, filterNegativeCallback, filteringCallback);
    return { fieldset: fieldset, checkboxes: checkboxes, filterBox: filterBox };
}

/* #region create */

/**
 * 
 * @param {String} label 
 * @returns {FieldSet}
 */
function createFieldset(label) {
    let fieldset = document.createElement('fieldset');
    let legend = document.createElement('legend');
    legend.textContent = label;
    fieldset.appendChild(legend);
    return { fieldset: fieldset, legend: legend };
}

/**
 * Generates a filter text box
 * @param {String} label 
 * @returns {FilterBox}
 */
function createMultiselectFilterTextBox(label) {
    let inputLabel = document.createElement('label');
    inputLabel.textContent = `Filter ${label}`;

    let input = document.createElement('input');
    input.type = 'text';
    input.id = generateUniqueId();

    inputLabel.htmlFor = input.id;

    return { label: inputLabel, input: input };
}

/**
 * Generates a list of checkbox-label pairs.
 * @param {String[]} options 
 * @returns {CheckboxPair[]}
 */
function createCheckboxList(options) {
    let checkboxes = [];
    for (let option of options) {
        checkboxes.push(createCheckbox(option))
    }
    return checkboxes;
}

/**
 * Generates a checkbox-label pair based on a label.
 * @param {String} label 
 * @returns {CheckboxPair}
 */
function createCheckbox(label) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = generateUniqueId();

    let checkboxLabel = document.createElement('label');
    checkboxLabel.htmlFor = checkbox.id;
    checkboxLabel.textContent = label;

    return { label: checkboxLabel, input: checkbox };
}

/* #endregion  */

/* #region filtering */

/**
 * Filters filterable based on text input on filterbox.
 * @param {FilterBox} filterBox 
 * @param {Filterable[]} filterables
 * @param {FilterOutcomeCallback} filterPositiveCallback called when item meets criteria
 * @param {FilterOutcomeCallback} filterNegativeCallback called when item does not meet criteria
 * @param {FilterCallback} filteringCallback
 * @param {Number} throttle throttle filtering on input, milliseconds
 * @return {Filterable[]} list of remaining filterables
 */
function addFilterEvents(filterBox, filterables, filterPositiveCallback, filterNegativeCallback, filteringCallback, throttle = 10) {
    filterBox.input.addEventListener('input', (e) => {
        let timeout = window[`${filterBox.input.id}-filtering`];
        if (timeout) {
            clearTimeout(timeout);
        }
        window[`${filterBox.input.id}-filtering`] = setTimeout(
            () => filter(filterBox, filterables, filterPositiveCallback, filterNegativeCallback, filteringCallback), 
            throttle
        );
    });
}

/**
 * Always returns full list when filterBox is empty.
 * @param {FilterBox} filterBox 
 * @param {Filterable[]} filterables 
 * @param {FilterOutcomeCallback} filterPositiveCallback called when item meets criteria
 * @param {FilterOutcomeCallback} filterNegativeCallback called when item does not meet criteria
 * @param {FilterCallback} filteringCallback determines how to filter
 */
function filter(filterBox, filterables, filterPositiveCallback, filterNegativeCallback, filteringCallback) {
    if (filterBox.input.value === '') {
        filteringCallback = () => true;
    }
    
    if (!filteringCallback) {
        filteringCallback = (filterable) => includesCaseInsensitive(filterable.filterableText, filterBox.input.value);
    }
    for (let filterable of filterables) {
        if (filteringCallback(filterable)) {
            filterPositiveCallback(filterable);
        }
        else {
            filterNegativeCallback(filterable);
        }
    }
}

/**
 * 
 * @param {any[]} items 
 * @param {ToFilterableTextCallback} toFilterableTextCallback
 * @returns {Filterable[]}
 */
function createFilterables(items, toFilterableTextCallback) {
    if (!toFilterableTextCallback) {
        throw new Error('Must include toFilterableTextCallback! None found!');
    }
    let filterables = [];
    for(let item of items) {
        filterables.push({item: item, filterableText: toFilterableTextCallback(item)});
    }
    return filterables
}

/* #endregion filtering */