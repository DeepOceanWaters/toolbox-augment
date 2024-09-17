import generateUniqueId from "../idGenerator";
import Option from "./Option";
import { classPrefix } from "../../data/prefixes";
import MutableList from "./MutableList";

interface listboxOptions {
    hideLabel: boolean
}

export default class Listbox extends HTMLDivElement {
    label: HTMLSpanElement;
    options: MutableList<Option>;
    listbox: HTMLDivElement;

    constructor(
        label: string, 
        options: string[], 
        { hideLabel = true }: { hideLabel?: boolean } 
    ) {
        super();
        this.classList.add(classPrefix);
        this.label = document.createElement('span');
        this.label.id = generateUniqueId();
        if (hideLabel) this.label.classList.add('sr-only');
        this.listbox = this.createListbox(label);
        this.options = new MutableList(options.map(o => new Option(o)));

        this.append(
            this.label,
            this.listbox
        );
    }

    private createListbox(label: string) {
        let listbox: HTMLDivElement = document.createElement('div');
        listbox.classList.add('listbox');
        listbox.setAttribute('aria-labelledby', this.label.id);
        return listbox;
    }

    render() {
        this.options.mutate();
        this.append(
            this.label,
            ...this.options.mutatedItems
        );
    }
}