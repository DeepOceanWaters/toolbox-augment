import generateUniqueId from "../idGenerator";

export default class Fieldset {
    fieldset: HTMLDivElement;
    legend: HTMLDivElement;

    constructor(label: string) {
        let fieldset = document.createElement('div');
        let legend = document.createElement('div');
    
        legend.textContent = label;
        fieldset.appendChild(legend);
    
        legend.id = generateUniqueId();
        fieldset.setAttribute('role', 'group');
        fieldset.setAttribute('aria-labelledby', legend.id);
        
        this.fieldset = fieldset;
        this.legend = legend;
    }
}