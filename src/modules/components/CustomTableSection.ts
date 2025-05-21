import Component from "./Component.js";
import CustomTableCell from "./CustomTableCell.js";

enum TableSectionType {
    THEAD = 'thead',
    TBODY = 'tbody',
    TFOOTER = 'tfooter'
} 

export default class CustomTableSection extends Component {
    type: TableSectionType
    cells: CustomTableCell

    constructor(type: TableSectionType, content: Component[][], headers:{}) {
        super(type);

        let body = document.createElement(type) as HTMLTableSectionElement;
        for(let row of content) {
            let tr = document.createElement('tr');
            for(let [index, cell] of Object.entries(row)) {
                let type = 'td';
                if (header?.includes(Number(index))) {
                    
                }
                let cell = document.createElement('td');
                cell.appendChild(cell);
                tr.append(cell);
            }
            this.body.appendChild(tr);
        }
    }
}