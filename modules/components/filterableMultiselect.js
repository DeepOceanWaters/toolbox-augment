import generateUniqueId from "../idGenerator.js";
import includesCaseInsensitive from "../includesCaseInsensitive.js";
import createCheckboxComponent from "./checkbox.js";

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
 * @property {ShowOnlyCheckbox} showOnlyCheckbox 
 * @property {Filterable[]} filterableCheckboxes
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
 * @param {Callback} postFilterCallback
 * @param {MultiselectExtraOptions} args 
 * @returns {FilterableMultiselect}
 */
export default function createFilterableMultiselect(
    label,
    options,
    filterPositiveCallback,
    filterNegativeCallback,
    filteringCallback,
    postFilterCallback,
    args) {
    let filterBox = createMultiselectFilterTextBox(label);
    let checkboxes = createCheckboxList(options);
    let fieldset = createFieldset(label);
    let filterableCheckboxes = createFilterables(
        checkboxes,
        (checkbox) => checkbox.label.textContent
    );
    
    let filterableMultiselect = {
        fieldset: fieldset,
        checkboxes: checkboxes,
        filterBox: filterBox,
        filterableCheckboxes: filterableCheckboxes
    };
    let showOnly = createShowOnly(filterableMultiselect);
    filterableMultiselect.showOnlyCheckbox = showOnly;
    addFilterEvents(
        filterableMultiselect,
        filterPositiveCallback,
        filterNegativeCallback,
        filteringCallback,
        postFilterCallback
    );
    return filterableMultiselect;
}

/* #region create */

/**
 * 
 * @param {String} label 
 * @returns {FieldSet}
 */
function createFieldset(label) {
    let fieldset = document.createElement('div');
    let legend = document.createElement('div');

    legend.textContent = label;
    fieldset.appendChild(legend);

    legend.id = generateUniqueId();
    fieldset.setAttribute('role', 'group');
    fieldset.setAttribute('aria-labelledby', legend.id);
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
 * @param {FilterableMultiselect} filterableMultiselect
 * @param {FilterOutcomeCallback} filterPositiveCallback called when item meets criteria
 * @param {FilterOutcomeCallback} filterNegativeCallback called when item does not meet criteria
 * @param {FilterCallback} filteringCallback
 * @param {Function} postFilterCallback
 * @param {Number} throttle throttle filtering on input, milliseconds
 * @return {Filterable[]} list of remaining filterables
 */
function addFilterEvents(
    filterableMultiselect,
    filterPositiveCallback,
    filterNegativeCallback,
    filteringCallback,
    postFilterCallback,
    throttle = 10
) {
    filterableMultiselect.filterBox.input.addEventListener('input', (e) => {
        let timeout = window[`${filterableMultiselect.filterBox.input.id}-filtering`];
        if (timeout) {
            clearTimeout(timeout);
        }
        window[`${filterableMultiselect.filterBox.input.id}-filtering`] = setTimeout(
            () => filter(filterableMultiselect, filterPositiveCallback, filterNegativeCallback, filteringCallback, postFilterCallback),
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
 * @param {Callback} postFilterCallback
 */
function filter(filterableMultiselect, filterPositiveCallback, filterNegativeCallback, filteringCallback, postFilterCallback) {
    if (filterableMultiselect.filterBox.input.value === '') {
        filteringCallback = () => true;
    }

    if (!filteringCallback) {
        filteringCallback = (filterable) => includesCaseInsensitive(filterable.filterableText, filterableMultiselect.filterBox.input.value);
    }
    let positiveMatches = [];
    let negativeMatches = [];
    for (let filterable of filterableMultiselect.filterableCheckboxes) {
        if (filteringCallback(filterable)) {
            filterPositiveCallback(filterable);
            positiveMatches.push(filterable);
        }
        else {
            filterNegativeCallback(filterable);
            negativeMatches.push(filterable);
        }
    }
    postFilterCallback(positiveMatches, negativeMatches);
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
    for (let item of items) {
        filterables.push({ item: item, filterableText: toFilterableTextCallback(item) });
    }
    return filterables;
}

/* #endregion filtering */

/**
 * 
 * @param {FilterableMultiselect} filterableMultiselect 
 */
export function addKeyboardNavigation(filterableMultiselect) {
    // remove all but first item from focus order
    for(let [index, filterableCheckbox] of filterableMultiselect.filterableCheckboxes.entries()) {
        if (index === 0) continue;
        filterableCheckbox.item.input.tabIndex = -1;
    }
    // add event listeners
    filterableMultiselect.filterBox.input.addEventListener('keydown', (e) => filterBoxKeydownHandler(e, filterableMultiselect))
    for (let filterableCheckbox of filterableMultiselect.filterableCheckboxes) {
        filterableCheckbox.item.input.addEventListener('keydown', (e) => {
            checkboxKeydownHandler(e, filterableCheckbox, filterableMultiselect.filterableCheckboxes);
        });
    }
}

/**
 * 
 * @param {FilterableMultiselect} filterableMultiselect 
 * @param {KeyboardEvent} e 
 */
function filterBoxKeydownHandler(e, filterableMultiselect) {
    if (e.key !== 'ArrowDown') return;
    filterableMultiselect.checkboxes.find(inputPair => inputPair.input.tabIndex === 0).input.focus();
    e.preventDefault();
}

function checkboxKeydownHandler(e, filterableCheckbox, filterableCheckboxes) {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
    let direction = 1;
    if (e.key === 'ArrowUp') direction = -1;
    let curIndex = filterableCheckboxes.indexOf(filterableCheckbox);
    let nextIndex = (curIndex + filterableCheckboxes.length + direction) % filterableCheckboxes.length;
    let nextFilterableCheckbox = filterableCheckboxes[nextIndex];
    filterableCheckbox.item.input.tabIndex = -1;
    nextFilterableCheckbox.item.input.tabIndex = 0;
    nextFilterableCheckbox.item.input.focus();
    e.preventDefault();
}


function createShowOnly(filterableMultiselect) {
    let showOnly = createCheckboxComponent('Only Selected ' + filterableMultiselect.fieldset.legend.textContent);
    showOnly.checkbox.addEventListener('change', (e) => {
        let firstShowingCheckbox;
        for (let checkboxPair of filterableMultiselect.checkboxes) {
            // if we want to only show checked checkboxes
            if (showOnly.checkbox.checked) {
                checkboxPair.input.parentElement.hidden = !checkboxPair.input.checked;
                if (!firstShowingCheckbox && !checkboxPair.input.hidden) {
                    firstShowingCheckbox = checkboxPair.input;
                }
                else {
                    checkboxPair.input.tabIndex = -1;
                }
            }
            // if we want to show all checkboxes
            else {
                checkboxPair.input.parentElement.hidden = false;
                if (!firstShowingCheckbox) {
                    firstShowingCheckbox = checkboxPair.input;
                }
                else {
                    checkboxPair.input.tabIndex = -1;
                }
            }
        }
        firstShowingCheckbox.tabIndex = 0;
    });
    return showOnly;
}