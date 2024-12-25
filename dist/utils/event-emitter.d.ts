export declare class CustomEventEmitter {
    private events;
    protected emit(event: string, ...args: any[]): void;
    on(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    once(event: string, listener: Function): void;
    removeAllListeners(event?: string): void;
}
