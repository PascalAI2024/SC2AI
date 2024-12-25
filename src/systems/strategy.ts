import { Race } from '../constants/enums';
import { System, SystemWrapper } from '../types/agent';
import { Logger } from '../utils/logger';

interface StrategyState {
    currentObjective: 'economy' | 'expansion' | 'attack' | 'defend';
    techPath: 'early' | 'mid' | 'late';
    armyComposition: {
        [unitType: number]: number;
    };
}

class StrategyManager implements System {
    public _system: any;
    public state: StrategyState = {
        currentObjective: 'economy',
        techPath: 'early',
        armyComposition: {}
    };

    constructor() {
        this._system = {};
    }

    public pause(): void {
        Logger.log('Strategy manager paused');
    }

    public unpause(): void {
        Logger.log('Strategy manager resumed');
    }

    public setState(newState: Partial<StrategyState>): void {
        this.state = { ...this.state, ...newState };
    }

    public setup(world: any): void {
        const { race } = world.agent.settings;
        this.initializeRaceStrategy(race);
        Logger.log(`Strategy initialized for ${Race[race]}`);
    }

    private initializeRaceStrategy(race: Race): void {
        switch (race) {
            case Race.Protoss:
                this.initProtossStrategy();
                break;
            case Race.Terran:
                this.initTerranStrategy();
                break;
            case Race.Zerg:
                this.initZergStrategy();
                break;
            default:
                this.initDefaultStrategy();
        }
    }

    private initProtossStrategy(): void {
        this.state.armyComposition = {
            65: 0.4,  // Zealot
            74: 0.3,  // Stalker
            77: 0.2,  // Sentry
            78: 0.1   // High Templar
        };
    }

    private initTerranStrategy(): void {
        this.state.armyComposition = {
            51: 0.5,  // Marine
            54: 0.3,  // Marauder
            88: 0.2   // Medivac
        };
    }

    private initZergStrategy(): void {
        this.state.armyComposition = {
            105: 0.4,  // Zergling
            106: 0.2,  // Baneling
            108: 0.3,  // Roach
            109: 0.1   // Hydralisk
        };
    }

    private initDefaultStrategy(): void {
        this.state.armyComposition = {
            65: 0.5,  // Generic unit 1
            74: 0.3,  // Generic unit 2
            77: 0.2   // Generic unit 3
        };
    }

    public async evaluateStrategy(world: any): Promise<void> {
        const resources = world.resources.get();
        const { units, frame } = resources;

        // Analyze current game state
        const currentSupply = frame.getObservation().playerCommon.foodUsed;
        const enemyUnits = units.getById(0, { alliance: 'enemy' });
        const ownUnits = units.getCombatUnits();

        // Determine current objective based on game state
        this.updateGameObjective(currentSupply, ownUnits, enemyUnits);

        // Adjust tech path
        this.updateTechPath(currentSupply);

        // Log current strategy
        Logger.log(`Current Objective: ${this.state.currentObjective}, Tech Path: ${this.state.techPath}`);
    }

    private updateGameObjective(
        currentSupply: number, 
        ownUnits: any[], 
        enemyUnits: any[]
    ): void {
        // Early game focus on economy
        if (currentSupply < 30) {
            this.state.currentObjective = 'economy';
            return;
        }

        // Determine objective based on army strength and enemy composition
        const ownArmyStrength = this.calculateArmyStrength(ownUnits);
        const enemyArmyStrength = this.calculateArmyStrength(enemyUnits);

        if (ownArmyStrength > enemyArmyStrength * 1.5) {
            this.state.currentObjective = 'attack';
        } else if (ownArmyStrength < enemyArmyStrength * 0.5) {
            this.state.currentObjective = 'defend';
        } else {
            this.state.currentObjective = 'expansion';
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

    private updateTechPath(currentSupply: number): void {
        if (currentSupply < 40) {
            this.state.techPath = 'early';
        } else if (currentSupply < 80) {
            this.state.techPath = 'mid';
        } else {
            this.state.techPath = 'late';
        }
    }

    public getStrategyRecommendation(world: any): any {
        // Provide recommendations based on current strategy
        return {
            objective: this.state.currentObjective,
            techPath: this.state.techPath,
            armyComposition: this.state.armyComposition
        };
    }
}

export function createStrategyManager(): SystemWrapper<StrategyManager> {
    const manager = new StrategyManager();
    
    const wrapper = async (world: any) => {
        await manager.evaluateStrategy(world);
    };

    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);

    return wrapper;
}
