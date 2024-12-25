"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImprovedAgent = createImprovedAgent;
const enums_1 = require("../constants/enums");
const event_emitter_1 = require("../utils/event-emitter");
const logger_1 = require("../utils/logger");
class ImprovedAgent extends event_emitter_1.CustomEventEmitter {
    constructor(blueprint = {}) {
        super();
        this.systems = [];
        this.inGame = false;
        this.plugins = new Map();
        this.upgradeIds = [];
        this.interface = { raw: true };
        this.settings = {
            type: enums_1.PlayerType.Participant,
            race: enums_1.Race.Random,
            ...blueprint.settings,
        };
        logger_1.Logger.log('ImprovedAgent initialized');
    }
    use(sys) {
        try {
            const addSys = (s) => {
                this.systems.push(s);
                if (this.inGame && this._world) {
                    s.setup(this._world);
                }
            };
            if (Array.isArray(sys)) {
                sys.forEach(s => addSys(s));
            }
            else {
                addSys(sys);
            }
            logger_1.Logger.log(`Added ${Array.isArray(sys) ? sys.length : 1} system(s)`);
        }
        catch (error) {
            logger_1.Logger.log(`Error adding system: ${error}`, 'error');
            throw error;
        }
    }
    canAfford(unitTypeId, earmarkName) {
        try {
            const { data } = this._world.resources.get();
            const { minerals, vespene } = this;
            const earmarks = earmarkName ? data.getEarmarkTotals(earmarkName) : { minerals: 0, vespene: 0 };
            const unitType = data.getUnitTypeData(unitTypeId);
            const result = ((minerals - earmarks.minerals >= unitType.mineralCost) &&
                (unitType.vespeneCost ? vespene - earmarks.vespene >= unitType.vespeneCost : true));
            if (result && earmarkName) {
                data.settleEarmark(earmarkName);
            }
            return result;
        }
        catch (error) {
            logger_1.Logger.log(`Error in canAfford: ${error}`, 'error');
            return false;
        }
    }
    canAffordUpgrade(upgradeId, earmarkName) {
        try {
            if (!this._world) {
                logger_1.Logger.log('World not initialized', 'warn');
                return false;
            }
            const { data } = this._world.resources.get();
            const { minerals, vespene } = this;
            const earmarks = earmarkName ? data.getEarmarkTotals(earmarkName) : { minerals: 0, vespene: 0 };
            const upgrade = data.getUpgradeData(upgradeId);
            const result = ((minerals - earmarks.minerals >= upgrade.mineralCost) &&
                (upgrade.vespeneCost ? vespene - earmarks.vespene >= upgrade.vespeneCost : true));
            if (result && earmarkName) {
                data.settleEarmark(earmarkName);
            }
            return result;
        }
        catch (error) {
            logger_1.Logger.log(`Error in canAffordUpgrade: ${error}`, 'error');
            return false;
        }
    }
    canAffordN(unitTypeId, maxN = 1) {
        try {
            if (!this._world) {
                logger_1.Logger.log('World not initialized', 'warn');
                return 0;
            }
            const { data } = this._world.resources.get();
            const { minerals, vespene } = this;
            const unitType = data.getUnitTypeData(unitTypeId);
            const maxAffordable = Math.min(Math.floor(minerals / unitType.mineralCost), unitType.vespeneCost ? Math.floor(vespene / unitType.vespeneCost) : Infinity);
            return Math.min(maxAffordable, maxN);
        }
        catch (error) {
            logger_1.Logger.log(`Error in canAffordN: ${error}`, 'error');
            return 0;
        }
    }
    hasTechFor(unitTypeId) {
        try {
            if (!this._world) {
                logger_1.Logger.log('World not initialized', 'warn');
                return false;
            }
            const resources = this._world.resources.get();
            const { data, units } = resources;
            const { techRequirement } = data.getUnitTypeData(unitTypeId);
            const { techAlias } = data.getUnitTypeData(techRequirement);
            const needsOneOf = [techRequirement, ...techAlias];
            if (techRequirement === 0 || needsOneOf.length <= 0) {
                return true;
            }
            const needsOneOfAny = needsOneOf.reduce((acc, techUnitType) => {
                const aliases = data.get('units').filter((utd) => utd.techAlias.includes(techUnitType));
                if (aliases.length > 0) {
                    const aliasUnitIds = aliases.map((a) => a.unitId);
                    acc = acc.concat([techUnitType, ...aliasUnitIds]);
                }
                else {
                    acc = acc.concat([techUnitType]);
                }
                return acc;
            }, []);
            return needsOneOfAny.some((requirementTypeId) => {
                return units.getById(requirementTypeId, { buildProgress: 1 }).length > 0;
            });
        }
        catch (error) {
            logger_1.Logger.log(`Error in hasTechFor: ${error}`, 'error');
            return false;
        }
    }
    setup(world) {
        try {
            this._world = world;
            const { events } = world.resources.get();
            const readerId = events.createReader('agent');
            this.systems.forEach(system => system.setup(world));
            logger_1.Logger.log('Agent setup completed');
            return readerId;
        }
        catch (error) {
            logger_1.Logger.log(`Error in setup: ${error}`, 'error');
            throw error;
        }
    }
    async onStep(world) {
        try {
            const { frame, events } = world.resources.get();
            const observation = frame.getObservation();
            const newUpgrades = this.getNewUpgrades(observation.rawData.player.upgradeIds);
            if (newUpgrades.length > 0) {
                newUpgrades.forEach((upgrade) => {
                    events.write({
                        name: 'upgradeComplete',
                        data: upgrade,
                    });
                    this.emit('upgradeComplete', upgrade);
                    logger_1.Logger.log(`Upgrade completed: ${upgrade}`);
                });
            }
            Object.assign(this, observation.rawData.player, observation.playerCommon);
            for (const system of this.systems) {
                await system(world);
            }
        }
        catch (error) {
            logger_1.Logger.log(`Error in onStep: ${error}`, 'error');
            throw error;
        }
    }
    async onGameStart(world) {
        try {
            this.inGame = true;
            const { frame } = world.resources.get();
            const gameInfo = frame.getGameInfo();
            const thisPlayer = gameInfo.playerInfo.find((player) => player.playerId === this.playerId);
            const enemyPlayer = gameInfo.playerInfo.find((player) => player.playerId !== this.playerId);
            if (thisPlayer) {
                this.settings.race = thisPlayer.raceActual;
                logger_1.Logger.log(`Player race set to: ${this.settings.race}`);
            }
            if (enemyPlayer) {
                this.enemy = {
                    race: enemyPlayer.raceRequested !== enums_1.Race.Random ? enemyPlayer.raceRequested : enums_1.Race.NoRace,
                };
                logger_1.Logger.log(`Enemy race detected: ${this.enemy.race}`);
            }
            for (const system of this.systems) {
                await system(world);
            }
            this.emit('gameStart', gameInfo);
            logger_1.Logger.log('Game started');
        }
        catch (error) {
            logger_1.Logger.log(`Error in onGameStart: ${error}`, 'error');
            throw error;
        }
    }
    getNewUpgrades(currentUpgrades) {
        const newUpgrades = currentUpgrades.filter(upgrade => !this.upgradeIds.includes(upgrade));
        this.upgradeIds = currentUpgrades;
        return newUpgrades;
    }
    registerPlugin(name, plugin) {
        this.plugins.set(name, plugin);
        logger_1.Logger.log(`Plugin registered: ${name}`);
    }
    getPlugin(name) {
        return this.plugins.get(name);
    }
}
function createImprovedAgent(blueprint = {}) {
    return new ImprovedAgent(blueprint);
}
//# sourceMappingURL=improved-agent.js.map