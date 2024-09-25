import generateUniqueId from "../idGenerator.js";
import AriaOption from "./AriaOption.js";

export default class Listbox extends Component implements ComponentItems {
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

        this.listbox = this.createListbox();

        this.items = options.map(o => new AriaOption(o));

        this.component = document.createElement('div');
        this.component.classList.add('listbox-container');
        this.component.append(
            this.label,
            this.listbox
        );
        this.listbox.append(
            ...this.items.map(i => i.component)
        );
    }

    private createListbox() {
        let listbox: HTMLDivElement = document.createElement('div');
        listbox.id = generateUniqueId();
        listbox.classList.add('listbox');
        listbox.setAttribute('aria-labelledby', this.label.id);
        listbox.setAttribute('role', 'listbox');
        return listbox;
    }

    render() {
        this.listbox.append(
            ...this.items.map(i => i.component)
        )
        return this.component;
    }
}