"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEventEmitter = void 0;
class CustomEventEmitter {
    constructor() {
        this.events = {};
    }
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }
    }
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    off(event, listener) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l !== listener);
        }
    }
    once(event, listener) {
        const onceWrapper = (...args) => {
            listener(...args);
            this.off(event, onceWrapper);
        };
        this.on(event, onceWrapper);
    }
    removeAllListeners(event) {
        if (event) {
            delete this.events[event];
        }
        else {
            this.events = {};
        }
    }
}
exports.CustomEventEmitter = CustomEventEmitter;
//# sourceMappingURL=event-emitter.js.map