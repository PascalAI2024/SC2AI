import { SystemWrapper, System } from '../types/agent';
export interface Systems {
    workerManager: SystemWrapper<System>;
}
export declare function createSystems(): Systems;
