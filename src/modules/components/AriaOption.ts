import Component from "./Component.js";

export default class AriaOption extends Component {
    component: HTMLDivElement;
    label: HTMLSpanElement;

    constructor(label: string) {
        super('div');
        this.component.role = 'option';
        this.component.tabIndex = -1;

        this.label = document.createElement('span');
        this.label.textContent = label;

        this.component.appendChild(this.label);
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

    private setSelected(selected: boolean) {
        if (selected) {
            this.component.setAttribute('aria-selected', String(selected));
        }
        else {
            this.component.removeAttribute('aria-selected');
        }
    }

    set selected(selected: boolean) {
        this.setSelected(selected);
    }

    get selected(): boolean {
        return this.component.getAttribute('aria-selected') === 'true';
    }

    render() {
        return this.component;
    }
}