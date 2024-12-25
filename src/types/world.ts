import { Agent } from './agent';

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

export type EventType = 'engine' | 'agent' | 'build' | 'unit' | 'all';

export interface SystemEvent {
    type: EventType;
    name: string;
    data: any;
    gameLoop: number;
    readers: string[];
    consume: (readerId: string) => void;
    destroy: () => void;
}

export interface SystemEventData {
    name: string;
    type?: EventType;
    data?: any;
}

export interface EventChannel {
    createReader: (type?: EventType) => string;
    removeReader: (readerId: string) => void;
    read: (readerId: string) => SystemEvent[];
    write: (event: SystemEventData, readerId?: string) => void;
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
            raceRequested: number;
            raceActual: number;
        }>;
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
    getEarmarkTotals: (name?: string) => { minerals: number; vespene: number; };
    settleEarmark: (name: string) => void;
    get: (type: string) => any[];
}

export interface Resources {
    events: EventChannel;
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

export interface Earmark {
    name: string;
    minerals: number;
    vespene: number;
}

export interface StorageBlueprint {
    register: (name: string, fn: Function) => void;
    mineralCost: (unitType: number) => number;
    getAbilityData: (abilityId: number) => any;
    getEffectData: (effectId: number) => any;
    getUpgradeData: (upgradeId: number) => any;
    getUnitTypeData: (unitTypeId: number) => any;
    findUnitTypesWithAbility: (abilityId: number) => number[];
    addEarmark: (earmark: Earmark) => Earmark[];
    getEarmarkTotals: (earmarkName: string) => Earmark;
    settleEarmark: (earmarkName: string) => Earmark[];
}

export interface DataStorage extends StorageBlueprint, Map<string, any> {
    get: (type: string) => any[];
}

export interface ResourceManager {
    get: () => Resources;
    set: (resources: Partial<Resources>) => void;
}

export interface World {
    agent: Agent;
    data: DataStorage & Map<string, any>;
    resources: ResourceManager;
}
