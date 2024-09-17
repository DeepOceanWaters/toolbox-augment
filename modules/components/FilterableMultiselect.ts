import InputLabelPair from './inputLabelPair';
import CheckboxWidget from './CheckboxWidget';
import Fieldset from './Fieldset';
import Filterable from './Filterable';
import FilterBox from './FilterBox';
import MutableList from './MutableList';

export default class FilterableMultiselect {
    fieldset: Fieldset;
    filterBox: FilterBox;
    showOnlyCheckbox: CheckboxWidget;
    mutableCheckboxWidgets: MutableList<CheckboxWidget>;
    removeCheckboxesFromFocus: boolean;

    constructor(label: string, options: string[], removeCheckboxesFromFocus: boolean = false) 
    {
        this.removeCheckboxesFromFocus = removeCheckboxesFromFocus;
        this.fieldset = new Fieldset(label);
        this.filterBox = new FilterBox(`Filter ${label}`);
        let mutableCheckboxWidgets = new MutableList(options.map((o) => new CheckboxWidget(o)));
        mutableCheckboxWidgets.addMutator(
            (checkboxWidgets) => checkboxWidgets.filter(
                (cw) => this.filterBox.inputLabelPair.input.value === cw.textContent
            )
        );
        
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
                this.mutableCheckboxWidgets.addMutator(mutator);
            }
            else {
                this.mutableCheckboxWidgets.removeMutator(mutator);
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
        this.mutableCheckboxWidgets.mutate();
        
    }
}