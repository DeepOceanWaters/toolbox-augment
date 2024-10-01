type GConstructor<T = {}> = new (...args: any[]) => T;

export enum FocusType {
    UNFOCUSABLE,
    TAB,
    PROGRAMMATIC
}

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

    setFocus(type: FocusType = FocusType.TAB) {
        switch (type) {
            case FocusType.TAB:
                this.component.tabIndex = 0;
                break;
            case FocusType.UNFOCUSABLE:
            case FocusType.PROGRAMMATIC:
                this.component.tabIndex = -1;
                break;
        }
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