export default class Fieldset extends Component implements ComponentItems {
    legend: HTMLLegendElement;
    visualLabel: HTMLSpanElement;
    items: Component[];

    constructor(label: string) {
        super('fieldset');
        let legend = document.createElement('legend');
        let visualLabel = document.createElement('span');
    
        visualLabel.textContent = label;
        visualLabel.setAttribute('aria-hidden', 'true');

        legend.textContent = label;
        legend.classList.add('sr-only');
        
        this.legend = legend;
        this.visualLabel = visualLabel;
        this.component.prepend(
            this.legend,
            this.visualLabel
        );
    }
}