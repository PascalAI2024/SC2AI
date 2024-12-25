import { Race } from '../constants/enums';
import { System, SystemWrapper } from '../types/agent';
import { Position } from '../types/base-types';
interface ScoutState {
    scoutingUnits: number[];
    exploredPositions: Position[];
    enemyBaseLocation?: Position;
    enemyRace?: Race;
    lastScoutTime: number;
    scoutInterval: number;
}
declare class ScoutManager implements System {
    _system: any;
    state: ScoutState;
    constructor();
    pause(): void;
    unpause(): void;
    setState(newState: Partial<ScoutState>): void;
    setup(world: any): void;
    private getScoutUnitType;
    scout(world: any): Promise<void>;
    private positionsMatch;
    analyzeEnemyBase(world: any): void;
    private determineEnemyRace;
    private findEnemyBaseLocation;
}
export declare function createScoutManager(): SystemWrapper<ScoutManager>;
export {};
