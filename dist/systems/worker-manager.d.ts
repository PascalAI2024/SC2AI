import { System, SystemWrapper } from '../types/agent';
import { Unit } from '../types/base-types';
interface WorkerManagerState {
    workers: Unit[];
    mineralFields: Unit[];
    vespeneGeysers: Unit[];
    optimalWorkerCount: number;
    maxWorkersPerBase: number;
}
declare class WorkerManager implements System {
    _system: any;
    state: WorkerManagerState;
    constructor();
    pause(): void;
    unpause(): void;
    setState(newState: Partial<WorkerManagerState>): void;
    setup(world: any): void;
    balanceWorkers(world: any): Promise<void>;
}
export declare function createWorkerManager(): SystemWrapper<WorkerManager>;
export {};
