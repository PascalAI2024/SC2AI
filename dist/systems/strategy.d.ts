import { System, SystemWrapper } from '../types/agent';
interface StrategyState {
    currentObjective: 'economy' | 'expansion' | 'attack' | 'defend';
    techPath: 'early' | 'mid' | 'late';
    armyComposition: {
        [unitType: number]: number;
    };
}
declare class StrategyManager implements System {
    _system: any;
    state: StrategyState;
    constructor();
    pause(): void;
    unpause(): void;
    setState(newState: Partial<StrategyState>): void;
    setup(world: any): void;
    private initializeRaceStrategy;
    private initProtossStrategy;
    private initTerranStrategy;
    private initZergStrategy;
    private initDefaultStrategy;
    evaluateStrategy(world: any): Promise<void>;
    private updateGameObjective;
    private calculateArmyStrength;
    private updateTechPath;
    getStrategyRecommendation(world: any): any;
}
export declare function createStrategyManager(): SystemWrapper<StrategyManager>;
export {};
