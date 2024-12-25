"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScoutManager = createScoutManager;
const enums_1 = require("../constants/enums");
const logger_1 = require("../utils/logger");
class ScoutManager {
    constructor() {
        this.state = {
            scoutingUnits: [],
            exploredPositions: [],
            lastScoutTime: 0,
            scoutInterval: 300 // Scout every 300 game loops (roughly every 5 seconds)
        };
        this._system = {};
    }
    pause() {
        logger_1.Logger.log('Scout manager paused');
    }
    unpause() {
        logger_1.Logger.log('Scout manager resumed');
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
    }
    setup(world) {
        const resources = world.resources.get();
        const { race } = world.agent.settings;
        // Select appropriate scouting unit based on race
        const scoutUnitType = this.getScoutUnitType(race);
        const scoutUnits = resources.units.getByType(scoutUnitType);
        if (scoutUnits.length > 0) {
            this.state.scoutingUnits = scoutUnits.map((unit) => unit.tag);
            logger_1.Logger.log(`Initialized scout units for ${enums_1.Race[race]}`);
        }
        else {
            logger_1.Logger.log('No scout units available');
        }
    }
    getScoutUnitType(race) {
        switch (race) {
            case enums_1.Race.Protoss: return 71; // Probe
            case enums_1.Race.Terran: return 45; // SCV
            case enums_1.Race.Zerg: return 104; // Drone
            default: return 71; // Default to Probe
        }
    }
    async scout(world) {
        const resources = world.resources.get();
        const { units, map, actions } = resources;
        const currentGameLoop = resources.frame.getGameLoop();
        // Only scout periodically
        if (currentGameLoop - this.state.lastScoutTime < this.state.scoutInterval) {
            return;
        }
        // Get scout units
        const scoutUnits = this.state.scoutingUnits
            .map(tag => units.getById(tag)[0])
            .filter((unit) => unit !== undefined && !unit.orders?.length);
        if (scoutUnits.length === 0) {
            return;
        }
        // Find unexplored map positions
        const startPositions = map.getStartingPositions();
        const unexploredPositions = startPositions.filter(pos => !this.state.exploredPositions.some(explored => this.positionsMatch(explored, pos)));
        if (unexploredPositions.length > 0) {
            const targetPosition = unexploredPositions[0];
            // Send scout to unexplored position
            await actions.move(scoutUnits, targetPosition);
            // Track explored positions
            this.state.exploredPositions.push(targetPosition);
            this.state.lastScoutTime = currentGameLoop;
            logger_1.Logger.log(`Scouting unexplored position: ${JSON.stringify(targetPosition)}`);
        }
    }
    positionsMatch(pos1, pos2, tolerance = 5) {
        return (Math.abs(pos1.x - pos2.x) <= tolerance &&
            Math.abs(pos1.y - pos2.y) <= tolerance);
    }
    analyzeEnemyBase(world) {
        const resources = world.resources.get();
        const enemyUnits = resources.units.getById(0, { alliance: 'enemy' });
        if (enemyUnits.length > 0) {
            // Determine enemy race based on units
            const enemyRace = this.determineEnemyRace(enemyUnits);
            if (enemyRace) {
                this.state.enemyRace = enemyRace;
                logger_1.Logger.log(`Enemy race detected: ${enums_1.Race[enemyRace]}`);
            }
            // Find enemy base location
            const baseLocation = this.findEnemyBaseLocation(enemyUnits);
            if (baseLocation) {
                this.state.enemyBaseLocation = baseLocation;
                logger_1.Logger.log(`Enemy base location found: ${JSON.stringify(baseLocation)}`);
            }
        }
    }
    determineEnemyRace(enemyUnits) {
        const raceUnitTypes = {
            [enums_1.Race.Protoss]: [59, 63, 65, 74], // Nexus, Gateway, Zealot, Stalker
            [enums_1.Race.Terran]: [41, 48, 51, 54], // Command Center, Barracks, Marine, Marauder
            [enums_1.Race.Zerg]: [101, 106, 105, 108], // Hatchery, Spawning Pool, Zergling, Roach
            [enums_1.Race.NoRace]: [],
            [enums_1.Race.Random]: [] // Add Random race with empty array
        };
        for (const [race, unitTypes] of Object.entries(raceUnitTypes)) {
            if (enemyUnits.some((unit) => unitTypes.includes(unit.type))) {
                return parseInt(race);
            }
        }
        return undefined;
    }
    findEnemyBaseLocation(enemyUnits) {
        // Look for townhall-type structures
        const townhallTypes = [59, 41, 101]; // Nexus, Command Center, Hatchery
        const townhalls = enemyUnits.filter(unit => townhallTypes.includes(unit.type));
        if (townhalls.length > 0) {
            // Return position of first townhall found
            return townhalls[0].pos;
        }
        return undefined;
    }
}
function createScoutManager() {
    const manager = new ScoutManager();
    const wrapper = async (world) => {
        await manager.scout(world);
        manager.analyzeEnemyBase(world);
    };
    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);
    return wrapper;
}
//# sourceMappingURL=scout.js.map