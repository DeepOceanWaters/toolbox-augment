import makeButton from "./components/button.js";
import ShortcutManager from "./ShortcutManager.js";

let manager = new ShortcutManager();

let appDiv = document.getElementById('app');
let dialog = createShortcutDialog();

document.addEventListener('addedShortcut', (e) => {
    let shortcut = e.detail.shortcut;
    let tbody = dialog.querySelector('tbody');
    let newRow = createShortcutRow(shortcut);
    tbody.appendChild(newRow);
    console.log('added a new shortcut:');
    console.log(shortcut);
});

document.addEventListener('changeShortcut', (e) => {
    let shortcut = e.detail.shortcut;
    let row = dialog.querySelector(`tr[name="${shortcut.name}"`);
    if (!row) throw new Error("can't find row for shortcut: " + shortcut.name);
    let newRow = createShortcutRow(shortcut);
    row.parentElement.replaceChild(newRow, row);
});

manager.add(
    ["escape"],
    (e, context) => { 
        if (!dialog.open) {
            dialog.showModal();
            // the default will close our just-opened modal
            // if we allow it to default.
            e.preventDefault();
        }
    },
    {   
        name: 'Open Settings', 
        description: 'Opens the settings and keybindings dialog',
        throttle: 400
    }
);
document.body.prepend(dialog);


function createShortcutDialog() {
    let dialog = document.createElement('dialog');
    dialog.classList.add('shortcut-settings');
    
    // search: name, desc, keys
    // table of shorcuts
    let heading = document.createElement('h1');
    heading.textContent = 'Shortcuts and Keybindings';

    let closeBtn = makeButton('Close', '', {});

    let header = document.createElement('div');
    header.classList.add('header');
    header.append(heading, closeBtn);

    let searchForm = createSearch();

    let shorcutTable = createShortcutTable();

    dialog.append(
        header,
        searchForm,
        shorcutTable
    );
    return dialog;
}

function createSearch() {
    let form = document.createElement('form');
    form.setAttribute('role', 'search');
    form.setAttribute('aria-label', 'shortcuts');

    let input = document.createElement('input');
    input.type = 'search';
    input.id = 'shortcut-search';

    let label = document.createElement('label');
    label.textContent = 'Search Shortcuts';
    label.htmlFor = input.id;

    form.append(label, input);
    return form;
}

function createShortcutTable() {
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    // make thead
    // name, description, keys, edit
    let headings = ['edit', 'keys', 'name', 'description'];
    let row = document.createElement('tr');
    for(const heading of headings) {
        let th = document.createElement('th');
        th.scope = 'col';
        th.textContent = heading;
        row.appendChild(th);
    }
    thead.appendChild(row);
    // make tbody
    for(const shortcut of manager.shortcuts) {
        let row = createShortcutRow(shortcut);
        tbody.appendChild(row);
    }

    table.append(thead, tbody);
    return table;
}

function createShortcutRow(shortcut) {
    let row = document.createElement('tr');
    row.dataset.name = shortcut.name;
    // init column cells for this row
    // edit col
    let tdEdit = document.createElement('td');
    tdEdit.dataset.edit = '';
    // name col
    let tdName = document.createElement('td');
    tdName.dataset.name = '';
    // description col
    let tdDesc = document.createElement('td');
    tdDesc.dataset.description = '';
    // keys col
    let tdKeys = document.createElement('td');
    tdKeys.dataset.keys = '';

    // set the text content for each column based on shortcut
    // set name and description columns
    tdName.textContent = shortcut.name;
    tdDesc.textContent = shortcut.description;
    // set the keys column
    for(const key of shortcut.keys) {
        let kbd = document.createElement('kbd');
        kbd.textContent = key;
        tdKeys.appendChild(kbd);
        let span = document.createElement('span');
        span.textContent = ' + ';
        tdKeys.appendChild(span);
    }
    tdKeys.children[tdKeys.children.length - 1].remove();
    // set edit button column
    tdEdit.appendChild(createEditBtn(row, tdName));
    // append data cells to row
    row.append(tdEdit, tdKeys, tdName, tdDesc);
    // append completed row
    return row;
}

function createEditBtn(tr, tdName) {
    let btn = document.createElement('button');

    let editSpan = document.createElement('span');
    editSpan.textContent = 'Edit';

    let nameSpan = document.createElement('span');
    nameSpan.textContent = tdName.textContent;
    nameSpan.classList.add('sr-only');

    btn.append(editSpan, nameSpan);
    btn.classList.add('subtle');

    // TODO: add eventlistener to change keys
    return btn;
}