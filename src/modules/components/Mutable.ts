function Mutable<TBase extends Itemable> (Base: TBase) {
    return class Mutable extends Base {
        originalItems: any[] = [];
        mutators: any[] = [];

        mutate() {
            this.items = [...this.originalItems];
            for(let mutator of this.mutators) {
                this.items = mutator(this.items);
            }
        }
    }
}