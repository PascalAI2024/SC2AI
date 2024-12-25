import { System, SystemWrapper } from '../types/agent';
interface CombatState {
    armyComposition: {
        [unitType: number]: number;
    };
    defensivePositions: Array<{
        x: number;
        y: number;
    }>;
    attackThreshold: number;
    retreatThreshold: number;
}
declare class CombatManager implements System {
    _system: any;
    state: CombatState;
    constructor();
    pause(): void;
    unpause(): void;
    setState(newState: Partial<CombatState>): void;
    setup(world: any): void;
    private initProtossCombat;
    private initTerranCombat;
    private initZergCombat;
    manageCombat(world: any): Promise<void>;
    private calculateArmyStrength;
    private attackMove;
    private defensiveRetreat;
    private maintainFormation;
}
export declare function createCombatManager(): SystemWrapper<CombatManager>;
export {};
