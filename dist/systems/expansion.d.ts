import { System, SystemWrapper } from '../types/agent';
interface ExpansionState {
    currentBases: number;
    maxBases: number;
    expansionThresholds: {
        minerals: number;
        supply: number;
    };
    expansionLocations: Array<{
        x: number;
        y: number;
        claimed: boolean;
    }>;
}
declare class ExpansionManager implements System {
    _system: any;
    state: ExpansionState;
    constructor();
    pause(): void;
    unpause(): void;
    setState(newState: Partial<ExpansionState>): void;
    setup(world: any): void;
    private initializeExpansionLocations;
    manageExpansion(world: any): Promise<void>;
    private shouldExpand;
    private expandToNewBase;
    private getTownhallType;
}
export declare function createExpansionManager(): SystemWrapper<ExpansionManager>;
export {};
