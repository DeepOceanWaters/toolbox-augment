import InputLabelPair from "./InputLabelPair.js";

export default class Checkbox extends Component {
    pair: InputLabelPair;
    textLabel: HTMLSpanElement;

    constructor(label: string) {
        super('div');
        this.pair = new InputLabelPair();

        this.textLabel  = document.createElement('span');
        this.textLabel .textContent = label;

        this.pair.input.type = 'checkbox';
        this.pair.label.appendChild(this.textLabel);
        this.pair.label.classList.add('chkbox-pair');
        
        this.pair.label.append(
            this.pair.input,
            this.textLabel
        );
        this.component.append(
            this.pair.label
        );
    }

    render() {
        return this.component;
    }
}