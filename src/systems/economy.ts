import { System, SystemState } from '../utils/create-system';
import { Logger } from '../utils/logger';
import { PROBE, NEXUS, ASSIMILATOR } from '../constants/unit-type';

interface Position {
    x: number;
    y: number;
}

interface EconomyState extends SystemState {
    desiredWorkers: number;
    currentWorkers: number;
    gasWorkers: number;
    expanding: boolean;
    baseCount: number;
    baseSaturation: {
        [key: string]: {
            minerals: number;
            gas: number;
        };
    };
}

interface Unit {
    pos: Position;
    alliance: string;
    isWorker: () => boolean;
    isGasMine: () => boolean;
    isTownhall: () => boolean;
    labels: Map<string, boolean>;
    orders?: any[];
}

interface Resources {
    units: {
        getWorkers: () => Unit[];
        getMineralWorkers: () => Unit[];
        getGasWorkers: () => Unit[];
        getById: (unitId: number, options?: any) => Unit[];
        getClosest: (pos: Position, units: Unit[], n: number) => Unit[];
    };
    actions: {
        train: (unitType: number, facility: Unit) => Promise<void>;
        build: (unitType: number, position: Position) => Promise<void>;
        gather: (workers: Unit | Unit[]) => Promise<void>;
        mine: (workers: Unit[], target: Unit) => Promise<void>;
    };
    map: {
        getExpansions: (alliance: string) => Array<{
            townhallPosition: Position;
            mineralFields: Unit[];
            vespeneGeysers: Unit[];
        }>;
        height: (position: Position) => number;
    };
}

interface World {
    resources: {
        get: () => Resources;
    };
}

class EconomySystem extends System {
    declare state: EconomyState;

    private async manageWorkerProduction(resources: Resources): Promise<void> {
        const { units, actions } = resources;
        const nexuses = units.getById(NEXUS, { buildProgress: 1 });
        const currentWorkers = units.getWorkers().length;

        if (currentWorkers < this.state.desiredWorkers) {
            await Promise.all(
                nexuses.map(nexus => {
                    if (!nexus.orders || nexus.orders.length === 0) {
                        return actions.train(PROBE, nexus);
                    }
                })
            );
        }
    }

    private async optimizeWorkerDistribution(resources: Resources): Promise<void> {
        const { units, actions, map } = resources;
        const bases = map.getExpansions('self');

        // Update base saturation information
        const baseSaturation: EconomyState['baseSaturation'] = {};
        
        bases.forEach((base, index) => {
            const baseWorkers = units.getWorkers().filter(worker => {
                const height = map.height(worker.pos);
                const baseHeight = map.height(base.townhallPosition);
                return Math.abs(height - baseHeight) < 1;
            });

            baseSaturation[`base${index}`] = {
                minerals: baseWorkers.filter(w => !w.labels.get('gasWorker')).length,
                gas: baseWorkers.filter(w => w.labels.get('gasWorker')).length
            };
        });

        this.setState({ baseSaturation });

        // Redistribute workers if needed
        for (const base of bases) {
            const mineralWorkers = units.getMineralWorkers();
            const optimalMineralWorkers = base.mineralFields.length * 2;
            const currentMineralWorkers = mineralWorkers.filter(w => {
                const height = map.height(w.pos);
                const baseHeight = map.height(base.townhallPosition);
                return Math.abs(height - baseHeight) < 1;
            }).length;

            if (currentMineralWorkers < optimalMineralWorkers) {
                const idleWorkers = units.getWorkers().filter(w => !w.orders || w.orders.length === 0);
                if (idleWorkers.length > 0) {
                    await actions.gather(idleWorkers);
                }
            }
        }
    }

    private shouldExpand(resources: Resources): boolean {
        const { units, map } = resources;
        const bases = map.getExpansions('self');
        const workers = units.getWorkers();
        const workersPerBase = workers.length / bases.length;

        return (
            workersPerBase > 16 && // More than 16 workers per base
            !this.state.expanding && // Not already expanding
            bases.length < 3 // Less than 3 bases
        );
    }

    constructor(options: { defaultOptions: { state: EconomyState } }) {
        super({
            name: 'EconomySystem',
            type: 'economy',
            defaultOptions: options.defaultOptions,

            async onStep({ resources }: { resources: { get: () => Resources }}) {
                try {
                    const resourcesObj = resources.get();
                    
                    // Manage worker production
                    await this.manageWorkerProduction(resourcesObj);

                    // Optimize worker distribution
                    await this.optimizeWorkerDistribution(resourcesObj);

                    // Check if we should expand
                    if (this.shouldExpand(resourcesObj)) {
                        this.setState({ expanding: true });
                        // Expansion logic will be handled by build order system
                    }

                    // Update worker counts
                    const { units } = resourcesObj;
                    this.setState({
                        currentWorkers: units.getWorkers().length,
                        gasWorkers: units.getGasWorkers().length
                    });

                } catch (error) {
                    Logger.log(`Error in EconomySystem onStep: ${error}`, 'error');
                }
            },

            async onUnitFinished({ resources }: World, unit: Unit) {
                try {
                    if (unit.isGasMine()) {
                        const resourcesObj = resources.get();
                        const { units, actions } = resourcesObj;
                        
                        // Assign workers to new gas
                        const threeWorkers = units.getClosest(
                            unit.pos,
                            units.getMineralWorkers(),
                            3
                        );

                        threeWorkers.forEach(worker => worker.labels.set('gasWorker', true));
                        await actions.mine(threeWorkers, unit);
                    } else if (unit.isTownhall()) {
                        this.setState({ 
                            expanding: false,
                            baseCount: this.state.baseCount + 1
                        });
                    }
                } catch (error) {
                    Logger.log(`Error in EconomySystem onUnitFinished: ${error}`, 'error');
                }
            }
        });
    }
}

export function createEconomySystem(options: { defaultOptions: { state: EconomyState } }): EconomySystem {
    return new EconomySystem(options);
}
