/**
 * Toggle the selected value of a <select>'s <option>. Must be used
 * when changing toggling the value of a Vue component. Does so by
 * faking some events that the Vue component expects.
 * @param {HTMLSelectElement} select 
 * @param {HTMLOptionElement} optionToToggle 
 */
export default function toggleVueOptionSelected(select, optionToToggle) {
    optionToToggle.selected = !optionToToggle.selected;
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

export function updateVueTextareaValue(textarea, value) {
    let inputEvent = new Event('input', { composed: true, bubbles: true });
    textarea.value = value;
    textarea.dispatchEvent(inputEvent);
}

/**
 * Sets the value of the recommendations editor. Replaces current value.
 * @param {HTMLString} value a string that contains HTML
 */
export function setRecommendationsValue(value) {
    let clipboard = document.getElementById('editor2').querySelector('.ql-clipboard');
    el.innerHTML = '';
    clipboard.innerHTML = value;
    let pasteEvent = new ClipboardEvent('paste');
    el.dispatchEvent(pasteEvent);
}