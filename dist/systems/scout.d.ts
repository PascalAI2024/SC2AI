import { System, SystemState } from '../utils/create-system';
interface Position {
    x: number;
    y: number;
}
type TechPath = 'unknown' | 'gateway' | 'robo' | 'stargate' | 'dark' | 'templar';
interface ScoutState extends SystemState {
    lastScoutTime: number;
    enemyTech: TechPath;
    enemyExpansions: number;
    scoutingUnit?: string;
    observerScoutLocations: Position[];
    knownEnemyStructures: {
        position: Position;
        type: number;
        lastSeen: number;
    }[];
}
declare class ScoutSystem extends System {
    state: ScoutState;
    private getScoutTargets;
    private assignScoutWorker;
    private manageObserverScouts;
    private updateEnemyIntel;
    constructor(options: {
        defaultOptions: {
            state: ScoutState;
        };
    });
    private updateEnemyTechPath;
}
export declare function createScoutSystem(options: {
    defaultOptions: {
        state: ScoutState;
    };
}): ScoutSystem;
export {};
