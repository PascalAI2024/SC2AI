"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBuildOrderManager = createBuildOrderManager;
const enums_1 = require("../constants/enums");
const logger_1 = require("../utils/logger");
class BuildOrderManager {
    constructor() {
        this.state = {
            currentPhase: 'early',
            supplyThresholds: {
                workers: 22,
                firstExpansion: 36,
                armyTransition: 44
            },
            buildQueue: []
        };
        this._system = {};
    }
    pause() {
        logger_1.Logger.log('Build order manager paused');
    }
    unpause() {
        logger_1.Logger.log('Build order manager resumed');
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
    }
    setup(world) {
        const resources = world.resources.get();
        const { race } = world.agent.settings;
        // Race-specific build order initialization
        switch (race) {
            case enums_1.Race.Protoss:
                this.initProtossBuildOrder();
                break;
            case enums_1.Race.Terran:
                this.initTerranBuildOrder();
                break;
            case enums_1.Race.Zerg:
                this.initZergBuildOrder();
                break;
            default:
                logger_1.Logger.log('No specific build order for random race');
        }
        logger_1.Logger.log(`Build order initialized for ${enums_1.Race[race]}`);
    }
    initProtossBuildOrder() {
        // Standard Protoss 2-Gate Zealot Rush build order
        this.state.buildQueue = [
            { unitType: 34, priority: 1 }, // Probe
            { unitType: 34, priority: 1 },
            { unitType: 34, priority: 1 },
            { unitType: 63, priority: 2 }, // Gateway
            { unitType: 34, priority: 1 },
            { unitType: 63, priority: 2 }, // Second Gateway
            { unitType: 65, priority: 3 } // Zealot
        ];
    }
    initTerranBuildOrder() {
        // Standard Terran Marine Rush build order
        this.state.buildQueue = [
            { unitType: 45, priority: 1 }, // SCV
            { unitType: 45, priority: 1 },
            { unitType: 45, priority: 1 },
            { unitType: 48, priority: 2 }, // Barracks
            { unitType: 48, priority: 2 }, // Second Barracks
            { unitType: 51, priority: 3 } // Marine
        ];
    }
    initZergBuildOrder() {
        // Standard Zerg Zergling Rush build order
        this.state.buildQueue = [
            { unitType: 104, priority: 1 }, // Drone
            { unitType: 104, priority: 1 },
            { unitType: 104, priority: 1 },
            { unitType: 106, priority: 2 }, // Spawning Pool
            { unitType: 104, priority: 1 },
            { unitType: 105, priority: 3 } // Zergling
        ];
    }
    async executeNextBuildStep(world) {
        const resources = world.resources.get();
        const { units, actions } = resources;
        // Check current supply and phase
        const currentSupply = resources.frame.getObservation().playerCommon.foodUsed;
        this.updateGamePhase(currentSupply);
        // Find next buildable unit
        const nextUnit = this.state.buildQueue.shift();
        if (nextUnit) {
            const townhalls = units.getByType(this.getTownhallType(world.agent.settings.race));
            if (townhalls.length > 0 && world.agent.canAfford(nextUnit.unitType)) {
                await actions.train(nextUnit.unitType, townhalls[0]);
                logger_1.Logger.log(`Trained unit: ${nextUnit.unitType}`);
            }
            else {
                // Put unit back in queue if can't be built
                this.state.buildQueue.unshift(nextUnit);
            }
        }
    }
    updateGamePhase(currentSupply) {
        if (currentSupply < this.state.supplyThresholds.armyTransition) {
            this.state.currentPhase = 'early';
        }
        else if (currentSupply < 66) {
            this.state.currentPhase = 'mid';
        }
        else {
            this.state.currentPhase = 'late';
        }
    }
    getTownhallType(race) {
        switch (race) {
            case enums_1.Race.Protoss: return 59; // Nexus
            case enums_1.Race.Terran: return 41; // Command Center
            case enums_1.Race.Zerg: return 101; // Hatchery
            default: return 59; // Default to Protoss
        }
    }
}
function createBuildOrderManager() {
    const manager = new BuildOrderManager();
    const wrapper = async (world) => {
        await manager.executeNextBuildStep(world);
    };
    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);
    return wrapper;
}
//# sourceMappingURL=build-order.js.map