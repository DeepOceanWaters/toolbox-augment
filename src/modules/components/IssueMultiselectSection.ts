import CheckboxGroup from "./CheckboxGroup";
import PartneredCheckboxGroup from "./PartneredMultiselect";
import TextFilterable from "./TextFilterable";

const Composedgroup = TextFilterable(KeyboardNavigable(Mutable(PartneredCheckboxGroup)));

export default class IssueMultiselectSection {
    checkboxGroup;

    constructor(multiselect: HTMLSelectElement) {
        this.checkboxGroup = new Composedgroup(multiselect);
    }
}