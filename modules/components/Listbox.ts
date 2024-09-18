import generateUniqueId from "../idGenerator.js";
import Option from "./Option.js";
import { classPrefix } from "../../data/prefixes.js";
import MutableList from "./MutableList.js";

interface listboxOptions {
    hideLabel: boolean
}

export default class Listbox implements Widget {
    component: HTMLDivElement;
    label: HTMLSpanElement;
    options: MutableList<Option>;
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

        this.options = new MutableList(options.map(o => new Option(o)));

        this.component = document.createElement('div');
        this.component.classList.add(classPrefix);
        this.component.append(
            this.label,
            this.listbox
        );
    }

    private createListbox() {
        let listbox: HTMLDivElement = document.createElement('div');
        listbox.classList.add('listbox');
        listbox.setAttribute('aria-labelledby', this.label.id);
        return listbox;
    }

    render() {
        this.options.mutate();
        this.component.append(
            this.label,
            ...this.options.mutatedItems.map(i => i.render())
        );
        return this.component;
    }
}