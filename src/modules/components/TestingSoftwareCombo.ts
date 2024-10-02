import CheckboxGroup from "./CheckboxGroup";
import Component from "./Component";
import List from "./List";
import Span from "./Span";

type HeadingLevel = 1|2|3|4|5|6;

export default class TestingSoftwareCombo extends Component {
    heading: HTMLHeadingElement;
    software: CheckboxGroup;
    assistiveTech: CheckboxGroup;
    output: List;
    private inputIdentifier: string;

    constructor(
        position: number, 
        software: string[], 
        assistiveTech: string[], 
        args?: {
            headingLevel?: HeadingLevel
        }
    ) {
        let label = `Testing Software Combo ${position}`;
        super('div');

        this.inputIdentifier = label;

        let headingLevel = args?.headingLevel || 3;
        this.heading = document.createElement(`h${headingLevel}`);
        this.heading.textContent = label;

        this.software = new CheckboxGroup('Software', software);
        this.assistiveTech = new CheckboxGroup('Assistive Technology', assistiveTech);
        this.output = new List();

        this.component.addEventListener('change', (e) => this.update());
    }

    update() {
        this.output.items = [];
        for(let btn of document.querySelectorAll(`button[data-combo-identifier="${this.inputIdentifier}"]`)) {
            (btn as HTMLButtonElement).click();
        }
        for(let softwareCheckbox of this.software.items) {
            for(let assistiveTechCheckbox of this.assistiveTech.items) {
                let software = softwareCheckbox.textLabel;
                let assistiveTech = assistiveTechCheckbox.textLabel;
                this.output.items.push(new Span(`${software} + ${assistiveTech}`));
            }
        }
    }

}