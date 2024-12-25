"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScoutSystem = createScoutSystem;
const create_system_1 = require("../utils/create-system");
const logger_1 = require("../utils/logger");
const unit_type_1 = require("../constants/unit-type");
class ScoutSystem extends create_system_1.System {
    getScoutTargets(resources) {
        const { map } = resources;
        const targets = [];
        // Get all possible enemy base locations
        const startingPositions = map.getStartingPositions();
        const enemyExpansions = map.getExpansions('enemy');
        // Add main base locations
        startingPositions.forEach(pos => targets.push(pos));
        // Add natural expansions
        enemyExpansions
            .filter(exp => exp.mineralFields.length >= 8) // Only consider rich expansions
            .forEach(exp => targets.push(exp.townhallPosition));
        return targets;
    }
    async assignScoutWorker(resources) {
        const { units, actions, frame } = resources;
        const currentGameLoop = frame.getGameLoop();
        // Only scout if we haven't scouted recently
        if (currentGameLoop - this.state.lastScoutTime < 1000)
            return;
        // Don't reassign if we already have a scout
        if (this.state.scoutingUnit) {
            const existingScout = units.getWorkers().find(w => w.tag === this.state.scoutingUnit);
            if (existingScout)
                return;
        }
        // Get a worker to scout with
        const workers = units.getWorkers();
        if (workers.length < 15)
            return; // Don't scout too early
        const scout = workers[0]; // Get first available worker
        this.setState({
            scoutingUnit: scout.tag,
            lastScoutTime: currentGameLoop
        });
        // Send to first unexplored target
        const targets = this.getScoutTargets(resources);
        const unexploredTargets = targets.filter(pos => !resources.map.isVisible(pos));
        if (unexploredTargets.length > 0) {
            await actions.move([scout], unexploredTargets[0], true);
        }
    }
    async manageObserverScouts(resources) {
        const { units, actions } = resources;
        const observers = units.getById(unit_type_1.OBSERVER);
        if (observers.length === 0) {
            // Try to build an observer if we have a robo facility
            const robos = units.getById(unit_type_1.ROBOTICSFACILITY, { buildProgress: 1 });
            if (robos.length > 0) {
                await actions.train(unit_type_1.OBSERVER, robos[0]);
            }
            return;
        }
        // Update observer patrol points
        const patrolPoints = this.state.observerScoutLocations;
        if (patrolPoints.length === 0) {
            const expansions = resources.map.getExpansions('enemy');
            this.setState({
                observerScoutLocations: expansions.map(exp => exp.townhallPosition)
            });
            return;
        }
        // Move observers between patrol points
        await Promise.all(observers.map(async (observer, index) => {
            const targetPoint = patrolPoints[index % patrolPoints.length];
            await actions.move([observer], targetPoint, true);
        }));
    }
    updateEnemyIntel(resources) {
        const { map } = resources;
        const enemyBases = map.getExpansions('enemy')
            .filter(exp => exp.mineralFields.some(field => !map.isVisible(field.pos)));
        this.setState({ enemyExpansions: enemyBases.length });
    }
    constructor(options) {
        super({
            name: 'ScoutSystem',
            type: 'scout',
            defaultOptions: options.defaultOptions,
            async onStep({ resources }) {
                try {
                    const resourcesObj = resources.get();
                    // Early game worker scouting
                    await this.assignScoutWorker(resourcesObj);
                    // Mid-game observer scouting
                    await this.manageObserverScouts(resourcesObj);
                    // Update enemy information
                    this.updateEnemyIntel(resourcesObj);
                }
                catch (error) {
                    logger_1.Logger.log(`Error in ScoutSystem onStep: ${error}`, 'error');
                }
            },
            async onEnemyFirstSeen({ resources }, unit) {
                try {
                    // Update known enemy structures
                    if (unit.isStructure()) {
                        const structures = [...this.state.knownEnemyStructures];
                        structures.push({
                            position: unit.pos,
                            type: unit.type,
                            lastSeen: resources.get().frame.getGameLoop()
                        });
                        this.setState({ knownEnemyStructures: structures });
                        // Update enemy tech path based on structures
                        this.updateEnemyTechPath(unit.type);
                    }
                }
                catch (error) {
                    logger_1.Logger.log(`Error in ScoutSystem onEnemyFirstSeen: ${error}`, 'error');
                }
            }
        });
    }
    updateEnemyTechPath(structureType) {
        // Update enemy tech path based on first seen tech structure
        if (this.state.enemyTech !== 'unknown')
            return;
        let techPath = 'unknown';
        switch (structureType) {
            case 62: // GATEWAY
                techPath = 'gateway';
                break;
            case 71: // ROBOTICS_FACILITY
                techPath = 'robo';
                break;
            case 64: // STARGATE
                techPath = 'stargate';
                break;
            case 69: // DARK_SHRINE
                techPath = 'dark';
                break;
            case 67: // TEMPLAR_ARCHIVES
                techPath = 'templar';
                break;
        }
        if (techPath !== 'unknown') {
            this.setState({ enemyTech: techPath });
        }
    }
}
function createScoutSystem(options) {
    return new ScoutSystem(options);
}
//# sourceMappingURL=scout.js.map