"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSystems = createSystems;
const worker_manager_1 = require("./worker-manager");
const build_order_1 = require("./build-order");
const combat_1 = require("./combat");
const scout_1 = require("./scout");
const strategy_1 = require("./strategy");
const expansion_1 = require("./expansion");
const ml_integration_1 = require("./ml-integration");
function createSystems() {
    return {
        workerManager: (0, worker_manager_1.createWorkerManager)(),
        buildOrderManager: (0, build_order_1.createBuildOrderManager)(),
        combatManager: (0, combat_1.createCombatManager)(),
        scoutManager: (0, scout_1.createScoutManager)(),
        strategyManager: (0, strategy_1.createStrategyManager)(),
        expansionManager: (0, expansion_1.createExpansionManager)(),
        mlIntegrationManager: (0, ml_integration_1.createMLIntegrationManager)(),
    };
}
//# sourceMappingURL=index.js.map