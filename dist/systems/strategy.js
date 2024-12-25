"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStrategyManager = createStrategyManager;
const enums_1 = require("../constants/enums");
const logger_1 = require("../utils/logger");
class StrategyManager {
    constructor() {
        this.state = {
            currentObjective: 'economy',
            techPath: 'early',
            armyComposition: {}
        };
        this._system = {};
    }
    pause() {
        logger_1.Logger.log('Strategy manager paused');
    }
    unpause() {
        logger_1.Logger.log('Strategy manager resumed');
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
    }
    setup(world) {
        const { race } = world.agent.settings;
        this.initializeRaceStrategy(race);
        logger_1.Logger.log(`Strategy initialized for ${enums_1.Race[race]}`);
    }
    initializeRaceStrategy(race) {
        switch (race) {
            case enums_1.Race.Protoss:
                this.initProtossStrategy();
                break;
            case enums_1.Race.Terran:
                this.initTerranStrategy();
                break;
            case enums_1.Race.Zerg:
                this.initZergStrategy();
                break;
            default:
                this.initDefaultStrategy();
        }
    }
    initProtossStrategy() {
        this.state.armyComposition = {
            65: 0.4, // Zealot
            74: 0.3, // Stalker
            77: 0.2, // Sentry
            78: 0.1 // High Templar
        };
    }
    initTerranStrategy() {
        this.state.armyComposition = {
            51: 0.5, // Marine
            54: 0.3, // Marauder
            88: 0.2 // Medivac
        };
    }
    initZergStrategy() {
        this.state.armyComposition = {
            105: 0.4, // Zergling
            106: 0.2, // Baneling
            108: 0.3, // Roach
            109: 0.1 // Hydralisk
        };
    }
    initDefaultStrategy() {
        this.state.armyComposition = {
            65: 0.5, // Generic unit 1
            74: 0.3, // Generic unit 2
            77: 0.2 // Generic unit 3
        };
    }
    async evaluateStrategy(world) {
        const resources = world.resources.get();
        const { units, frame } = resources;
        // Analyze current game state
        const currentSupply = frame.getObservation().playerCommon.foodUsed;
        const enemyUnits = units.getById(0, { alliance: 'enemy' });
        const ownUnits = units.getCombatUnits();
        // Determine current objective based on game state
        this.updateGameObjective(currentSupply, ownUnits, enemyUnits);
        // Adjust tech path
        this.updateTechPath(currentSupply);
        // Log current strategy
        logger_1.Logger.log(`Current Objective: ${this.state.currentObjective}, Tech Path: ${this.state.techPath}`);
    }
    updateGameObjective(currentSupply, ownUnits, enemyUnits) {
        // Early game focus on economy
        if (currentSupply < 30) {
            this.state.currentObjective = 'economy';
            return;
        }
        // Determine objective based on army strength and enemy composition
        const ownArmyStrength = this.calculateArmyStrength(ownUnits);
        const enemyArmyStrength = this.calculateArmyStrength(enemyUnits);
        if (ownArmyStrength > enemyArmyStrength * 1.5) {
            this.state.currentObjective = 'attack';
        }
        else if (ownArmyStrength < enemyArmyStrength * 0.5) {
            this.state.currentObjective = 'defend';
        }
        else {
            this.state.currentObjective = 'expansion';
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
    updateTechPath(currentSupply) {
        if (currentSupply < 40) {
            this.state.techPath = 'early';
        }
        else if (currentSupply < 80) {
            this.state.techPath = 'mid';
        }
        else {
            this.state.techPath = 'late';
        }
    }
    getStrategyRecommendation(world) {
        // Provide recommendations based on current strategy
        return {
            objective: this.state.currentObjective,
            techPath: this.state.techPath,
            armyComposition: this.state.armyComposition
        };
    }
}
function createStrategyManager() {
    const manager = new StrategyManager();
    const wrapper = async (world) => {
        await manager.evaluateStrategy(world);
    };
    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);
    return wrapper;
}
//# sourceMappingURL=strategy.js.map