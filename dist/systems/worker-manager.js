"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkerManager = createWorkerManager;
const logger_1 = require("../utils/logger");
class WorkerManager {
    constructor() {
        this.state = {
            workers: [],
            mineralFields: [],
            vespeneGeysers: [],
            optimalWorkerCount: 24, // 16 on minerals, 6 on gas (2 geysers)
            maxWorkersPerBase: 24
        };
        this._system = {};
    }
    pause() {
        logger_1.Logger.log('Worker manager paused');
    }
    unpause() {
        logger_1.Logger.log('Worker manager unpaused');
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
    }
    setup(world) {
        const resources = world.resources.get();
        const { units, map } = resources;
        // Get starting base location
        const bases = map.getExpansions('self');
        if (bases.length > 0) {
            const mainBase = bases[0];
            this.state.mineralFields = mainBase.mineralFields;
            this.state.vespeneGeysers = mainBase.vespeneGeysers;
        }
        logger_1.Logger.log('Worker manager initialized');
    }
    async balanceWorkers(world) {
        const resources = world.resources.get();
        const { units } = resources;
        // Get all workers
        this.state.workers = units.getWorkers();
        // Calculate optimal distribution
        const mineralWorkers = units.getMineralWorkers();
        const gasWorkers = units.getGasWorkers();
        const idleWorkers = this.state.workers.filter(w => !mineralWorkers.includes(w) && !gasWorkers.includes(w));
        // Assign idle workers to minerals
        if (idleWorkers.length > 0) {
            await resources.actions.gather(idleWorkers);
        }
        // Log worker distribution
        logger_1.Logger.log(`Workers - Total: ${this.state.workers.length}, Minerals: ${mineralWorkers.length}, Gas: ${gasWorkers.length}, Idle: ${idleWorkers.length}`);
    }
}
function createWorkerManager() {
    const manager = new WorkerManager();
    const wrapper = async (world) => {
        await manager.balanceWorkers(world);
    };
    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);
    return wrapper;
}
//# sourceMappingURL=worker-manager.js.map