import Component, { HasItems } from "./Component";

enum ListType {
    UNORDERED = 'ul',
    ORDERED = 'ol'
}

export default class List extends Component implements HasItems<Component|string> {
    items: Component[];

    constructor(type = ListType.UNORDERED) {
        super(type);
        this.items = [];
    }

    update(): void {
        this.component.innerHTML = '';
        for(let item of this.items) {
            let li = document.createElement('li');
            li.appendChild(item.component);
            this.component.appendChild(li);
        }
    }
}