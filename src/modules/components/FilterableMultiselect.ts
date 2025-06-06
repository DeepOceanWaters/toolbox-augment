import includesCaseInsensitive from "../includesCaseInsensitive.js";
import Checkbox from "./Checkbox.js";
import Component from "./Component.js";
import CustomButton from "./CustomButton.js";
import Disclosure from "./Disclosure.js";
import { IconType } from "./Icon.js";
import KeyboardNavigable from "./KeyboardNavigable.js";
import Mutable, { MutableItems } from "./Mutable.js";
import PartneredCheckboxGroup from "./PartneredMultiselect.js";
import TextInput from "./TextInput.js";

const KMPCG = KeyboardNavigable(Mutable(PartneredCheckboxGroup));
type KMPCG = MutableItems<Checkbox> & PartneredCheckboxGroup;

export default class FilterableMultiselect extends Component {
    name: string;
    heading: HTMLHeadingElement;
    filterer: TextInput;
    showOnlyCheckbox: Checkbox;
    settings: Disclosure;
    checkboxGroup: KMPCG;
    filterGroup: HTMLDivElement;
    removeCheckboxesFromFocus: boolean;

    constructor(multiselect: HTMLSelectElement, removeCheckboxesFromFocus: boolean = false) {
        super('div');
        this.name = document.querySelector(`label[for="${multiselect.id}"]`).textContent;
        
        
        this.checkboxGroup = new KMPCG(multiselect);
        this.checkboxGroup.component.classList.add('checkboxes-container', 'vertical');

        this.heading = document.createElement('h3');
        this.heading.textContent = this.name;

        this.createFilterer(this.name);

        this.createShowOnly();

        this.settings = new Disclosure(
            this.name + ' settings', 
            {
                controller: new CustomButton(this.name + ' settings', IconType.SETTINGS, true),
                floats: true
            }
        );
        this.settings.controller.button.classList.add('medium-icon');

        this.filterGroup = document.createElement('div');
        this.filterGroup.classList.add('filtering-group');
        this.filterGroup.append(
            this.filterer.component,
            this.checkboxGroup.component
        );

        this.component.classList.add('toolbox-augmentor', 'multiselect-group');
        this.component.append(
            this.heading,
            this.showOnlyCheckbox.component,
            this.settings.component,
            this.filterGroup
        );

        this.heading.classList.add('group-title');
        this.showOnlyCheckbox.component.classList.add('show-only');
        this.settings.component.classList.add('settings');

        this.checkboxGroup.component.addEventListener('keyup', (e) => {
            if (e.key !== 'Escape') return;
            this.filterer.input.focus();
        });
    }

    private createShowOnly(): void {
        this.showOnlyCheckbox = new Checkbox('Sort By Selected ' + this.checkboxGroup.legend.textContent);
        let mutator =
            (checkboxes: Checkbox[]) => checkboxes.sort((a, b) => {
                if (a.input.checked === b.input.checked) return 0;
                else if (a.input.checked) return -1;
                else return 1;
            });
        this.showOnlyCheckbox.input.addEventListener('change', (e) => {
            if (this.showOnlyCheckbox.input.checked) {
                this.checkboxGroup.addMutator(mutator);
            }
            else {
                this.checkboxGroup.removeMutator(mutator);
            }
            this.update();
        });
    }

    private createFilterer(name: string, throttle: number = 10): void {
        this.filterer = TextInput.asFloatLabel(`Filter ${name}`);
        this.filterer.input.setAttribute('autocomplete', 'off');
        this.filterer.input.addEventListener('input', (e) => {
            let timeout = window[`${this.filterer.input.id}-filtering`];
            if (timeout) {
                clearTimeout(timeout);
            }
            window[`${this.filterer.input.id}-filtering`] = setTimeout(
                () => this.update(),
                throttle
            );
        });
        this.filterer.input.addEventListener('keyup', (e) => {
            if (e.key !== 'ArrowDown') return;
            let timeout = window[`${this.filterer.input.id}-filtering`];
            if (timeout) {
                clearTimeout(timeout);
                this.update();
            }
            this.checkboxGroup.items[0].focus();
        });
        this.checkboxGroup.addMutator(
            (checkboxes) => checkboxes.filter(
                (c) => includesCaseInsensitive(c.textLabel.textContent, this.filterer.input.value)
            )
        );
    }

    update() {
        this.checkboxGroup.update();
    }
}