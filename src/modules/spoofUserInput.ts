
export function spoofOptionSelected(select: HTMLSelectElement, optionToToggle: HTMLOptionElement, selected: boolean): void {
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

/**
 * Spoofs changing the value of a textarea element such that Vue elements will
 * properly update to the value.
 * @param {HTMLTextAreaElement} textarea 
 * @param {String} value 
 */
export function spoofUpdateTextareaValue(textarea: HTMLTextAreaElement | HTMLInputElement, value: string, replace = false): void {
    let inputEvent = new Event('input', { composed: true, bubbles: true });
    if (replace) textarea.value = '';
    if (textarea.value) textarea.value += '\n';
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
export function setQuillEditorText(quillEditor: HTMLElement, paragraphs: string[], replace: boolean = true): Promise<void> {
    let currentlyFocused = document.activeElement as HTMLElement;
    let emptyChild = quillEditor.children.item(0);
    if (emptyChild?.innerHTML === '<br>') emptyChild.innerHTML = '&nbsp';
    let values: string[] = [];
    let foundRealValue = false;
    for (let i = 0; i < quillEditor.children.length; i++) {
        let child = quillEditor.children.item(i);
        let tag = child!.tagName.toLowerCase();
        let isNewline = !foundRealValue && tag === 'div' && (child!.innerHTML === '<br>' || child!.innerHTML === '&nbsp;');
        if (!isNewline) {
            values.push(child!.innerHTML);
            foundRealValue = true;
        }

    }
    [...quillEditor.children].forEach(c => c.remove());
    values = unsplit(values, '<br>').map(group => group.join('<br>'));
    if (values.length === 1 && values[0] === '') {
        values = [];
    }
    values.push(...paragraphs);
    let clipboard = quillEditor.parentElement!.querySelector('.ql-clipboard');
    clipboard!.innerHTML = values.map(v => `<div>${v}</div>`).join('<div><br></div>');
    let pasteEvent = new ClipboardEvent('paste');
    quillEditor.focus();
    quillEditor.dispatchEvent(pasteEvent);
    return new Promise((resolve) => {
        setTimeout(() => {
            if (currentlyFocused) currentlyFocused.focus();
            resolve();
        }, 1);
    })
}


function unsplit(arr: string[], unsplitter: string): string[][] {
    let outputArr: string[][] = [];
    let curVal: string[] = [];
    for (let item of arr) {
        if (item === unsplitter) {
            outputArr.push(curVal);
            curVal = [];
        }
        else {
            curVal.push(item);
        }
    }
    if (!outputArr.includes(curVal)) outputArr.push(curVal);
    return outputArr;
}

type Resolver = (resolve: Function) => void;

export async function getNextTestingSoftware(
    text: string, 
    len: number = null, 
    numAttempts: number = 0
): Promise<[HTMLInputElement, HTMLButtonElement] | null> {
    numAttempts++;
    let label = document.querySelector('[for="browser_combos"]');
    let inputs = label.querySelectorAll('input');

    if (len === null) {
        let addCombo = 
            [...label.parentElement.parentElement.querySelectorAll('button')]
            .find(btn => btn.textContent === 'Add Combo');
        addCombo.click();
        len = [...inputs].length;
    }

    let resolver: Resolver;
    if (numAttempts > 100) {
        console.log('too many attemps');
        resolver = (resolve) => resolve(null);
    }
    else if (inputs.length > len) {
        resolver = (resolve) => {
            let newInput = inputs.item(inputs.length - 1);
            let newDelete = label.querySelectorAll('button').item(inputs.length - 1);
            resolve([newInput, newDelete]);
        }
    }
    else {
        resolver = (resolve) => {
            setTimeout(async () => resolve(await getNextTestingSoftware(text, len, numAttempts)), 1);
        }
    }

    return new Promise((resolve) => resolver(resolve));
}


/**
 * Gets the next resource input element. If no empty resource 
 * input elements exists, clicks the "add resource" button,
 * waits just a little for the events to resolve, and returns 
 * the next resouce.
 * NOTE: click() executes events synchronously, so using promises
 * with timeouts probably isn't necessary. Will want to change in
 * the future.
 * @returns promise returning the next resource input
 */
export async function getNextResource(): Promise<HTMLInputElement> {
    let resources: NodeListOf<HTMLInputElement> =
        document.querySelectorAll('input[name="resources"]');
    let resource = [...resources].find(r => r.value.trim() === '');
    let resolver: Resolver;
    if (resource) {
        resolver = (resolve) => resolve(resource);
    }
    else {
        resolver = (resolve) => {
            setTimeout(async () => resolve(await getNextResource()), 1);
        }
        let addResource: HTMLButtonElement =
            resources
            .item(0)
            .parentElement
            .querySelector(':scope > button');
        addResource.click();
    }
    return new Promise((resolve) => resolver(resolve));
}

export function spoofClickTableRow(row: HTMLTableRowElement) {
    let event = new Event('mousedown', { bubbles: true}); 
    row.dispatchEvent(event); 
    event = new Event('mouseup', {bubbles: true}); 
    row.dispatchEvent(event);
}