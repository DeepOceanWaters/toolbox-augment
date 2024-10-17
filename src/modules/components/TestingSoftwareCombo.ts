import Settings from "../AuditSettings.js";
import CheckboxGroup from "./CheckboxGroup.js";
import Component from "./Component.js";
import List from "./List.js";
import Span from "./Span.js";

type HeadingLevel = 1|2|3|4|5|6;

const invisChar = ''

// how to tell new from old testing inputs?
// mark with AUDIT #
export default class TestingSoftwareCombo extends Component {
    heading: HTMLHeadingElement;
    software: CheckboxGroup;
    assistiveTech: CheckboxGroup;
    output: List;
    private associatedInput: HTMLInputElement;
    private associatedDelete: HTMLButtonElement;

    constructor(
        position: number, 
        settings: Settings,
        associatedInput: HTMLInputElement,
        associatedDelete: HTMLButtonElement,
        args?: {
            headingLevel?: HeadingLevel
        }
    ) {
        let label = `Testing Software Combo ${position}`;
        super('div');

        this.associatedInput = associatedInput;
        this.associatedDelete = associatedDelete;

        let headingLevel = args?.headingLevel || 3;
        this.heading = document.createElement(`h${headingLevel}`);
        this.heading.textContent = label;

        this.software = new CheckboxGroup('Software', settings.settings["software"]);
        this.assistiveTech = new CheckboxGroup('Assistive Technology', settings.settings["assistiveTech"]);
        this.output = new List();

        this.component.addEventListener('change', (e) => this.update());
    }

    update() {
        this.output.items = [];
        
        let outputTexts = [];
        for(let softwareCheckbox of this.software.items) {
            for(let assistiveTechCheckbox of this.assistiveTech.items) {
                let software = softwareCheckbox.textLabel;
                let assistiveTech = assistiveTechCheckbox.textLabel;
                outputTexts.push(`${software} + ${assistiveTech}`);
            }
        }
        let outputText = outputTexts.join(', ');
    }
}