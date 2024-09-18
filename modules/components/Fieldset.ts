export default class Fieldset implements Widget {
    component: HTMLFieldSetElement;
    legend: HTMLLegendElement;
    visualLabel: HTMLSpanElement;

    constructor(label: string) {
        this.component = document.createElement('fieldset');
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
        this.component.prepend(
            this.legend,
            this.visualLabel
        );
        return this.component;
    }
}