import includesCaseInsensitive from "../includesCaseInsensitive";
import CheckboxGroup from "./CheckboxGroup";
import InputLabelPair from "./InputLabelPair";

type MutableComponents = GConstructor<MutableItems<Component>>;

export default function TextFilterable<TBase extends MutableComponents>(Base: TBase) {
    return class Filterable extends Base {
        filterInput: HTMLInputElement;
        filterLabel: HTMLLabelElement;
        throttle: number;
        private _filter: mutator;

        constructor(...args: any[]) {
            super(...args);
            let inputPair = new InputLabelPair();
            this.filterInput = inputPair.input;
            this.filterLabel = inputPair.label;
            this.throttle = 20;
            this.addFilterEvents();

            this._filter = 
                (items) => items.filter(
                    (item) => {
                        return this.filterInput.value === ''
                            || includesCaseInsensitive(
                                item.component.textContent,
                                this.filterInput.value)
                    }
                );

            this.mutators.push(this.filter);
        }

        private addFilterEvents() {
            this.filterInput.addEventListener('input', (e) => {
                let timeout = window[`${this.filterInput.id}-filtering`];
                if (timeout) {
                    clearTimeout(timeout);
                }
                window[`${this.filterInput.id}-filtering`] = setTimeout(
                    () => this.update(),
                    this.throttle
                );
            });
        }

        set filter(mutator: mutator) {
            this.removeMutator(this._filter);
            this.filter = mutator;
            this.addMutator(this._filter);
        }

        get filter() {
            return this._filter;
        }
    }
}

export function connectFiltererAndItems(
    textInput: TextInput, 
    items: MutableComponents, 
    componentToText: (a: Component) => string = (a) => a.component.textContent) {
            throttle = 20;
            this.addFilterEvents();

            let filter = 
                (items) => items.filter(
                    (item) => {
                        return this.filterInput.value === ''
                            || includesCaseInsensitive(
                                item.component.textContent,
                                textInput.input.value)
                    }
                );

            this.mutators.push(this.filter);

            this.filterInput.addEventListener('input', (e) => {
                let timeout = window[`${this.filterInput.id}-filtering`];
                if (timeout) {
                    clearTimeout(timeout);
                }
                window[`${this.filterInput.id}-filtering`] = setTimeout(
                    () => this.update(),
                    this.throttle
                );
            });
        }
}