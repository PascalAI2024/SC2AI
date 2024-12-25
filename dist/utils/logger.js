"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static log(message, level = 'info') {
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
    static debug(message) {
        if (process.env.DEBUG) {
            this.log(`[DEBUG] ${message}`, 'info');
        }
    }
    static error(error) {
        const message = error instanceof Error ? error.message : error;
        this.log(message, 'error');
        if (error instanceof Error && error.stack) {
            console.error(error.stack);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map