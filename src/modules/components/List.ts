import Component, { HasItems } from "./Component.js";

enum ListType {
    UNORDERED = 'ul',
    ORDERED = 'ol'
}

export default class ListCustom extends Component implements HasItems<ListItemCustom> {
    items: ListItemCustom[];

    constructor(type = ListType.UNORDERED) {
        super(type);
        this.items = [];
        this.update();
    }

    update(): void {
        for(let item of this.items) {
            this.component.prepend(item.component);
        }
    }
}

export class ListItemCustom extends Component {
    constructor(content: Component) {
        super('li');
        this.component.appendChild(content.component);
    }
}