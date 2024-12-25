export declare class Logger {
    static log(message: string, level?: 'info' | 'warn' | 'error'): void;
    static debug(message: string): void;
    static error(error: Error | string): void;
}
