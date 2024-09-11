/**
 * @typedef {Object} Disclosure
 * @property {HTMLButtonElement} controller
 * @property {HTMLDivElement} controlled
 * @property {HTMLSpanElement} label
 */

/**
 * 
 * @param {String} label 
 * @returns {Disclosure}
 */
export default function createDisclosure(label) {
    /** @type {Disclosure} */
    let disclosure = {};
    [disclosure.controller, disclosure.label] = createController(label);
    disclosure.controlled = createControlled();
    addEventListeners(disclosure.controller, disclosure.controlled);
    return disclosure;
}

/**
 * 
 * @param {String} label 
 * @returns {[HTMLButtonElement, HTMLSpanElement]}
 */
function createController(label) {
    let controller = document.createElement('button');
    let labelSpan = document.createElement('span');
    controller.append(labelSpan);
    controller.setAttribute('aria-expanded', 'false');
    labelSpan.textContent = label;
    return [controller, labelSpan];
}

/**
 * @returns {HTMLDivElement}
 */
function createControlled() {
    let section = document.createElement('div');
    section.hidden = true;
    return section;
}

function addEventListeners(controller, controlled) {
    controller.addEventListener('click', (e) => {
        controlled.hidden = !controlled.hidden;
        controller.setAttribute('aria-expanded', !controlled.hidden);
        e.preventDefault();
    });
    

    controlled.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        controller.click();
        controller.focus();
    });
}