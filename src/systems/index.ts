import { createWorkerManager } from './worker-manager';
import { createBuildOrderManager } from './build-order';
import { createCombatManager } from './combat';
import { createScoutManager } from './scout';
import { createStrategyManager } from './strategy';
import { createExpansionManager } from './expansion';
import { createMLIntegrationManager } from './ml-integration';
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

export function createSystems(): Systems {
    return {
        workerManager: createWorkerManager(),
        buildOrderManager: createBuildOrderManager(),
        combatManager: createCombatManager(),
        scoutManager: createScoutManager(),
        strategyManager: createStrategyManager(),
        expansionManager: createExpansionManager(),
        mlIntegrationManager: createMLIntegrationManager(),
    };
}
