import includesCaseInsensitive from "../includesCaseInsensitive.js";
import Checkbox from "./Checkbox.js";
import Component from "./Component.js";
import KeyboardNavigable from "./KeyboardNavigable.js";
import Mutable, { MutableItems } from "./Mutable.js";
import PartneredCheckboxGroup from "./PartneredMultiselect.js";
import TextInput from "./TextInput.js";

const KMPCG = KeyboardNavigable(Mutable(PartneredCheckboxGroup));
type KMPCG = MutableItems<Checkbox> & PartneredCheckboxGroup;

export default class FilterableMultiselect extends Component {
    heading: HTMLHeadingElement;
    filterer: TextInput;
    showOnlyCheckbox: Checkbox;
    checkboxGroup: KMPCG;
    removeCheckboxesFromFocus: boolean;

    constructor(multiselect: HTMLSelectElement, removeCheckboxesFromFocus: boolean = false) {
        let multiselectName = document.querySelector(`label[for="${multiselect.id}"]`).textContent;
        

        super('div');
        this.checkboxGroup = new KMPCG(multiselect);

        this.heading = document.createElement('h3');
        this.heading.textContent = multiselectName;

        this.createFilterer(multiselectName);

        this.createShowOnly();

        this.component.append(
            this.heading,
            this.showOnlyCheckbox.component,
            this.filterer.component,
            this.checkboxGroup.component
        );
    }

    private createShowOnly(): void {
        this.showOnlyCheckbox = new Checkbox('Only Selected ' + this.checkboxGroup.legend.textContent);
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