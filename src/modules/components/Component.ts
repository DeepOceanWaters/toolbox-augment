type GConstructor<T = {}> = new (...args: any[]) => T;

interface HasItems<T> {
    items: T[];

    update(): void;
}

abstract class Component {
    component: HTMLElement;

    // make tagName an enum of HTMLTags
    constructor(tagName: string = 'div') {
        this.component = document.createElement(tagName);
    }

    update() {

    }

    render() {
        return this.component;
    }
}

type Itemable = GConstructor<HasItems<any>>;
type ComponentItemable = GConstructor<HasItems<Component>>;


// test
/*
class CustomListItem extends Component {
    constructor(name: string) {
        super();
        this.component = document.createElement('li');
        this.component.textContent = name;
    }
}

class CustomList extends Component implements HasItems {
    items: CustomListItem[] = [];

    constructor(items: string[]) {
        super('ul')
        this.items = items.map(i => new CustomListItem('hello'));
    }

    update () {

    }

    render() {
        this.component.append(
            ...this.items.map(i => i.component)
        );
        return this.component;
    }
}

const MutableCustomList = Mutable(CustomList);
const KeyboardNavigableMutableCustomList = KeyboardNavigable(Mutable(CustomList));

let list  = new KeyboardNavigableMutableCustomList(['a', 'b', '2', '56', 'a4', 'jerry']);*/