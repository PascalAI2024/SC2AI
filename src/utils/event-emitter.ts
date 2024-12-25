export class CustomEventEmitter {
    private events: { [key: string]: Function[] } = {};

    protected emit(event: string, ...args: any[]): void {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }
    }

    public on(event: string, listener: Function): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    public off(event: string, listener: Function): void {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l !== listener);
        }
    }

    public once(event: string, listener: Function): void {
        const onceWrapper = (...args: any[]) => {
            listener(...args);
            this.off(event, onceWrapper);
        };
        this.on(event, onceWrapper);
    }

    public removeAllListeners(event?: string): void {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }
}
