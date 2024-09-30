type GConstructor<T = {}> = new (...args: any[]) => T;

export interface HasItems<T> {
    items: T[];

    update(): void;
}

export default class Component {
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

export type Itemable = GConstructor<HasItems<any>>;
export type ComponentItemable = GConstructor<HasItems<Component>>;