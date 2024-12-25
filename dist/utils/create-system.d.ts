export interface SystemState {
    [key: string]: any;
}
export interface SystemOptions {
    state?: SystemState;
}
export interface BuildTask {
    type: 'build' | 'upgrade';
    unit?: number;
    upgrade?: number;
    count?: number;
}
export interface SystemBlueprint {
    name: string;
    type?: 'build' | 'combat' | 'economy' | 'scout';
    defaultOptions?: {
        state?: SystemState;
    };
    buildOrder?: [number, BuildTask][];
    onStep?: (world: any) => Promise<void>;
    onGameStart?: (world: any) => Promise<void>;
    onUnitCreated?: (world: any, unit: any) => Promise<void>;
    onUnitFinished?: (world: any, unit: any) => Promise<void>;
    onUpgradeComplete?: (world: any, upgrade: any) => Promise<void>;
    buildComplete?: () => Promise<void>;
    [key: string]: any;
}
export interface SystemMethods {
    setState(newState: Partial<SystemState>): void;
    getBuildOrder(): [number, BuildTask][] | undefined;
    getType(): string;
    getName(): string;
    [key: string]: any;
}
export declare class System implements SystemMethods {
    name: string;
    type: string;
    state: SystemState;
    buildOrder?: [number, BuildTask][];
    constructor(blueprint: SystemBlueprint);
    setState(newState: Partial<SystemState>): void;
    getBuildOrder(): [number, BuildTask][] | undefined;
    getType(): string;
    getName(): string;
}
export declare function createSystem(blueprint: SystemBlueprint): System;
