
export function getPagination(): HTMLElement {
    return document.querySelector('nav[aria-label="pagination"]');
}

export function getAuditPages(): HTMLButtonElement[] {
    let pagination = getPagination();
    let buttons = pagination.querySelectorAll('button');
    let pageButtons = [...buttons].filter(b => !Number.isNaN(Number(b.textContent)));
    return pageButtons;
}

export function getCurrentPage(): HTMLButtonElement {
    let pagination = getPagination();
    let currentPageText = 
        pagination.querySelector('[aria-current="page"]') as HTMLSpanElement;
    let currentPage = currentPageText.closest('button');
    return currentPage;
}

export function getCurrentPageNumber(): Number {
    let page = getCurrentPage();
    return Number(page);
}

export function nextPage(): HTMLButtonElement {
    let paginationPages = getAuditPages();
    let currentPage = getCurrentPage();
    let index = paginationPages.indexOf(currentPage);
    let nextIndex = (index + 1 + paginationPages.length) % paginationPages.length;
    let nextPage = paginationPages[nextIndex];
    return nextPage;
}

export function getSelectedIssueUUIDs(): string[] {
    let table = getIssuesTable();
    let selectedRows = [...table.querySelectorAll('tr.selected')] as HTMLTableRowElement[];
    return selectedRows.map(r => getUUIDFromRow(r));
}

export function getUUIDFromRow(row: HTMLTableRowElement): string {
    let cell = row.querySelector('[data-key="issue_number"]');
    return cell.querySelector('span').textContent;
}

export function getIssuesTable(): HTMLTableElement {
    return document.querySelector('.issues-table');
}

export function getFirstUUID(): string {
    return getIssuesTable()
           .querySelector('[data-key="issue_number"] > span')
           .textContent;
}

export function getDeselectButton(): HTMLButtonElement {
    return document.querySelector('button[aria-label="Deselect All Rows"]');
}

export function getEditIssueButton(): HTMLButtonElement {
    return document.querySelector('button[title="Edit Issue"]');
}