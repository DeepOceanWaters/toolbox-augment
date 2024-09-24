export default class AriaOption implements Widget {
    component: HTMLDivElement;
    label: HTMLSpanElement;

    constructor(label?: string) {
        this.component = document.createElement('div');
        this.component.role = 'option';
        this.component.setAttribute('aria-selected', 'false');
        this.component.tabIndex = -1;
        this.label = document.createElement('span');
        this.label.textContent = label || '';
    }

    /**
     * toggles the aria-selected attribute
     * @returns the new selected state
     */
    toggleSelection(): boolean {
        let selected = this.component.getAttribute('aria-selected') === 'true';
        this.setSelected(!selected);
        return !selected;
    }

    /**
     * set the aria-selected attribute
     */
    setSelected(selected: boolean): void {
        this.component.setAttribute('aria-selected', String(selected));
    }

    /**
     * 
     * @returns the current aria-selected state
     */
    getSelected(): boolean {
        return this.component.getAttribute('aria-selected') === 'true';
    }

    render() {
        return this.component;
    }
}