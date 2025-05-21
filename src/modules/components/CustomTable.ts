import Component from "./Component.js";

type CustomTableOptions = {
    rowheaders?: number[], 
    footer?: Component[][], 
    footerHeaders?: number[],
}

export default class CustomTable extends Component {
    head: HTMLTableSectionElement;
    columnHeaders: HTMLTableCellElement[];
    body: HTMLTableSectionElement;
    footer: HTMLTableSectionElement;

    constructor(columheaders: (Component|null)[], body: Component[][], options?: CustomTableOptions) {
        super('table');

        this.head = this.createBody(
            [columheaders],
            'thead',
            columheaders.map((c, index) => c ? index : null).filter(c => c !== null)
        );
        

        this.body = this.createBody(
            body, 
            'tbody'
        );

        if (options?.footer) {
            this.footer = this.createBody(
                options.footer, 
                'tfooter'
            );
        }

        this.component.append(
            this.head,
            this.body
        );
        if (this.footer) {
            this.component.appendChild(this.footer);
        }
    }

    private createBody(content: Component[][], type: ('thead'|'tbody'|'tfooter'), header?: number[]): HTMLTableSectionElement {
        let body = document.createElement(type) as HTMLTableSectionElement;
        for(let row of content) {
            let tr = document.createElement('tr');
            for(let [index, cell] of Object.entries(row)) {
                let type = 'td';
                if (header?.includes(Number(index))) {
                    type = 'th';
                }
                let cell = document.createElement('td');
                cell.appendChild(cell);
                tr.append(cell);
            }
            this.body.appendChild(tr);
        }
        return body;
    }
}