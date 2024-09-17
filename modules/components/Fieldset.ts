import generateUniqueId from "../idGenerator";

export default class Fieldset extends HTMLFieldSetElement {
    legend: HTMLLegendElement;
    visualLabel: HTMLSpanElement;

    constructor(label: string) {
        super();
        let legend = document.createElement('legend');
        let visualLabel = document.createElement('span');
    
        visualLabel.textContent = label;
        legend.textContent = label;
        legend.classList.add('sr-only');


        
        this.legend = legend;
        this.visualLabel = visualLabel;
        this.render();
    }

    render() {
        this.prepend(
            this.legend,
            this.visualLabel
        );
        return this;
    }
}