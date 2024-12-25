import { Race } from '../constants/enums';
import { System, SystemWrapper } from '../types/agent';
import { Logger } from '../utils/logger';

interface ExpansionState {
    currentBases: number;
    maxBases: number;
    expansionThresholds: {
        minerals: number;
        supply: number;
    };
    expansionLocations: Array<{x: number, y: number, claimed: boolean}>;
}

class ExpansionManager implements System {
    public _system: any;
    public state: ExpansionState = {
        currentBases: 1,
        maxBases: 3,
        expansionThresholds: {
            minerals: 1000,
            supply: 60
        },
        expansionLocations: []
    };

    constructor() {
        this._system = {};
    }

    public pause(): void {
        Logger.log('Expansion manager paused');
    }

    public unpause(): void {
        Logger.log('Expansion manager resumed');
    }

    public setState(newState: Partial<ExpansionState>): void {
        this.state = { ...this.state, ...newState };
    }

    public setup(world: any): void {
        const resources = world.resources.get();
        const { race } = world.agent.settings;

        // Initialize expansion locations based on race
        this.initializeExpansionLocations(world, race);
        Logger.log(`Expansion manager initialized for ${Race[race]}`);
    }

    private initializeExpansionLocations(world: any, race: Race): void {
        const resources = world.resources.get();
        const { map } = resources;

        // Get all possible expansion locations
        const expansions = map.getExpansions('all');
        
        this.state.expansionLocations = expansions.map((expansion: {townhallPosition: {x: number, y: number}}) => ({
            x: expansion.townhallPosition.x,
            y: expansion.townhallPosition.y,
            claimed: false
        }));

        // Race-specific expansion strategy adjustments
        switch (race) {
            case Race.Protoss:
                this.state.maxBases = 4;
                break;
            case Race.Terran:
                this.state.maxBases = 3;
                break;
            case Race.Zerg:
                this.state.maxBases = 5;
                break;
        }
    }

    public async manageExpansion(world: any): Promise<void> {
        const resources = world.resources.get();
        const { units, actions, frame } = resources;

        // Check if expansion is needed
        const currentSupply = frame.getObservation().playerCommon.foodUsed;
        const currentMinerals = frame.getObservation().playerCommon.minerals;

        if (this.shouldExpand(currentSupply, currentMinerals)) {
            await this.expandToNewBase(world);
        }
    }

    private shouldExpand(currentSupply: number, currentMinerals: number): boolean {
        return (
            this.state.currentBases < this.state.maxBases &&
            currentSupply >= this.state.expansionThresholds.supply &&
            currentMinerals >= this.state.expansionThresholds.minerals
        );
    }

    private async expandToNewBase(world: any): Promise<void> {
        const resources = world.resources.get();
        const { units, actions } = resources;

        // Find an unclaimed expansion location
        const availableExpansion = this.state.expansionLocations.find(loc => !loc.claimed);

        if (!availableExpansion) {
            Logger.log('No available expansion locations');
            return;
        }

        // Find a worker to build the expansion
        const workers = units.getWorkers();
        const builderWorker = workers.find((worker: {orders?: any[]}) => !worker.orders?.length);

        if (!builderWorker) {
            Logger.log('No available workers for expansion');
            return;
        }

        // Determine townhall type based on race
        const townhallType = this.getTownhallType(world.agent.settings.race);

        try {
            // Build townhall at expansion location
            await actions.build(townhallType, {
                x: availableExpansion.x,
                y: availableExpansion.y
            });

            // Mark expansion as claimed
            availableExpansion.claimed = true;
            this.state.currentBases++;

            Logger.log(`Expanding to new base at (${availableExpansion.x}, ${availableExpansion.y})`);
        } catch (error) {
            Logger.log(`Expansion failed: ${error}`, 'error');
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

export function createExpansionManager(): SystemWrapper<ExpansionManager> {
    const manager = new ExpansionManager();
    
    const wrapper = async (world: any) => {
        await manager.manageExpansion(world);
    };

    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);

    return wrapper;
}
