import CheckboxWidget from './CheckboxWidget';
import Fieldset from './Fieldset';
import FilterBox from './FilterBox';
import MutableList from './MutableList';

export default class FilterabMultiselect extends HTMLDivElement {
    fieldset: Fieldset;
    filterBox: FilterBox;
    showOnlyCheckbox: CheckboxWidget;
    checkboxWidgets: MutableList<CheckboxWidget>;
    checkboxContainer: HTMLDivElement;
    filterGroup: HTMLDivElement;
    removeCheckboxesFromFocus: boolean;

    constructor(label: string, options: string[], removeCheckboxesFromFocus: boolean = false) 
    {
        super();
        this.classList.add('multiselect-group');
        this.removeCheckboxesFromFocus = removeCheckboxesFromFocus;
        this.fieldset = new Fieldset(label);
        this.filterBox = new FilterBox(`Filter ${label}`);
        let checkboxWidgets = new MutableList(options.map((o) => new CheckboxWidget(o)));
        checkboxWidgets.addMutator(
            (checkboxWidgets) => checkboxWidgets.filter(
                (cw) => this.filterBox.inputLabelPair.input.value === cw.textContent
            )
        );
        this.checkboxContainer = document.createElement('div');
        
        this.filterGroup = document.createElement('div');
        
        this.showOnlyCheckbox = this.createShowOnly();
        this.addFilterEvents();
    }

    private createShowOnly(): CheckboxWidget {
        let showOnly = new CheckboxWidget('Only Selected ' + this.fieldset.legend.textContent);
        let mutator = 
            (widgets: CheckboxWidget[]) => widgets.sort((a, b) => {
                if (a.checkbox.checked === b.checkbox.checked) return 0;
                else if (a.checkbox.checked) return -1;
                else return 1;
            });
        showOnly.checkbox.addEventListener('change', (e) => {
            if (showOnly.checkbox.checked) {
                this.checkboxWidgets.addMutator(mutator);
            }
            else {
                this.checkboxWidgets.removeMutator(mutator);
            }
            this.render();
        });
        return showOnly;
    }

    private addFilterEvents(throttle: number = 10): void {
        this.filterBox.inputLabelPair.input.addEventListener('input', (e) => {
            let timeout = window[`${this.filterBox.inputLabelPair.input.id}-filtering`];
            if (timeout) {
                clearTimeout(timeout);
            }
            window[`${this.filterBox.inputLabelPair.input.id}-filtering`] = setTimeout(
                () => this.render(),
                throttle
            );
        });
    }

    render() {
        this.checkboxWidgets.mutate();
        this.fieldset.render();
        this.fieldset.append(this);
        this.append(
            this.showOnlyCheckbox,
            this.filterGroup
        );
        this.filterGroup.append(
            this.filterBox,
            this.checkboxContainer
        );
        this.checkboxContainer.append(
            ...this.checkboxWidgets.mutatedItems
        );
        return this;
    }
}