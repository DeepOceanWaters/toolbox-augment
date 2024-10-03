import Component from "./Component.js"

export default class SpanCustom extends Component {
    constructor(text: string) {
        super('span');
        this.component.append(text);
    }
}