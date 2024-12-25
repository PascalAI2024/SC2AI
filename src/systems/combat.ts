import { Race } from '../constants/enums';
import { System, SystemWrapper } from '../types/agent';
import { Logger } from '../utils/logger';

interface CombatState {
    armyComposition: {
        [unitType: number]: number;
    };
    defensivePositions: Array<{x: number, y: number}>;
    attackThreshold: number;
    retreatThreshold: number;
}

class CombatManager implements System {
    public _system: any;
    public state: CombatState = {
        armyComposition: {},
        defensivePositions: [],
        attackThreshold: 0.7,  // 70% army strength
        retreatThreshold: 0.3  // 30% army strength
    };

    constructor() {
        this._system = {};
    }

    public pause(): void {
        Logger.log('Combat manager paused');
    }

    public unpause(): void {
        Logger.log('Combat manager resumed');
    }

    public setState(newState: Partial<CombatState>): void {
        this.state = { ...this.state, ...newState };
    }

    public setup(world: any): void {
        const resources = world.resources.get();
        const { race } = world.agent.settings;

        // Race-specific army composition
        switch (race) {
            case Race.Protoss:
                this.initProtossCombat();
                break;
            case Race.Terran:
                this.initTerranCombat();
                break;
            case Race.Zerg:
                this.initZergCombat();
                break;
            default:
                Logger.log('No specific combat strategy for random race');
        }

        Logger.log(`Combat strategy initialized for ${Race[race]}`);
    }

    private initProtossCombat(): void {
        // Protoss composition: Zealots, Stalkers, Sentries
        this.state.armyComposition = {
            65: 0.5,  // Zealot
            74: 0.3,  // Stalker
            77: 0.2   // Sentry
        };
    }

    private initTerranCombat(): void {
        // Terran composition: Marines, Marauders, Medivacs
        this.state.armyComposition = {
            51: 0.6,  // Marine
            54: 0.3,  // Marauder
            88: 0.1   // Medivac
        };
    }

    private initZergCombat(): void {
        // Zerg composition: Zerglings, Banelings, Roaches
        this.state.armyComposition = {
            105: 0.5,  // Zergling
            106: 0.3,  // Baneling
            108: 0.2   // Roach
        };
    }

    public async manageCombat(world: any): Promise<void> {
        const resources = world.resources.get();
        const { units, actions, map } = resources;

        // Get combat units
        const combatUnits = units.getCombatUnits();
        const enemyUnits = units.getById(0, { alliance: 'enemy' });

        // Calculate army strength
        const armyStrength = this.calculateArmyStrength(combatUnits);
        const enemyStrength = this.calculateArmyStrength(enemyUnits);

        // Determine combat strategy based on army strength
        if (armyStrength / enemyStrength >= this.state.attackThreshold) {
            await this.attackMove(world, combatUnits);
        } else if (armyStrength / enemyStrength <= this.state.retreatThreshold) {
            await this.defensiveRetreat(world, combatUnits);
        } else {
            await this.maintainFormation(world, combatUnits);
        }
    }

    private calculateArmyStrength(units: any[]): number {
        return units.reduce((strength, unit) => {
            // Simple strength calculation based on unit type
            const unitStrengthMap: {[key: number]: number} = {
                // Protoss
                65: 2,   // Zealot
                74: 3,   // Stalker
                77: 1,   // Sentry
                
                // Terran
                51: 1,   // Marine
                54: 2,   // Marauder
                88: 0.5, // Medivac
                
                // Zerg
                105: 0.5, // Zergling
                106: 1,   // Baneling
                108: 2    // Roach
            };
            
            return strength + (unitStrengthMap[unit.type] || 1);
        }, 0);
    }

    private async attackMove(world: any, units: any[]): Promise<void> {
        const resources = world.resources.get();
        const { map } = resources;

        // Find enemy starting position
        const enemyStartPos = map.getStartingPositions()[1];
        
        if (enemyStartPos) {
            await resources.actions.attackMove(units, enemyStartPos);
            Logger.log('Attacking enemy base');
        }
    }

    private async defensiveRetreat(world: any, units: any[]): Promise<void> {
        const resources = world.resources.get();
        const { map } = resources;

        // Retreat to main base
        const mainBasePos = map.getExpansions('self')[0].townhallPosition;
        
        await resources.actions.move(units, mainBasePos, true);
        Logger.log('Retreating to main base');
    }

    private async maintainFormation(world: any, units: any[]): Promise<void> {
        const resources = world.resources.get();
        const combatRally = resources.map.getCombatRally();

        // Group units at combat rally point
        await resources.actions.move(units, combatRally, true);
        Logger.log('Maintaining defensive formation');
    }
}

export function createCombatManager(): SystemWrapper<CombatManager> {
    const manager = new CombatManager();
    
    const wrapper = async (world: any) => {
        await manager.manageCombat(world);
    };

    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);

    return wrapper;
}
