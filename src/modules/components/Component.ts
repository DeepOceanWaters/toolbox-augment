type GConstructor<T = {}> = new (...args: any[]) => T;

interface HasItems<T> {
    items: T[];

    update(): void;
}

class Component {
    component: HTMLElement;

    // make tagName an enum of HTMLTags
    constructor(tagName: string = 'div') {
        this.component = document.createElement(tagName);
    }

    update() {

    }

    focus() {
        this.component.focus();
    }

    render() {
        return this.component;
    }
}

type Itemable = GConstructor<HasItems<any>>;
type ComponentItemable = GConstructor<HasItems<Component>>;