import generateUniqueId from "../idGenerator.js";
import { classPrefix } from "../../data/prefixes.js";
import MutableList from "./MutableList.js";
import AriaOption from "./AriaOption.js";

interface listboxOptions {
    hideLabel: boolean
}

export default class Listbox implements Widget {
    component: HTMLDivElement;
    label: HTMLSpanElement;
    options: MutableList<AriaOption>;
    listbox: HTMLDivElement;

    constructor(
        label: string, 
        options: string[], 
        { hideLabel = true }: { hideLabel?: boolean } 
    ) {
        this.label = document.createElement('span');
        this.label.textContent = label;
        this.label.id = generateUniqueId();
        if (hideLabel) this.label.classList.add('sr-only');

        this.listbox = this.createListbox();

        this.options = new MutableList(
            options.map(o => {
                let option = new AriaOption(o);
                option.component.tabIndex = -1;
                return option;
            })
        );

        this.component = document.createElement('div');
        this.component.classList.add('listbox-container');
        this.component.append(
            this.label,
            this.listbox
        );
        this.listbox.append(
            ...this.options.mutatedItems.map(i => i.render())
        )

        this.listbox.addEventListener('keydown', (e) => this.optionKeyRouter(e));
    }

    private createListbox() {
        let listbox: HTMLDivElement = document.createElement('div');
        listbox.id = generateUniqueId();
        listbox.classList.add('listbox');
        listbox.setAttribute('aria-labelledby', this.label.id);
        listbox.setAttribute('role', 'listbox');
        return listbox;
    }

    optionKeyRouter(e: KeyboardEvent) {
        let currentOption = e.target as unknown as AriaOption;
        // choose non-hidden options, and filter out any other options
        // that aren't visible
        let options = this.options.mutatedItems;
        let currentIndex = options.indexOf(currentOption);
        let nextFocus: AriaOption; 
        let nextIndex: number;
        let direction: -1 | 1;
        switch (e.key) {
            case 'ArrowDown':
                direction = 1;
                nextIndex = (currentIndex + 1);
            case 'ArrowUp':
                // if next index is set 
                // (aka arrow down was hit), don't set it
                direction ??= -1;
                nextIndex ??= (options.length + currentIndex - 1);
                nextIndex %= options.length;
                nextFocus = options[nextIndex];
                break;
            default:
                return;
        }
        e.preventDefault();
        nextFocus.component.focus();
    }

    render() {
        this.options.mutate();
        this.listbox.append(
            ...this.options.mutatedItems.map(i => i.render())
        )
        return this.component;
    }
}