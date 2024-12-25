"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCombatManager = createCombatManager;
const enums_1 = require("../constants/enums");
const logger_1 = require("../utils/logger");
class CombatManager {
    constructor() {
        this.state = {
            armyComposition: {},
            defensivePositions: [],
            attackThreshold: 0.7, // 70% army strength
            retreatThreshold: 0.3 // 30% army strength
        };
        this._system = {};
    }
    pause() {
        logger_1.Logger.log('Combat manager paused');
    }
    unpause() {
        logger_1.Logger.log('Combat manager resumed');
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
    }
    setup(world) {
        const resources = world.resources.get();
        const { race } = world.agent.settings;
        // Race-specific army composition
        switch (race) {
            case enums_1.Race.Protoss:
                this.initProtossCombat();
                break;
            case enums_1.Race.Terran:
                this.initTerranCombat();
                break;
            case enums_1.Race.Zerg:
                this.initZergCombat();
                break;
            default:
                logger_1.Logger.log('No specific combat strategy for random race');
        }
        logger_1.Logger.log(`Combat strategy initialized for ${enums_1.Race[race]}`);
    }
    initProtossCombat() {
        // Protoss composition: Zealots, Stalkers, Sentries
        this.state.armyComposition = {
            65: 0.5, // Zealot
            74: 0.3, // Stalker
            77: 0.2 // Sentry
        };
    }
    initTerranCombat() {
        // Terran composition: Marines, Marauders, Medivacs
        this.state.armyComposition = {
            51: 0.6, // Marine
            54: 0.3, // Marauder
            88: 0.1 // Medivac
        };
    }
    initZergCombat() {
        // Zerg composition: Zerglings, Banelings, Roaches
        this.state.armyComposition = {
            105: 0.5, // Zergling
            106: 0.3, // Baneling
            108: 0.2 // Roach
        };
    }
    async manageCombat(world) {
        const resources = world.resources.get();
        const { units, actions, map } = resources;
        // Get combat units
        const combatUnits = units.getCombatUnits();
        const enemyUnits = units.getById(0, { alliance: 'enemy' });
        // Calculate army strength
        const armyStrength = this.calculateArmyStrength(combatUnits);
        const enemyStrength = this.calculateArmyStrength(enemyUnits);
        // Determine combat strategy based on army strength
        if (armyStrength / enemyStrength >= this.state.attackThreshold) {
            await this.attackMove(world, combatUnits);
        }
        else if (armyStrength / enemyStrength <= this.state.retreatThreshold) {
            await this.defensiveRetreat(world, combatUnits);
        }
        else {
            await this.maintainFormation(world, combatUnits);
        }
    }
    calculateArmyStrength(units) {
        return units.reduce((strength, unit) => {
            // Simple strength calculation based on unit type
            const unitStrengthMap = {
                // Protoss
                65: 2, // Zealot
                74: 3, // Stalker
                77: 1, // Sentry
                // Terran
                51: 1, // Marine
                54: 2, // Marauder
                88: 0.5, // Medivac
                // Zerg
                105: 0.5, // Zergling
                106: 1, // Baneling
                108: 2 // Roach
            };
            return strength + (unitStrengthMap[unit.type] || 1);
        }, 0);
    }
    async attackMove(world, units) {
        const resources = world.resources.get();
        const { map } = resources;
        // Find enemy starting position
        const enemyStartPos = map.getStartingPositions()[1];
        if (enemyStartPos) {
            await resources.actions.attackMove(units, enemyStartPos);
            logger_1.Logger.log('Attacking enemy base');
        }
    }
    async defensiveRetreat(world, units) {
        const resources = world.resources.get();
        const { map } = resources;
        // Retreat to main base
        const mainBasePos = map.getExpansions('self')[0].townhallPosition;
        await resources.actions.move(units, mainBasePos, true);
        logger_1.Logger.log('Retreating to main base');
    }
    async maintainFormation(world, units) {
        const resources = world.resources.get();
        const combatRally = resources.map.getCombatRally();
        // Group units at combat rally point
        await resources.actions.move(units, combatRally, true);
        logger_1.Logger.log('Maintaining defensive formation');
    }
}
function createCombatManager() {
    const manager = new CombatManager();
    const wrapper = async (world) => {
        await manager.manageCombat(world);
    };
    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);
    return wrapper;
}
//# sourceMappingURL=combat.js.map