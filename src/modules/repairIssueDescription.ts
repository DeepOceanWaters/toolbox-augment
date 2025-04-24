import { EditorType } from "../content-script-main.js";
import CustomButton from "./components/CustomButton.js";
import FileInput from "./components/FileInput.js";
import LiveRegion, { LiveRegionRoles } from "./components/LiveRegion.js";
import { spoofClickTableRow, spoofUpdateTextareaValue } from "./spoofUserInput.js";
import { getIssueDialog, ToolboxIDs } from "./toolboxIds.js";
import wait, { waitUntil } from "./wait.js";
import XLSX from '../../external_libraries/xlsx.mjs'
import { getAuditPages, getCurrentPage, getDeselectButton, getEditIssueButton, getFirstUUID, getIssuesTable, getSelectedIssueUUIDs } from "./auditPagination.js";

export function addPreviousAuditIssueDescription() {
    let repairIssueDescription = addUploadIssues();
    let dialog = makeDialog(repairIssueDescription.button);

    repairIssueDescription.button.addEventListener('click', () => {
        dialog.classList.add('fixed');
        dialog.classList.remove('hidden');
    });
}

function addUploadIssues() {
    let toolbar = document.getElementById(ToolboxIDs.TOOLBAR);
    let openAddIssueDescriptionDialog = new CustomButton('Add Missing Issue Descriptions');
    let lastChild = toolbar.children.item(0).children.item(
        toolbar.children.item(0).children.length - 1
    );
    lastChild.parentElement.insertBefore(openAddIssueDescriptionDialog.component, lastChild);
    return openAddIssueDescriptionDialog;
}

/**
 * Creates and appends the repair issues description dialog
 */
function makeDialog(opener: HTMLButtonElement): HTMLDivElement {
    let addDialog = getIssueDialog();
    let addIssueDescriptionDialog = addDialog.cloneNode() as HTMLDivElement;
    addIssueDescriptionDialog.style.zIndex = '150';
    addDialog.parentElement.insertBefore(addIssueDescriptionDialog, addDialog);
    let fileInput = new FileInput('Drag and Drop or Click to Upload Previous Audit');
    let liveRegion = new LiveRegion(LiveRegionRoles.STATUS);

    fileInput.input.addEventListener('change', (e) => {
        parsePreviousAudit(fileInput.input.files[0], liveRegion);
    });

    let instructions = 'Please upload a CSV file of the previous audit (Google Spreadsheet: file -> export -> CSV). When a file has been selected, the application will automatically begin to repair the issue description for this audit\'s issues.';
    
    let closeButton = 
        addDialog
        .querySelector('button[aria-label="Close add issue modal"]')
        .cloneNode() as HTMLButtonElement;
    closeButton.append('X');

    closeButton.addEventListener('click', () => {
        addIssueDescriptionDialog.classList.remove('fixed');
        addIssueDescriptionDialog.classList.add('hidden');
        opener.focus();
    });

    let main = copyDialog(addIssueDescriptionDialog) as HTMLDivElement;

    main.append(
        closeButton,
        instructions,
        fileInput.component,
        liveRegion.component
    );

    addIssueDescriptionDialog.classList.remove('fixed', 'hidden');
    addIssueDescriptionDialog.classList.add('hidden');

    return addIssueDescriptionDialog;
}

function copyDialog(dialog) {
    let addDialog = getIssueDialog();
    dialog.append(addDialog.children.item(0).cloneNode());
    dialog.children.item(0).append(
        ...[...addDialog.children.item(0).children].map(c => c.cloneNode())
    );
    let addDialogMain = addDialog.querySelector('.modal-main');
    let dialogMain = dialog.querySelector('.modal-main');
    let main = addDialogMain.children.item(0).cloneNode();
    dialogMain.appendChild(main);
    return main;
}


/**
 * Part of addPreviousAuditUpload()
 */
