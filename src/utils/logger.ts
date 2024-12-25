export class Logger {
    static log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        
        switch (level) {
            case 'error':
                console.error(`${prefix} ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ${message}`);
                break;
            default:
                console.log(`${prefix} ${message}`);
        }
    }

    static debug(message: string): void {
        if (process.env.DEBUG) {
            this.log(`[DEBUG] ${message}`, 'info');
        }
    }

    static error(error: Error | string): void {
        const message = error instanceof Error ? error.message : error;
        this.log(message, 'error');
        if (error instanceof Error && error.stack) {
            console.error(error.stack);
        }
    }
}
