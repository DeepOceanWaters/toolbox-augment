import generateUniqueId from "../idGenerator.js";
import AriaOption from "./AriaOption.js";
import Component, { HasItems } from "./Component.js";

export default class Listbox extends Component implements HasItems<Component> {
    label: HTMLSpanElement;
    items: AriaOption[];

    constructor(
        label: string, 
        options: string[], 
        args?: { hideLabel?: boolean }
    ) {
        super('div');
        this.label = document.createElement('span');
        this.label.textContent = label;
        this.label.id = generateUniqueId();
        if (!!(args?.hideLabel)) this.label.classList.add('sr-only');

        this.createListbox();

        this.items = options.map(o => new AriaOption(o));

        this.component.classList.add('listbox-container');
        this.component.append(
            this.label,
            ...this.items.map(i => i.component)
        );
    }

    private createListbox() {
        let listbox = this.component;
        listbox.id = generateUniqueId();
        listbox.classList.add('listbox');
        listbox.setAttribute('aria-labelledby', this.label.id);
        listbox.setAttribute('role', 'listbox');
    }

    update(): void {
        this.component.innerHTML = '';
        this.component.append(
            this.label,
            ...this.items.map(i => i.component)
        );
    }

    focus() {
        this.items[0].focus();
    }

    render() {
        this.component.append(
            ...this.items.map(i => i.component)
        )
        return this.component;
    }
}