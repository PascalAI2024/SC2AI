import { System, SystemWrapper } from '../types/agent';
interface BuildOrderState {
    currentPhase: 'early' | 'mid' | 'late';
    supplyThresholds: {
        [key: string]: number;
    };
    buildQueue: Array<{
        unitType: number;
        priority: number;
    }>;
}
declare class BuildOrderManager implements System {
    _system: any;
    state: BuildOrderState;
    constructor();
    pause(): void;
    unpause(): void;
    setState(newState: Partial<BuildOrderState>): void;
    setup(world: any): void;
    private initProtossBuildOrder;
    private initTerranBuildOrder;
    private initZergBuildOrder;
    executeNextBuildStep(world: any): Promise<void>;
    private updateGamePhase;
    private getTownhallType;
}
export declare function createBuildOrderManager(): SystemWrapper<BuildOrderManager>;
export {};
