import Component from "./Component.js";

enum CellType {
    CELL = 'td',
    HEADER = 'th'
}
export default class CustomTableCell extends Component {
    constructor(type: CellType, content: Component[]) {
        super(type);
        this.component.append(...content.map(c => c.component));
    }
}