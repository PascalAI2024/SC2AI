import { Race, PlayerType, Alliance } from '../constants/enums';
import { CustomEventEmitter } from '../utils/event-emitter';
import { Logger } from '../utils/logger';
import { Agent, AgentSystem } from '../types/agent';
import { PlayerData } from '../types/base-types';
import { World } from '../types/world';

class ImprovedAgent extends CustomEventEmitter implements Agent {
    public _world: any;
    public systems: any[] = [];
    public inGame: boolean = false;
    
    // PlayerData properties
    public minerals?: number;
    public vespene?: number;
    public foodCap?: number;
    public foodUsed?: number;
    public foodArmy?: number;
    public foodWorkers?: number;
    public idleWorkerCount?: number;
    public armyCount?: number;
    public warpGateCount?: number;
    public larvaCount?: number;
    public plugins: Map<string, any> = new Map();
    public upgradeIds: number[] = [];

    public settings: {
        type: PlayerType;
        race: Race;
    };

    public interface: { raw: boolean; } = { raw: true };

    constructor(blueprint: Partial<AgentSystem> = {}) {
        super();
        this.settings = {
            type: PlayerType.Participant,
            race: Race.Random,
            ...blueprint.settings,
        };
        Logger.log('ImprovedAgent initialized');
    }

    public use(sys: SystemWrapper<System>[] | SystemWrapper<System>): void {
        try {
            const addSys = (s: SystemWrapper<System>) => {
                this.systems.push(s);
                if (this.inGame && this._world) {
                    s.setup(this._world);
                }
            };

            if (Array.isArray(sys)) {
                sys.forEach(s => addSys(s));
            } else {
                addSys(sys);
            }
            Logger.log(`Added ${Array.isArray(sys) ? sys.length : 1} system(s)`);
        } catch (error) {
            Logger.log(`Error adding system: ${error}`, 'error');
            throw error;
        }
    }

    public canAfford(unitTypeId: number, earmarkName?: string): boolean {
        try {

            const { data } = this._world.resources.get();
            const { minerals, vespene } = this as any;

            const earmarks = earmarkName ? data.getEarmarkTotals(earmarkName) : { minerals: 0, vespene: 0 };
            const unitType = data.getUnitTypeData(unitTypeId);
            
            const result = (
                (minerals - earmarks.minerals >= unitType.mineralCost) &&
                (unitType.vespeneCost ? vespene - earmarks.vespene >= unitType.vespeneCost : true)
            );

            if (result && earmarkName) {
                data.settleEarmark(earmarkName);
            }

            return result;
        } catch (error) {
            Logger.log(`Error in canAfford: ${error}`, 'error');
            return false;
        }
    }

    public canAffordUpgrade(upgradeId: number, earmarkName?: string): boolean {
        try {
            if (!this._world) {
                Logger.log('World not initialized', 'warn');
                return false;
            }

            const { data } = this._world.resources.get();
            const { minerals, vespene } = this as any;

            const earmarks = earmarkName ? data.getEarmarkTotals(earmarkName) : { minerals: 0, vespene: 0 };
            const upgrade = data.getUpgradeData(upgradeId);

            const result = (
                (minerals - earmarks.minerals >= upgrade.mineralCost) &&
                (upgrade.vespeneCost ? vespene - earmarks.vespene >= upgrade.vespeneCost : true)
            );

            if (result && earmarkName) {
                data.settleEarmark(earmarkName);
            }

            return result;
        } catch (error) {
            Logger.log(`Error in canAffordUpgrade: ${error}`, 'error');
            return false;
        }
    }

    public canAffordN(unitTypeId: number, maxN: number = 1): number {
        try {
            if (!this._world) {
                Logger.log('World not initialized', 'warn');
                return 0;
            }

            const { data } = this._world.resources.get();
            const { minerals, vespene } = this as any;

            const unitType = data.getUnitTypeData(unitTypeId);
            
            const maxAffordable = Math.min(
                Math.floor(minerals / unitType.mineralCost),
                unitType.vespeneCost ? Math.floor(vespene / unitType.vespeneCost) : Infinity
            );

            return Math.min(maxAffordable, maxN);
        } catch (error) {
            Logger.log(`Error in canAffordN: ${error}`, 'error');
            return 0;
        }
    }

    public hasTechFor(unitTypeId: number): boolean {
        try {
            if (!this._world) {
                Logger.log('World not initialized', 'warn');
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

            const needsOneOfAny = needsOneOf.reduce((acc: number[], techUnitType: number) => {
                const aliases = data.get('units').filter((utd: any) => utd.techAlias.includes(techUnitType));
                if (aliases.length > 0) {
                    const aliasUnitIds = aliases.map((a: any) => a.unitId);
                    acc = acc.concat([techUnitType, ...aliasUnitIds]);
                } else {
                    acc = acc.concat([techUnitType]);
                }
                return acc;
            }, []);

            return needsOneOfAny.some((requirementTypeId: number) => {
                return units.getById(requirementTypeId, { buildProgress: 1 }).length > 0;
            });
        } catch (error) {
            Logger.log(`Error in hasTechFor: ${error}`, 'error');
            return false;
        }
    }

    public setup(world: any): string {
        try {
            this._world = world;
            const { events } = world.resources.get();

            const readerId = events.createReader('agent');
            this.systems.forEach(system => system.setup(world));
            Logger.log('Agent setup completed');
            return readerId as string;
        } catch (error) {
            Logger.log(`Error in setup: ${error}`, 'error');
            throw error;
        }
    }

    public async onStep(world: any): Promise<void> {
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
                    Logger.log(`Upgrade completed: ${upgrade}`);
                });
            }

            Object.assign(this, observation.rawData.player, observation.playerCommon);

            for (const system of this.systems) {
                await system(world);
            }
        } catch (error) {
            Logger.log(`Error in onStep: ${error}`, 'error');
            throw error;
        }
    }

    public async onGameStart(world: any): Promise<void> {
        try {
            this.inGame = true;

            const { frame } = world.resources.get();
            const gameInfo = frame.getGameInfo();

            const thisPlayer = gameInfo.playerInfo.find((player: { playerId: number }) => player.playerId === (this as any).playerId);
            const enemyPlayer = gameInfo.playerInfo.find((player: { playerId: number }) => player.playerId !== (this as any).playerId);

            if (thisPlayer) {
                this.settings.race = thisPlayer.raceActual;
                Logger.log(`Player race set to: ${this.settings.race}`);
            }

            if (enemyPlayer) {
                (this as any).enemy = {
                    race: enemyPlayer.raceRequested !== Race.Random ? enemyPlayer.raceRequested : Race.NoRace,
                };
                Logger.log(`Enemy race detected: ${(this as any).enemy.race}`);
            }

            for (const system of this.systems) {
                await system(world);
            }

            this.emit('gameStart', gameInfo);
            Logger.log('Game started');
        } catch (error) {
            Logger.log(`Error in onGameStart: ${error}`, 'error');
            throw error;
        }
    }

    private getNewUpgrades(currentUpgrades: number[]): number[] {
        const newUpgrades = currentUpgrades.filter(upgrade => !this.upgradeIds.includes(upgrade));
        this.upgradeIds = currentUpgrades;
        return newUpgrades;
    }

    public registerPlugin(name: string, plugin: any): void {
        this.plugins.set(name, plugin);
        Logger.log(`Plugin registered: ${name}`);
    }

    public getPlugin(name: string): any {
        return this.plugins.get(name);
    }
}

export function createImprovedAgent(blueprint: Partial<AgentSystem> = {}): ImprovedAgent {
    return new ImprovedAgent(blueprint);
}
