function KeyboardNavigable<TBase extends ComponentItemable> (Base: TBase) {
    return class KeyboardNavigable extends Base {
        constructor(...args: any[]) {
            super();
            for(let item of this.items) {
                item.component.tabIndex = -1;
            }
            this.allowTabNavigation = false;
        }

        set allowTabNavigation(allowed: boolean) {
            if (this.allowTabNavigation !== allowed) {
                for (let item of this.items) {
                    item.component.tabIndex = allowed ? 0 : -1;
                }
            }
            this.allowTabNavigation = allowed;
        }

        get allowTabNavigation() {
            return this.allowTabNavigation;
        }
    }
}