async function parsePreviousAudit(file: File, liveRegion: LiveRegion) {
    let fileArray = await file.arrayBuffer();
    let workbook = XLSX.read(fileArray, { dense: true });
    let previousAudit = workbook.Sheets[workbook.SheetNames[0]]["!data"];
    let visitedUUIDs = [];

    // setup current page
    visitedUUIDs.push(
        ...(await setupIssueDescription(previousAudit))
    );

    // if more than one page, setup rest of pages
    let pages = getAuditPages();
    if (pages) {
        let startPage = getCurrentPage();
        for (let page of pages.filter(p => p !== startPage)) {
            let selectedRows = 
                [...getIssuesTable().querySelectorAll('tr.selected')] as HTMLTableRowElement[];
            for(let row of selectedRows) {
                await spoofClickTableRow(row, () => !row.classList.contains('selected'));
            }
            page.click();
            let outcome = await waitUntil(
                () => !visitedUUIDs.map(span => span.textContent).includes(getFirstUUID()), 10
            );
            visitedUUIDs.push(
                ...(await setupIssueDescription(previousAudit))
            );
        }
    }

    let issuesRepaired = 0;

    return async (type: EditorType) => {
        if (type !== EditorType.EDIT) return;
        let editorOpen = await waitUntil(issueDialogIsOpen);
        if (!editorOpen) {
            throw new Error(`couldn't open editor`);
        }
        let issue = getPreviousAuditIssue(previousAudit);
        if (issue) {
            let issueDescription =
                document.getElementById(
                    ToolboxIDs.ISSUE_DESCRIPTION
                ) as HTMLTextAreaElement;
            let issueDescriptionColNum =
                previousAudit[0]
                    .findIndex(c => c.w.toLowerCase() === 'issue description');
            spoofUpdateTextareaValue(issueDescription, issue[issueDescriptionColNum]["v"]);
        }
        issuesRepaired++;
        liveRegion.clearQueue();
        liveRegion.queueMessage(`${issuesRepaired} issues repaired`);
    }
}



function getPreviousAuditIssue(previousAudit) {
    let currentIssue: { w, t, v }[] | null;
    let issueDescription =
        document.getElementById(
            ToolboxIDs.ISSUE_DESCRIPTION
        ) as HTMLTextAreaElement;
    if (issueDescription.value === '') {
        let UUIDs = getSelectedIssueUUIDs();
        if (UUIDs.length > 1) {
            throw new Error('multiple rows selected, cannot determine current issue');
        }
        currentIssue = previousAudit.find(row => row.find(cell => cell.w === UUIDs[0]));
    }
    return currentIssue;
}

async function setupIssueDescription(previousAudit) {
    let UIIDs =
        [...document.querySelectorAll('[data-key="issue_number"]')]
            .map(n => n.querySelector('span > span'));
    let issueDescriptionColNum =
        previousAudit[0]
            .findIndex(c => c.w.toLowerCase() === 'issue description');
    for (const UIID of UIIDs) {
        let row = previousAudit.find(
            r => r.some(c => c.w === UIID.textContent)
        );
        if (row) {
            let htmlRow = UIID.closest('tr');
            await spoofClickTableRow(
                htmlRow,
                (row: HTMLTableRowElement) => row.classList.contains('selected')
            );
            let edit = await getEditIssue();
            edit.click();

            let description =
                document.getElementById(
                    ToolboxIDs.ISSUE_DESCRIPTION
                ) as HTMLTextAreaElement;

            await waitUntil(issueDialogIsOpen);

            spoofUpdateTextareaValue(description, row[issueDescriptionColNum].v, true);
            let saveBtn =
                [...getIssueDialog().querySelectorAll('button')]
                    .find(b => b.textContent.trim().toLowerCase() === 'save');
            saveBtn.click();

            await spoofClickTableRow(
                htmlRow,
                (row: HTMLTableRowElement) => !row.classList.contains('selected')
            );
        }
    }
    return UIIDs;
}

async function getEditIssue() {
    let edit;
    await waitUntil(() => edit = getEditIssueButton());
    if (!edit) {
        throw new Error(`Edit Issue is not showing up.`);
    }
    return edit;
}

function issueDialogIsOpen() {
    let issueDialog = getIssueDialog();
    return issueDialog
        .getBoundingClientRect()
        .width > 0;
}