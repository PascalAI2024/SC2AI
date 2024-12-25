import { SystemWrapper, System } from '../types/agent';
export interface Systems {
    workerManager: SystemWrapper<System>;
    buildOrderManager: SystemWrapper<System>;
    combatManager: SystemWrapper<System>;
    scoutManager: SystemWrapper<System>;
    strategyManager: SystemWrapper<System>;
    expansionManager: SystemWrapper<System>;
    mlIntegrationManager: SystemWrapper<System>;
}
export declare function createSystems(): Systems;
