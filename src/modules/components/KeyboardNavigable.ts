import Component, { ComponentItemable } from "./Component.js";

export default function KeyboardNavigable<TBase extends ComponentItemable> (Base: TBase) {
    return class KeyboardNavigable extends Base {
        _allowTabNavigation: boolean;

        constructor(...args: any[]) {
            super(...args);
            for(let item of this.items) {
                item.component.tabIndex = -1;
                item.component.addEventListener('keydown', (e) => this.optionKeyRouter(e));
            }
            this._allowTabNavigation = false;
        }

        optionKeyRouter(e: KeyboardEvent) {
            let currentOption = e.currentTarget as unknown as Component;
            let currentIndex = this.items.indexOf(currentOption);
            let nextFocus: Component; 
            let nextIndex: number;
            let direction: -1 | 1;
            switch (e.key) {
                case 'ArrowDown':
                    direction = 1;
                    nextIndex = (currentIndex + 1);
                case 'ArrowUp':
                    // if next index is set 
                    // (aka arrow down was hit), don't set it
                    direction ??= -1;
                    nextIndex ??= (this.items.length + currentIndex - 1);
                    nextIndex %= this.items.length;
                    nextFocus = this.items[nextIndex];
                    break;
                default:
                    return;
            }
            nextFocus.focus();
            e.preventDefault();
        }

        set allowTabNavigation(allowed: boolean) {
            if (this._allowTabNavigation !== allowed) {
                for (let item of this.items) {
                    item.component.tabIndex = allowed ? 0 : -1;
                }
            }
            this._allowTabNavigation = allowed;
        }

        get allowTabNavigation() {
            return this._allowTabNavigation;
        }
    }
}