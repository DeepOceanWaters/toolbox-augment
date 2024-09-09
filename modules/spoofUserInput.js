/**
 * @callback SpoofOptionSelected the selected value of a <select>'s <option>. Must be used when changing toggling the value of a Vue component. Does so by faking some events that the Vue component expects.
 * @param {HTMLSelectElement} select 
 * @param {HTMLOptionElement} optionToToggle 
 * @param {Boolean} selected
 * 
 * @callback SpoofUpdateTextareaValue Spoofs changing the value of a textarea element such that Vue elements will
 * properly update to the value.
 * @param {HTMLTextAreaElement} textarea 
 * @param {String} value 
 * 
 * @callback SetRecommendationsValue Sets the value of the recommendations editor. Replaces current value.
 * @param {HTMLString} value a string that contains HTML
 * @param {Boolean} replace if true (default) replaces value, if false adds to current value
 * 
 * @callback SetQuillEditorText Sets the value of the passed quill editor. Replaces current value.
 * @param {HTMLDivElement} quillEditor [class="ql-editor"] quill editor
 * @param {String|HTMLElement} value value to add to quill editor
 * @param {Boolean} replace should replace current value?
 * @returns {Promise<Boolean>} returns true if successful, false otherwise. Promise resolves when focus can be moved again. Focus must be on the ql-editor for the paste event to succeed.
 */

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
    textarea.value += value;
    textarea.dispatchEvent(inputEvent);
}

/**
 * Sets the value of the passed quill editor. Replaces current value.
 * @param {HTMLDivElement} quillEditor [class="ql-editor"] quill editor
 * @param {String|HTMLElement} value value to add to quill editor
 * @param {Boolean} replace should replace current value?
 * @returns {Promise<Boolean>} returns true if successful, false otherwise. Promise resolves when focus can be moved again. Focus must be on the ql-editor for the paste event to succeed.
 */
export function setQuillEditorText(quillEditor, value, replace = true) {
    let currentlyFocused = document.activeElement;
    if (replace) {
        for(let i = 1; i < quillEditor.children.length; i++) {
            let child = quillEditor.children.item(i);
            if (isPartOfQuillEditor(child)) continue;
            child.remove();
        }
    }
    let clipboard = quillEditor.parentElement.querySelector('.ql-clipboard');
    clipboard.innerHTML = value;
    let pasteEvent = new ClipboardEvent('paste');
    quillEditor.focus();
    quillEditor.dispatchEvent(pasteEvent);
    return new Promise((resolve) => {
        setTimeout(() => {
            currentlyFocused.focus();
            resolve(quillEditor.textContent === value);
        }, 1);
    })
}

/**
 * 
 * @param {Node} element 
 * @returns {Boolean} is part of the quill editor
 */
function isPartOfQuillEditor(element) {
    return element.classList.contains('ql-clipboard') 
        || element.classList.contains('ql-tooltip');
}