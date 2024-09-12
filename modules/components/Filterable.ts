export default class Filterable<T> {
    public items :T[];
    public positiveMatches :T[];
    public negativeMatches :T[];
    private filters :((item :T) => boolean)[];

    constructor(items? :T[]) {
        this.items = items || [];
        this.filters = [];
        this.positiveMatches = [];
        this.negativeMatches = [];
    }

    /**
     * Add a function to filter items.
     * @param filter true adds to positive matches, false to negative matches
     */
    public addFilter(filter: (item: T) => boolean): void {
        this.filters.push(filter);
    }

    public removeFilter(filter: (item: T) => boolean): boolean {
        let filterIndex = this.filters.indexOf(filter);
        let wasFound = filterIndex === -1;
        if (wasFound) this.filters.splice(filterIndex, 1);
        return wasFound;
    }

    public filter() {
        this.positiveMatches = [];
        this.negativeMatches = [];
        for(let item of this.items) {
            let matches = this.positiveMatches;
            for(let filter of this.filters) {
                if (!filter(item)) {
                    matches = this.negativeMatches;
                    break;
                }
            }
            matches.push(item);
        }
    }
}