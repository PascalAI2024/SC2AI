import { Race, PlayerType } from '../constants/enums';
export interface Agent extends PlayerData {
    _world: World;
    inGame?: boolean;
    readerId?: string;
    onGameStart: (world: World) => Promise<any>;
    onStep?: (resources: World) => void;
    interface: {
        raw: boolean;
    };
    canAfford(unitTypeId: number, earmarkName?: string): boolean;
    canAffordN(unitTypeId: number, nQtyMax?: number): number;
    canAffordUpgrade: (upgradeId: number) => boolean;
    hasTechFor: (unitTypeId: number) => boolean;
    race?: Race;
    enemy?: {
        race: Race;
    };
    settings: {
        type: PlayerType;
        race: Race;
    };
    systems: any[];
    use: (sys: any | any[]) => void;
    setup: (world: World) => number;
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
export interface AgentSystem {
    setup?: (world: World, lateSetup?: boolean) => void;
    onStep?: (world: World) => Promise<void>;
    onGameStart?: (world: World) => Promise<void>;
    settings?: {
        type?: PlayerType;
        race?: Race;
    };
    interface: {
        raw: boolean;
    };
}
export interface GameData {
    getUnitTypeData: (unitTypeId: number) => {
        mineralCost: number;
        vespeneCost?: number;
        techRequirement: number;
        techAlias: number[];
    };
    getUpgradeData: (upgradeId: number) => {
        mineralCost: number;
        vespeneCost?: number;
    };
    getEarmarkTotals: (name?: string) => {
        minerals: number;
        vespene: number;
    };
    settleEarmark: (name: string) => void;
    get: (type: string) => any[];
}
export interface Frame {
    getGameLoop: () => number;
    getObservation: () => {
        rawData: {
            player: {
                upgradeIds: number[];
            };
        };
        playerCommon: any;
    };
    getGameInfo: () => {
        playerInfo: Array<{
            playerId: number;
            raceRequested: Race;
            raceActual: Race;
        }>;
    };
}
export interface Events {
    createReader: (name: string) => number;
    write: (event: {
        name: string;
        data: any;
    }) => void;
}
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
export interface PlayerInfo {
    playerId: number;
    raceRequested: Race;
    raceActual: Race;
}
export interface Resources {
    events: Events;
    frame: Frame;
    data: GameData;
    units: {
        getWorkers: () => Unit[];
        getMineralWorkers: () => Unit[];
        getGasWorkers: () => Unit[];
        getCombatUnits: () => Unit[];
        getById: (unitId: number, options?: any) => Unit[];
        getByType: (unitType: number) => Unit[];
        getClosest: (pos: Position, units: Unit[], n: number) => Unit[];
    };
    actions: {
        move: (units: Unit[], position: Position, queue?: boolean) => Promise<void>;
        attack: (units: Unit[], target: Unit | Position, queue?: boolean) => Promise<void>;
        train: (unitType: number, facility: Unit) => Promise<void>;
        build: (unitType: number, position: Position) => Promise<void>;
        gather: (workers: Unit | Unit[]) => Promise<void>;
        mine: (workers: Unit[], target: Unit) => Promise<void>;
        attackMove: (units: Unit[], position: Position, queue?: boolean) => Promise<void>;
    };
    map: {
        getExpansions: (alliance: string) => Array<{
            townhallPosition: Position;
            mineralFields: Unit[];
            vespeneGeysers: Unit[];
        }>;
        getStartingPositions: () => Position[];
        getHeight: (position: Position) => number;
        isVisible: (position: Position) => boolean;
        getCombatRally: () => Position;
    };
}
export interface World {
    agent: Agent;
    data: DataStorage;
    resources: {
        get: () => Resources;
    };
}
export interface DataStorage {
    register: (name: string, fn: Function) => void;
    mineralCost: (unitType: number) => number;
    getAbilityData: (abilityId: number) => any;
    getEffectData: (effectId: number) => any;
    getUpgradeData: (upgradeId: number) => any;
    getUnitTypeData: (unitTypeId: number) => any;
    findUnitTypesWithAbility: (abilityId: number) => number[];
    addEarmark: (earmark: {
        name: string;
        minerals: number;
        vespene: number;
    }) => any[];
    getEarmarkTotals: (earmarkName: string) => {
        minerals: number;
        vespene: number;
    };
    settleEarmark: (earmarkName: string) => any[];
}
export type TechPath = 'unknown' | 'gateway' | 'robo' | 'stargate' | 'dark' | 'templar';
export interface SystemInitializer<T> {
    defaultOptions: {
        state: T;
    };
}
