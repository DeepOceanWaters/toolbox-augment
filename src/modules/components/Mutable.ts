import { HasItems, Itemable } from "./Component.js";

type mutator = (a: any[]) => any[];

export interface MutableItems<T> extends HasItems<T> {
    originalItems: T[];
    mutators: mutator[];

    addMutator(mutator: mutator): void;
    removeMutator(mutator: mutator): void;
    update(): void;
}

export default function Mutable<TBase extends Itemable> (Base: TBase) {
    return class Mutable extends Base {
        originalItems: any[] = [];
        mutators: mutator[] = [];

        constructor(...args: any[]) {
            super(...args);
        }

        addMutator(mutator: mutator) {
            this.mutators. push(mutator);
        }

        removeMutator(mutator: mutator) {
            let index = this.mutators.indexOf(mutator);
            if (index === -1) throw new Error("Couldn't find mutator!");
            this.mutators.splice(index, 1);
        }

        update() {
            if (this.originalItems.length === 0) this.originalItems = [...this.items];
            this.items = [...this.originalItems];
            for(let mutator of this.mutators) {
                this.items = mutator(this.items);
            }
            super.update();
        }
    }
}