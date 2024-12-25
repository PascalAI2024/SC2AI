import { Race } from '../constants/enums';
import { System, SystemWrapper } from '../types/agent';
import { Unit, Position } from '../types/base-types';
import { Logger } from '../utils/logger';

interface WorkerManagerState {
    workers: Unit[];
    mineralFields: Unit[];
    vespeneGeysers: Unit[];
    optimalWorkerCount: number;
    maxWorkersPerBase: number;
}

class WorkerManager implements System {
    public _system: any;
    public state: WorkerManagerState = {
        workers: [],
        mineralFields: [],
        vespeneGeysers: [],
        optimalWorkerCount: 24, // 16 on minerals, 6 on gas (2 geysers)
        maxWorkersPerBase: 24
    };

    constructor() {
        this._system = {};
    }

    public pause(): void {
        Logger.log('Worker manager paused');
    }

    public unpause(): void {
        Logger.log('Worker manager unpaused');
    }

    public setState(newState: Partial<WorkerManagerState>): void {
        this.state = { ...this.state, ...newState };
    }

    public setup(world: any): void {
        const resources = world.resources.get();
        const { units, map } = resources;

        // Get starting base location
        const bases = map.getExpansions('self');
        if (bases.length > 0) {
            const mainBase = bases[0];
            this.state.mineralFields = mainBase.mineralFields;
            this.state.vespeneGeysers = mainBase.vespeneGeysers;
        }

        Logger.log('Worker manager initialized');
    }

    public async balanceWorkers(world: any): Promise<void> {
        const resources = world.resources.get();
        const { units } = resources;

        // Get all workers
        this.state.workers = units.getWorkers();

        // Calculate optimal distribution
        const mineralWorkers = units.getMineralWorkers();
        const gasWorkers = units.getGasWorkers();
        const idleWorkers = this.state.workers.filter(w => 
            !mineralWorkers.includes(w) && !gasWorkers.includes(w));

        // Assign idle workers to minerals
        if (idleWorkers.length > 0) {
            await resources.actions.gather(idleWorkers);
        }

        // Log worker distribution
        Logger.log(`Workers - Total: ${this.state.workers.length}, Minerals: ${mineralWorkers.length}, Gas: ${gasWorkers.length}, Idle: ${idleWorkers.length}`);
    }
}

export function createWorkerManager(): SystemWrapper<WorkerManager> {
    const manager = new WorkerManager();
    
    const wrapper = async (world: any) => {
        await manager.balanceWorkers(world);
    };

    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);

    return wrapper;
}
