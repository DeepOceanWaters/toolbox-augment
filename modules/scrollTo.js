export function scrollTo(index, id) {
    let target;
    let rows = [...document.querySelectorAll('tbody tr')];
    if (id) {
        target = document.querySelector(`[data-key="${id}"`);
    }
    else {
        if (index === 0) index = 1;
        // account for later pages where the number is above 100
        index %= 100;
        target = rows[index - 1];
        target ??= rows.at(index - 1);
    }

    highlightRow(target);
    target.focus();
    target.scrollTo();
}

function highlightRow(row) {
    let highlightedRows = document.querySelectorAll('[data-scrolled-to-row]');
    [...highlightedRows].forEach(e => delete e.dataset.scrolledToRow);

    row.dataset.scrolledToRow = 'true';
}

export function getSelectedRow() {
    let index, id;

    let targetRow = document.activeElement;
    // while not tr, body, or html, get a parent element that is one of those.
    targetRow = curTarget.closest('tr');
    targetRow ??= document.querySelector('tr.selected');
    if (targetRow) {
        let idCell = targetRow.querySelector('td[data-key="id"]');
        id = idCell.dataset.key;
    }
    // tbody is used to filter out the column headers
    let rows = [...document.querySelectorAll('tbody tr')];
    index = rows.indexOf(targetRow);
    // account for zero-index
    index = index === -1 ? rows.length : index + 1;
    return [index, id];
}