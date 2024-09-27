import generateUniqueId from "../idGenerator.js";
import AriaOption from "./AriaOption.js";

export default class Listbox extends Component implements HasItems<Component> {
    label: HTMLSpanElement;
    items: AriaOption[];

    constructor(
        label: string, 
        options: string[], 
        { hideLabel = true }: { hideLabel?: boolean } 
    ) {
        super('div');
        this.label = document.createElement('span');
        this.label.textContent = label;
        this.label.id = generateUniqueId();
        if (hideLabel) this.label.classList.add('sr-only');

        this.createListbox();

        this.items = options.map(o => new AriaOption(o));

        this.component = document.createElement('div');
        this.component.classList.add('listbox-container');
        this.component.append(
            this.label,
            this.component
        );
        this.component.append(
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

    render() {
        this.component.append(
            ...this.items.map(i => i.component)
        )
        return this.component;
    }
}