import InputLabelPair from './inputLabelPair';
import CheckboxWidget from './CheckboxWidget';
import Fieldset from './Fieldset';
import Filterable from './Filterable';
import FilterBox from './FilterBox';

export default class FilterableMultiselect {
    fieldset: Fieldset;
    filterBox: FilterBox;
    checkboxes: CheckboxWidget[];
    showOnlyCheckbox: CheckboxWidget;
    filterableCheckboxes: Filterable<CheckboxWidget>;
    removeCheckboxesFromFocus: boolean;

    constructor(label: string, options: string[], removeCheckboxesFromFocus: boolean = false) 
    {
        this.removeCheckboxesFromFocus = removeCheckboxesFromFocus;
        this.fieldset = new Fieldset(label);
        this.filterBox = this.createFilterBox(label);
        this.checkboxes = this.createCheckboxList(options);
        let filterableCheckboxes = new Filterable(this.checkboxes);
        filterableCheckboxes.addFilter(
            (checkboxWidget) => this.filterBox.input.value === checkboxWidget.textLabel.textContent
        );
        
        this.showOnlyCheckbox = this.createShowOnly();

        this.addFilterEvents();
    }

    private createFilterBox(label: string): FilterBox {
        let pair = new FilterBox(`Filter ${label}`);
        pair.input.type = 'text';
        return pair;
    }

    private createCheckboxList(options: string[]): CheckboxWidget[] {
        let checkboxes: CheckboxWidget[] = [];
        for (let option of options) {
            checkboxes.push(new CheckboxWidget(option));
        }
        return checkboxes;
    }

    private createShowOnly(): CheckboxWidget {
        let showOnly = new CheckboxWidget('Only Selected ' + this.fieldset.legend.textContent);
        this.filterableCheckboxes.addFilter((cw) => !showOnly.checkbox.checked || cw.checkbox.checked);
        showOnly.checkbox.addEventListener('change', (e) => {
            this.filter();
        });
        return showOnly;
    }

    private addFilterEvents(throttle: number = 10): void {
        this.filterBox.input.addEventListener('input', (e) => {
            let timeout = window[`${this.filterBox.input.id}-filtering`];
            if (timeout) {
                clearTimeout(timeout);
            }
            window[`${this.filterBox.input.id}-filtering`] = setTimeout(
                () => this.filter(),
                throttle
            );
        });
    }

    private filter() {
        this.filterableCheckboxes.filter();
        if (this.removeCheckboxesFromFocus) {
            this.filterableCheckboxes
                .items
                .forEach(cw => cw.checkbox.tabIndex = -1);
            this.filterableCheckboxes.positiveMatches[0].checkbox.tabIndex = 0;
        }
    }
}