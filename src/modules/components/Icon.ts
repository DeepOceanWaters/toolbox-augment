import Component from "./Component.js";

export enum IconType {
    SETTINGS = 'fa-cog',
    SEARCH_MAG_GLASS = 'fa-search'
}

export default class Icon extends Component {
    constructor(iconType: IconType) {
        super('i');
        this.component.classList.add('far', iconType);
    }
} 