import { Race, PlayerType } from '../constants/enums';
import { CustomEventEmitter } from '../utils/event-emitter';
import { Agent, AgentSystem } from '../types/agent';
declare class ImprovedAgent extends CustomEventEmitter implements Agent {
    _world: any;
    systems: any[];
    inGame: boolean;
    minerals?: number;
    vespene?: number;
    foodCap?: number;
    foodUsed?: number;
    foodArmy?: number;
    foodWorkers?: number;
    idleWorkerCount?: number;
    armyCount?: number;
    warpGateCount?: number;
    larvaCount?: number;
    plugins: Map<string, any>;
    upgradeIds: number[];
    settings: {
        type: PlayerType;
        race: Race;
    };
    interface: {
        raw: boolean;
    };
    constructor(blueprint?: Partial<AgentSystem>);
    use(sys: SystemWrapper<System>[] | SystemWrapper<System>): void;
    canAfford(unitTypeId: number, earmarkName?: string): boolean;
    canAffordUpgrade(upgradeId: number, earmarkName?: string): boolean;
    canAffordN(unitTypeId: number, maxN?: number): number;
    hasTechFor(unitTypeId: number): boolean;
    setup(world: any): string;
    onStep(world: any): Promise<void>;
    onGameStart(world: any): Promise<void>;
    private getNewUpgrades;
    registerPlugin(name: string, plugin: any): void;
    getPlugin(name: string): any;
}
export declare function createImprovedAgent(blueprint?: Partial<AgentSystem>): ImprovedAgent;
export {};
