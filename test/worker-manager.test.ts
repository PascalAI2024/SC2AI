import { createWorkerManager } from '../src/systems/worker-manager';
import { Logger } from '../src/utils/logger';

describe('WorkerManager', () => {
    let workerManager: ReturnType<typeof createWorkerManager>;

    beforeEach(() => {
        workerManager = createWorkerManager();
    });

    test('should initialize with default state', () => {
        const mockWorld = {
            resources: {
                get: () => ({
                    units: {
                        getWorkers: () => [],
                        getMineralWorkers: () => [],
                        getGasWorkers: () => []
                    },
                    map: {
                        getExpansions: () => [{
                            mineralFields: [],
                            vespeneGeysers: []
                        }]
                    }
                })
            }
        };

        workerManager.setup(mockWorld);
        
        const system = workerManager._system;
        expect(system.state.workers).toHaveLength(0);
        expect(system.state.optimalWorkerCount).toBe(24);
        expect(system.state.maxWorkersPerBase).toBe(24);
    });

    test('should have a setup method', () => {
        expect(workerManager.setup).toBeDefined();
        expect(typeof workerManager.setup).toBe('function');
    });
});
