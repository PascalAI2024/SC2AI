"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSystems = createSystems;
const worker_manager_1 = require("./worker-manager");
function createSystems() {
    return {
        workerManager: (0, worker_manager_1.createWorkerManager)(),
    };
}
//# sourceMappingURL=index.js.map