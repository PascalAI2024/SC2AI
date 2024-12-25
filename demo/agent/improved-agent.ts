import { Race, PlayerType } from '../constants/enums';

// Interfaces
interface AgentSystem {
    setup?: (world: World, lateSetup?: boolean) => void;
    onStep?: (world: World) => Promise<void>;
    onGameStart?: (world: World) => Promise<void>;
    settings?: {
        type?: PlayerType;
        race?: Race;
    };
    interface?: { raw: boolean };
}

interface World {
    resources: {
        get: () => {
            events: any;
            frame: any;
        };
    };
}

interface UnitType {
    unitId: number;
    techAlias: number[];
}

// CustomEventEmitter
class CustomEventEmitter {
    private events: { [key: string]: Function[] } = {};

    on(event: string, listener: Function): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event: string, ...args: any[]): void {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }
    }
}

// Simple logger
class Logger {
    static log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
}

class ImprovedAgent extends CustomEventEmitter implements AgentSystem {
    private world: World | null = null;
    private inGame: boolean = false;
    private systems: AgentSystem[] = [];
    private plugins: Map<string, any> = new Map();
    private upgradeIds: number[] = [];

    public settings: {
        type: PlayerType;
        race: Race;
    };

    public interface: { raw: boolean };

    constructor(blueprint: Partial<AgentSystem> = {}) {
        super();
        this.settings = {
            type: PlayerType.PARTICIPANT,
            race: Race.RANDOM,
            ...blueprint.settings,
        };
        this.interface = blueprint.interface || { raw: true };
        Logger.log('ImprovedAgent initialized', 'info');
    }

    public use(sys: AgentSystem | AgentSystem[]): void {
        try {
            const addSys = (s: AgentSystem) => {
                this.systems.push(s);
                if (this.inGame && this.world) {
                    s.setup?.(this.world, true);
                }
            };

            if (Array.isArray(sys)) {
                sys.forEach(s => addSys(s));
            } else {
                addSys(sys);
            }
            Logger.log(`Added ${Array.isArray(sys) ? sys.length : 1} system(s)`, 'info');
        } catch (error) {
            Logger.log(`Error adding system: ${error}`, 'error');
            throw error;
        }
    }

    public canAfford(unitTypeId: number, earmarkName?: string): boolean {
        try {
            if (!this.world) {
                Logger.log('World not initialized', 'warn');
                return false;
            }

            const { data } = this.world.resources.get() as any;
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

    public canAffordN(unitTypeId: number, maxN: number = 1): number {
        try {
            if (!this.world) {
                Logger.log('World not initialized', 'warn');
                return 0;
            }

            const { data } = this.world.resources.get() as any;
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

    public canAffordUpgrade(upgradeId: number, earmarkName?: string): boolean {
        try {
            if (!this.world) {
                Logger.log('World not initialized', 'warn');
                return false;
            }

            const { data } = this.world.resources.get() as any;
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

    public hasTechFor(unitTypeId: number): boolean {
        try {
            if (!this.world) {
                Logger.log('World not initialized', 'warn');
                return false;
            }

            const { data, resources } = this.world.resources.get() as any;
            const { units } = resources.get();

            const { techRequirement } = data.getUnitTypeData(unitTypeId);
            const { techAlias } = data.getUnitTypeData(techRequirement);

            const needsOneOf = [techRequirement, ...techAlias];

            if (techRequirement === 0 || needsOneOf.length <= 0) {
                return true;
            }

            const needsOneOfAny = needsOneOf.reduce((acc: number[], techUnitType: number) => {
                const aliases = data.get('units').filter((utd: UnitType) => utd.techAlias.includes(techUnitType));
                if (aliases.length > 0) {
                    const aliasUnitIds = aliases.map((a: UnitType) => a.unitId);
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

    public setup(world: World): number {
        try {
            this.world = world;
            const { events } = world.resources.get();

            const readerId = events.createReader('agent');
            this.systems.forEach(system => system.setup?.(world));
            Logger.log('Agent setup completed', 'info');
            return readerId;
        } catch (error) {
            Logger.log(`Error in setup: ${error}`, 'error');
            throw error;
        }
    }

    public async onStep(world: World): Promise<void> {
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
                    Logger.log(`Upgrade completed: ${upgrade}`, 'info');
                });
            }

            Object.assign(this, observation.rawData.player, observation.playerCommon);

            for (const system of this.systems) {
                await system.onStep?.(world);
            }
        } catch (error) {
            Logger.log(`Error in onStep: ${error}`, 'error');
            throw error;
        }
    }

    public async onGameStart(world: World): Promise<void> {
        try {
            this.inGame = true;

            const { frame } = world.resources.get();
            const gameInfo = frame.getGameInfo();

            const thisPlayer = gameInfo.playerInfo.find(player => player.playerId === (this as any).playerId);
            const enemyPlayer = gameInfo.playerInfo.find(player => player.playerId !== (this as any).playerId);

            if (thisPlayer) {
                this.settings.race = thisPlayer.raceActual;
                Logger.log(`Player race set to: ${this.settings.race}`, 'info');
            }

            if (enemyPlayer) {
                (this as any).enemy = {
                    race: enemyPlayer.raceRequested !== Race.RANDOM ? enemyPlayer.raceRequested : Race.NORACE,
                };
                Logger.log(`Enemy race detected: ${(this as any).enemy.race}`, 'info');
            }

            for (const system of this.systems) {
                await system.onGameStart?.(world);
            }

            this.emit('gameStart', gameInfo);
            Logger.log('Game started', 'info');
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

    // Plugin system
    public registerPlugin(name: string, plugin: any): void {
        this.plugins.set(name, plugin);
        Logger.log(`Plugin registered: ${name}`, 'info');
    }

    public getPlugin(name: string): any {
        return this.plugins.get(name);
    }
}

export function createImprovedAgent(blueprint: Partial<AgentSystem> = {}): ImprovedAgent {
    return new ImprovedAgent(blueprint);
}
