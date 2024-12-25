"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
exports.createSystem = createSystem;
const logger_1 = require("./logger");
class System {
    constructor(blueprint) {
        this.name = blueprint.name;
        this.type = blueprint.type || 'generic';
        this.state = blueprint.defaultOptions?.state || {};
        this.buildOrder = blueprint.buildOrder;
        // Bind all methods from blueprint to this instance
        Object.entries(blueprint).forEach(([key, value]) => {
            if (typeof value === 'function') {
                this[key] = value.bind(this);
            }
        });
        // Create a proxy to handle method access
        return new Proxy(this, {
            get: (target, prop) => {
                const value = target[prop];
                if (typeof value === 'function') {
                    return value.bind(target);
                }
                return value;
            }
        });
        logger_1.Logger.log(`System created: ${this.name} (${this.type})`);
    }
    setState(newState) {
        this.state = {
            ...this.state,
            ...newState,
        };
        logger_1.Logger.log(`State updated for ${this.name}: ${JSON.stringify(newState)}`);
    }
    getBuildOrder() {
        return this.buildOrder;
    }
    getType() {
        return this.type;
    }
    getName() {
        return this.name;
    }
}
exports.System = System;
function createSystem(blueprint) {
    return new System(blueprint);
}
//# sourceMappingURL=create-system.js.map