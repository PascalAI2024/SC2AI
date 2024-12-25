"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpansionManager = createExpansionManager;
const enums_1 = require("../constants/enums");
const logger_1 = require("../utils/logger");
class ExpansionManager {
    constructor() {
        this.state = {
            currentBases: 1,
            maxBases: 3,
            expansionThresholds: {
                minerals: 1000,
                supply: 60
            },
            expansionLocations: []
        };
        this._system = {};
    }
    pause() {
        logger_1.Logger.log('Expansion manager paused');
    }
    unpause() {
        logger_1.Logger.log('Expansion manager resumed');
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
    }
    setup(world) {
        const resources = world.resources.get();
        const { race } = world.agent.settings;
        // Initialize expansion locations based on race
        this.initializeExpansionLocations(world, race);
        logger_1.Logger.log(`Expansion manager initialized for ${enums_1.Race[race]}`);
    }
    initializeExpansionLocations(world, race) {
        const resources = world.resources.get();
        const { map } = resources;
        // Get all possible expansion locations
        const expansions = map.getExpansions('all');
        this.state.expansionLocations = expansions.map((expansion) => ({
            x: expansion.townhallPosition.x,
            y: expansion.townhallPosition.y,
            claimed: false
        }));
        // Race-specific expansion strategy adjustments
        switch (race) {
            case enums_1.Race.Protoss:
                this.state.maxBases = 4;
                break;
            case enums_1.Race.Terran:
                this.state.maxBases = 3;
                break;
            case enums_1.Race.Zerg:
                this.state.maxBases = 5;
                break;
        }
    }
    async manageExpansion(world) {
        const resources = world.resources.get();
        const { units, actions, frame } = resources;
        // Check if expansion is needed
        const currentSupply = frame.getObservation().playerCommon.foodUsed;
        const currentMinerals = frame.getObservation().playerCommon.minerals;
        if (this.shouldExpand(currentSupply, currentMinerals)) {
            await this.expandToNewBase(world);
        }
    }
    shouldExpand(currentSupply, currentMinerals) {
        return (this.state.currentBases < this.state.maxBases &&
            currentSupply >= this.state.expansionThresholds.supply &&
            currentMinerals >= this.state.expansionThresholds.minerals);
    }
    async expandToNewBase(world) {
        const resources = world.resources.get();
        const { units, actions } = resources;
        // Find an unclaimed expansion location
        const availableExpansion = this.state.expansionLocations.find(loc => !loc.claimed);
        if (!availableExpansion) {
            logger_1.Logger.log('No available expansion locations');
            return;
        }
        // Find a worker to build the expansion
        const workers = units.getWorkers();
        const builderWorker = workers.find((worker) => !worker.orders?.length);
        if (!builderWorker) {
            logger_1.Logger.log('No available workers for expansion');
            return;
        }
        // Determine townhall type based on race
        const townhallType = this.getTownhallType(world.agent.settings.race);
        try {
            // Build townhall at expansion location
            await actions.build(townhallType, {
                x: availableExpansion.x,
                y: availableExpansion.y
            });
            // Mark expansion as claimed
            availableExpansion.claimed = true;
            this.state.currentBases++;
            logger_1.Logger.log(`Expanding to new base at (${availableExpansion.x}, ${availableExpansion.y})`);
        }
        catch (error) {
            logger_1.Logger.log(`Expansion failed: ${error}`, 'error');
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
function createExpansionManager() {
    const manager = new ExpansionManager();
    const wrapper = async (world) => {
        await manager.manageExpansion(world);
    };
    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);
    return wrapper;
}
//# sourceMappingURL=expansion.js.map