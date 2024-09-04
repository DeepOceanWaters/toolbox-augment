/**
 * Toggle the selected value of a <select>'s <option>. Must be used
 * when changing toggling the value of a Vue component. Does so by
 * faking some events that the Vue component expects.
 * @param {HTMLSelectElement} select 
 * @param {HTMLOptionElement} optionToToggle 
 * @param {Boolean} selected
 */
export function spoofOptionSelected(select, optionToToggle, selected) {
    if (typeof selected === 'boolean') {
        optionToToggle.selected = selected;
    }
    else {
        optionToToggle.selected = !optionToToggle.selected;
    }
    let inputEvent = new Event('input', { composed: true, bubbles: true });
    let changeEvent = new Event('change', { bubbles: true });
    select.dispatchEvent(inputEvent);
    select.dispatchEvent(changeEvent);
}
/* FROM HTML SPEC:
When the user agent is to send select update notifications, queue an element task on the user interaction task source given the select element to run these steps:

Set the select element's user validity to true.
Fire an event named input at the select element, with the bubbles and composed attributes initialized to true.

Fire an event named change at the select element, with the bubbles attribute initialized to true.

The reset algorithm for a select element selectElement is:
*/

/**
 * Spoofs changing the value of a textarea element such that Vue elements will
 * properly update to the value.
 * @param {HTMLTextAreaElement} textarea 
 * @param {String} value 
 */
export function spoofUpdateTextareaValue(textarea, value) {
    let inputEvent = new Event('input', { composed: true, bubbles: true });
    textarea.value = value;
    textarea.dispatchEvent(inputEvent);
}

/**
 * Sets the value of the recommendations editor. Replaces current value.
 * @param {HTMLString} value a string that contains HTML
 * @param {Boolean} replace if true (default) replaces value, if false adds to current value
 */
export function setRecommendationsValue(value, replace = true) {
    let editor = document.getElementById('editor2');
    let clipboard = editor.querySelector('.ql-clipboard');
    if (replace) {
        editor.innerHTML = '';
    }
    clipboard.innerHTML = value;
    let pasteEvent = new ClipboardEvent('paste');
    editor.dispatchEvent(pasteEvent);
}