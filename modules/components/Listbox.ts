import generateUniqueId from "../idGenerator";
import Option from "./Option";
import { classPrefix } from "../../data/prefixes";
import Filterable from "./Filterable";

interface listboxOptions {
    hideLabel: boolean
}

export default class Listbox extends HTMLDivElement {
    label: HTMLSpanElement;
    options: Filterable<Option>;
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
        this.listbox = this.createListbox(label);
        this.options = new Filterable(options.map(o => new Option(o)));

        this.append(
            this.label,
            this.listbox
        );
    }

    private createListbox(label: string) {
        let listbox: HTMLDivElement = document.createElement('div');
        listbox.classList.add('listbox');
        return listbox;
    }

    filter() {
        
    }
}