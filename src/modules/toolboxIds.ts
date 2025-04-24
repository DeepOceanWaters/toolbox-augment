export enum ToolboxIDs {
    PAGES = 'pages',
    SUCCESS_CRITERIA = 'success_criteria',
    STATES = 'audit_status',
    STATUS = 'status',
    ISSUE_DESCRIPTION = 'issue_description',
    SC_DESCRIPTION_EDITOR = 'editor1',
    RECOMMENDATION_EDITOR = 'editor2',
    SOFTWARE_USED = 'software_used',
    ASSISTIVE_TECH = 'assistive_tech',
    AUDITOR_NOTES = 'auditor_notes',
    TOOLBAR = 'toolbar'
}

export function getIssueDialog(): HTMLDivElement {
    let states = document.getElementById(ToolboxIDs.STATES);
    return states.closest('[role="dialog"]');
}

