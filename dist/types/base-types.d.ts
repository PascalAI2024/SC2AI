import { Race, PlayerType } from '../constants/enums';
export interface Position {
    x: number;
    y: number;
}
export interface Unit {
    pos: Position;
    alliance: string;
    type: number;
    tag: string;
    isWorker: () => boolean;
    isStructure: () => boolean;
    isCombatUnit: () => boolean;
    isGasMine: () => boolean;
    isTownhall: () => boolean;
    labels: Map<string, boolean>;
    orders?: any[];
}
export interface PlayerData {
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
}
export interface AgentBase extends PlayerData {
    inGame?: boolean;
    readerId?: string;
    interface: {
        raw: boolean;
    };
    race?: Race;
    enemy?: {
        race: Race;
    };
    settings: {
        type: PlayerType;
        race: Race;
    };
    systems: any[];
}
