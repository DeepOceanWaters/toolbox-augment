import Component from "./Component.js";

export enum LiveRegionRoles {
    LOG = 'log',
    STATUS = 'status',
    ALERT = 'alert'
}

export default class LiveRegion extends Component {
    buffer: number = 50;
    bufferTimeout: number;
    messageQueue: string[];

    constructor(role: LiveRegionRoles) {
        super('div');
        this.component.setAttribute('role', role);
    }

    setBuffer(buffer: number) {
        this.buffer = buffer;
    }

    clearQueue() {
        this.messageQueue = [];
    }

    queueMessage(message: string, important: boolean = false) {
        if (important) {
            this.messageQueue.unshift(message);
            this.announceNext(important);
        }
        else {
            this.messageQueue.push(message);
            this.announceNext();
        }
    }

    announceNext(important: boolean = false) {
        if (this.bufferTimeout) {
            if (!important) {
                return;
            }
        }
        if (this.messageQueue.length === 0) {
            return;
        }

        let message = this.messageQueue.shift();
        // if message is the same, we have to clear first - need to put time
        // between clearing and setting message text for live region to work
        if (message.trim().toLowerCase() 
            === this.component.textContent.trim().toLocaleLowerCase()
        ) {
            this.component.textContent = '';
            this.messageQueue.unshift(message);
        }
        else {
            this.component.textContent = message;
        }
        this.bufferTimeout = 
            (setTimeout(() => {
                    this.bufferTimeout = null; 
                    this.announceNext()
                }, this.buffer) as unknown) as number;
    }
}