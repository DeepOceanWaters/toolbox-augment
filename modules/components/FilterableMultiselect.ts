import includesCaseInsensitive from '../includesCaseInsensitive.js';
import CheckboxWidget from './CheckboxWidget.js';
import Fieldset from './Fieldset.js';
import FilterBox from './FilterBox.js';
import MutableList from './MutableList.js';

export default class FilterabMultiselect implements Widget {
    component: HTMLDivElement;
    fieldset: Fieldset;
    filterBox: FilterBox;
    showOnlyCheckbox: CheckboxWidget;
    checkboxWidgets: MutableList<CheckboxWidget>;
    checkboxContainer: HTMLDivElement;
    filterGroup: HTMLDivElement;
    removeCheckboxesFromFocus: boolean;

    constructor(label: string, options: string[], removeCheckboxesFromFocus: boolean = false) 
    {
        this.component = document.createElement('div');
        this.component.classList.add('multiselect-group');
        this.removeCheckboxesFromFocus = removeCheckboxesFromFocus;
        this.fieldset = new Fieldset(label);
        this.filterBox = new FilterBox(`Filter ${label}`);
        this.checkboxWidgets = new MutableList(options.map((o) => new CheckboxWidget(o)));
        this.checkboxWidgets.addMutator(
            (checkboxWidgets) => checkboxWidgets.filter(
                (cw) => {
                    return this.filterBox.inputLabelPair.input.value === '' 
                        || includesCaseInsensitive(
                            this.filterBox.inputLabelPair.input.value,
                            cw.textLabel.textContent
                        )
                })
            );
        this.checkboxContainer = document.createElement('div');
        this.checkboxContainer.classList.add('checkbox-container');
        
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
        let fieldset = this.fieldset.render();
        fieldset.append(
            this.showOnlyCheckbox.render(),
            this.filterGroup
        );
        this.filterGroup.append(
            this.filterBox.render(),
            this.checkboxContainer
        );
        this.checkboxContainer.append(
            ...this.checkboxWidgets.mutatedItems.map(i => i.render())
        );
        this.component.append(fieldset);
        return this.component;
    }
}