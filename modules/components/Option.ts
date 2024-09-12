export default class Option extends HTMLDivElement {
    label: HTMLSpanElement;

    constructor(label?: string) {
        super();
        this.role = 'option';
        this.setAttribute('aria-selected', 'false');
        this.label = document.createElement('span');
        this.label.textContent = label || '';
    }

    /**
     * toggles the aria-selected attribute
     * @returns the new selected state
     */
    toggleSelection(): boolean {
        let selected = this.getAttribute('aria-selected') === 'true';
        this.setSelected(!selected);
        return !selected;
    }

    /**
     * set the aria-selected attribute
     */
    setSelected(selected: boolean): void {
        this.setAttribute('aria-selected', String(selected));
    }

    /**
     * 
     * @returns the current aria-selected state
     */
    getSelected(): boolean {
        return this.getAttribute('aria-selected') === 'true';
    }
}