import { AgentBase } from './base-types';
export interface System {
    _system: any;
    state: any;
    pause: () => void;
    unpause: () => void;
    setState: (state: any) => void;
    setup: (world: any) => void;
}
export interface SystemWrapper<T extends System> {
    (world: any): Promise<any>;
    setup: (world: any) => void;
    _system: T;
}
export interface Agent extends AgentBase {
    _world: any;
    onGameStart: (world: any) => Promise<any>;
    onStep?: (resources: any) => void;
    canAfford(unitTypeId: number, earmarkName?: string): boolean;
    canAffordN(unitTypeId: number, nQtyMax?: number): number;
    canAffordUpgrade: (upgradeId: number) => boolean;
    hasTechFor: (unitTypeId: number) => boolean;
    use: (sys: SystemWrapper<System>[] | SystemWrapper<System>) => void;
    setup: (world: any) => string;
}
export interface AgentSystem {
    setup?: (world: any) => void;
    onStep?: (world: any) => Promise<void>;
    onGameStart?: (world: any) => Promise<void>;
    settings?: Partial<AgentBase['settings']>;
    interface?: {
        raw: boolean;
    };
}
