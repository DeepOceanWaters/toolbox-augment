import Component from "./Component"

export default class Span extends Component {
    constructor(text: string) {
        super('span');
        this.component.append(text);
    }
}