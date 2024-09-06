import generateUniqueId from "../idGenerator.js";

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
 * @typedef {Object} MultiselectExtraOptions
 * @property {String} instructions 
 */

/**
 * 
 * @param {String} label
 * @param {String[]} options 
 * @param {MultiselectExtraOptions} args 
 * @returns {FilterableMultiselect}
 */
export default function createFilterableMultiselect(label, options, args) {
    let filterBox = createMultiselectFilterTextBox(label);
    let checkboxes = createCheckboxList(options);
    let fieldset = createFieldset(label);
    let filterableCheckboxes = createFilterables(
        checkboxes, 
        (checkbox) => checkbox.label.textContent
    );
    addFilterEvents(filterBox, filterableCheckboxes);
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
 * @param {Number} throttle throttle filtering on input, milliseconds
 * @param {FilterCallback} filteringCallback
 * @return {Filterable[]} list of remaining filterables
 */
function addFilterEvents(filterBox, filterables, throttle = 300, filteringCallback) {
    filterBox.input.addEventListener('input', (e) => {
        let timeout = window[`${filterBox.input.id}-filtering`];
        if (timeout) {
            clearTimeout(timeout);
        }
        window[`${filterBox.input.id}-filtering`] = setTimeout(
            () => filter(filterBox, filterables, filteringCallback), 
            throttle
        );
    });
}

/**
 * Always returns full list when filterBox is empty.
 * @param {FilterBox} filterBox 
 * @param {Filterable[]} filterables 
 * @param {FilterCallback} filteringCallback 
 * @returns {Filterable[]} only items that returned true for filteringCallback
 */
function filter(filterBox, filterables, filteringCallback) {
    if (filterBox.input.value === '') {
        return filterables;
    }
    
    if (!filteringCallback) {
        filteringCallback = (filterable) => {
            debugger;
            let text = filterable.filterableText.toLowerCase();
            let filterBoxText = filterBox.input.value.toLowerCase();
            return text.includes(filterBoxText);
        }
    }
    return filterables.filter(filteringCallback);
}

/**
 * 
 * @param {any[]} items 
 * @param {ToFilterableTextCallback} toFilterableTextCallback
 */
function createFilterables(items, toFilterableTextCallback) {
    if (!toFilterableTextCallback) {
        throw new Error('Must include toFilterableTextCallback! None found!');
    }
    let filterables = [];
    for(let item of items) {
        filterables.push(toFilterableTextCallback(item))
    }
    return filterables
}

/* #endregion filtering */