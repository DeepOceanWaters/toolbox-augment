import generateUniqueId from "../idGenerator.js";

/**
 * @typedef {Object} CheckboxComponent
 * @property {HTMLLabelElement} component the html element to add to the webpage
 * @property {HTMLSpanElement} textLabel the element that contains the label's text
 * @property {HTMLInputElement} checkbox the input element
 * 
 * 
 * @typedef {Object} CreateCheckboxExtraOptions
 * @property {HTMLInputElement} input
 * @property {HTMLLabelElement} label
 * @property {Boolean} checked
 */
/**
 * 
 * @param {String} text text to label checkbox
 * @param {CreateCheckboxExtraOptions} args extra arguments
 * @returns {CheckboxComponent}
 */
export default function createCheckboxComponent(text, args) {
    let input = args.input || createInput();
    let [label, spanLabel] = args.label ? createLabelFromElement(args.label, input) : createLabel(text, input);
    label.append(input, spanLabel);
    return { component: label, textLabel: spanLabel, checkbox: input };
}

function createInput() {
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.id = generateUniqueId();
    return input;
}

function createLabel(text, input) {
    let label = document.createElement('label');
    label.textContent = text;
    return createLabelFromElement(label, input);
}

/**
 * 
 * @param {HTMLLabelElement} label 
 * @param {HTMLInputElement} input 
 */
function createLabelFromElement(label, input) {
    input.id ??= generateUniqueId();
    label.htmlFor = input.id;
    label.classList.add('chkbox-pair');

    let spanLabel = createLabelSpanElement(label.textContent);
    label.textContent = '';
    return [label, spanLabel];
}

function createLabelSpanElement(text) {
    let span = document.createElement('span');
    span.textContent = text;
    return span;
}