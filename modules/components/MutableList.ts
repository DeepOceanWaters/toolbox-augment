type mutator<T> = (items: T[]) => T[];

interface Mutable {
    items: MutableList<any>;
}

export default class MutableList<T> {
    originalItems: T[];
    mutatedItems: T[];
    mutators: mutator<T>[];

    constructor(list: T[]) {
        this.originalItems = list;
        this.mutatedItems = list;
        this.mutators = [];
    }

    addMutator(mutator: mutator<T>) {
        this.mutators.push(mutator);
    }

    removeMutator(mutator: mutator<T>) {
        let index = this.mutators.indexOf(mutator);
        if (index === -1) throw new Error('mutator not found');
        this.mutators.splice(index, 1);
    }

    mutate() {
        this.mutatedItems = [...this.originalItems];
        for(let mutator of this.mutators) {
            this.mutatedItems = mutator(this.mutatedItems);
        }
    }
}