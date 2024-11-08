import generateUniqueId from "../idGenerator.js";
import Component from "./Component.js";

export default class BasicSelect extends Component {
    select: HTMLSelectElement;
    label: HTMLLabelElement;

    constructor(label: string, options: string[]) {
        super();
        this.select = document.createElement('select');
        this.select.id = generateUniqueId();
        this.select.append(
            ...options.map(o => {
                let opt = document.createElement('option');
                opt.textContent = opt.value = o;
                return opt;
            })
        );

        this.label = document.createElement('label');
        this.label.htmlFor = this.select.id;
        this.label.textContent = label;
        this.component.append(
            this.label,
            this.select
        );
    }
}