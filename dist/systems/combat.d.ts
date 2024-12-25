import { System, SystemState } from '../utils/create-system';
interface Position {
    x: number;
    y: number;
}
interface CombatState extends SystemState {
    armySize: number;
    attacking: boolean;
    harassmentActive: boolean;
    mainArmyComposition: {
        zealot: number;
        immortal: number;
        archon: number;
    };
    mainArmyPosition?: Position;
    harassSquadPosition?: Position;
}
declare class CombatSystem extends System {
    state: CombatState;
    private organizeArmy;
    private calculateArmyPosition;
    private controlArmyGroup;
    private controlMainArmy;
    private controlHarassSquad;
    private isValidHarassTarget;
    constructor(options: {
        defaultOptions: {
            state: CombatState;
        };
    });
}
export declare function createCombatSystem(options: {
    defaultOptions: {
        state: CombatState;
    };
}): CombatSystem;
export {};
