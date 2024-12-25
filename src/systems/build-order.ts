import { Race } from '../constants/enums';
import { System, SystemWrapper } from '../types/agent';
import { Logger } from '../utils/logger';

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

class BuildOrderManager implements System {
    public _system: any;
    public state: BuildOrderState = {
        currentPhase: 'early',
        supplyThresholds: {
            workers: 22,
            firstExpansion: 36,
            armyTransition: 44
        },
        buildQueue: []
    };

    constructor() {
        this._system = {};
    }

    public pause(): void {
        Logger.log('Build order manager paused');
    }

    public unpause(): void {
        Logger.log('Build order manager resumed');
    }

    public setState(newState: Partial<BuildOrderState>): void {
        this.state = { ...this.state, ...newState };
    }

    public setup(world: any): void {
        const resources = world.resources.get();
        const { race } = world.agent.settings;

        // Race-specific build order initialization
        switch (race) {
            case Race.Protoss:
                this.initProtossBuildOrder();
                break;
            case Race.Terran:
                this.initTerranBuildOrder();
                break;
            case Race.Zerg:
                this.initZergBuildOrder();
                break;
            default:
                Logger.log('No specific build order for random race');
        }

        Logger.log(`Build order initialized for ${Race[race]}`);
    }

    private initProtossBuildOrder(): void {
        // Standard Protoss 2-Gate Zealot Rush build order
        this.state.buildQueue = [
            { unitType: 34, priority: 1 }, // Probe
            { unitType: 34, priority: 1 }, 
            { unitType: 34, priority: 1 }, 
            { unitType: 63, priority: 2 }, // Gateway
            { unitType: 34, priority: 1 }, 
            { unitType: 63, priority: 2 }, // Second Gateway
            { unitType: 65, priority: 3 }  // Zealot
        ];
    }

    private initTerranBuildOrder(): void {
        // Standard Terran Marine Rush build order
        this.state.buildQueue = [
            { unitType: 45, priority: 1 }, // SCV
            { unitType: 45, priority: 1 }, 
            { unitType: 45, priority: 1 }, 
            { unitType: 48, priority: 2 }, // Barracks
            { unitType: 48, priority: 2 }, // Second Barracks
            { unitType: 51, priority: 3 }  // Marine
        ];
    }

    private initZergBuildOrder(): void {
        // Standard Zerg Zergling Rush build order
        this.state.buildQueue = [
            { unitType: 104, priority: 1 }, // Drone
            { unitType: 104, priority: 1 }, 
            { unitType: 104, priority: 1 }, 
            { unitType: 106, priority: 2 }, // Spawning Pool
            { unitType: 104, priority: 1 }, 
            { unitType: 105, priority: 3 }  // Zergling
        ];
    }

    public async executeNextBuildStep(world: any): Promise<void> {
        const resources = world.resources.get();
        const { units, actions } = resources;

        // Check current supply and phase
        const currentSupply = resources.frame.getObservation().playerCommon.foodUsed;
        this.updateGamePhase(currentSupply);

        // Find next buildable unit
        const nextUnit = this.state.buildQueue.shift();
        if (nextUnit) {
            const townhalls = units.getByType(this.getTownhallType(world.agent.settings.race));
            
            if (townhalls.length > 0 && world.agent.canAfford(nextUnit.unitType)) {
                await actions.train(nextUnit.unitType, townhalls[0]);
                Logger.log(`Trained unit: ${nextUnit.unitType}`);
            } else {
                // Put unit back in queue if can't be built
                this.state.buildQueue.unshift(nextUnit);
            }
        }
    }

    private updateGamePhase(currentSupply: number): void {
        if (currentSupply < this.state.supplyThresholds.armyTransition) {
            this.state.currentPhase = 'early';
        } else if (currentSupply < 66) {
            this.state.currentPhase = 'mid';
        } else {
            this.state.currentPhase = 'late';
        }
    }

    private getTownhallType(race: Race): number {
        switch (race) {
            case Race.Protoss: return 59;  // Nexus
            case Race.Terran: return 41;   // Command Center
            case Race.Zerg: return 101;    // Hatchery
            default: return 59;            // Default to Protoss
        }
    }
}

export function createBuildOrderManager(): SystemWrapper<BuildOrderManager> {
    const manager = new BuildOrderManager();
    
    const wrapper = async (world: any) => {
        await manager.executeNextBuildStep(world);
    };

    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);

    return wrapper;
}
