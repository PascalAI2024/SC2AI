"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEconomySystem = createEconomySystem;
const create_system_1 = require("../utils/create-system");
const logger_1 = require("../utils/logger");
const unit_type_1 = require("../constants/unit-type");
class EconomySystem extends create_system_1.System {
    async manageWorkerProduction(resources) {
        const { units, actions } = resources;
        const nexuses = units.getById(unit_type_1.NEXUS, { buildProgress: 1 });
        const currentWorkers = units.getWorkers().length;
        if (currentWorkers < this.state.desiredWorkers) {
            await Promise.all(nexuses.map(nexus => {
                if (!nexus.orders || nexus.orders.length === 0) {
                    return actions.train(unit_type_1.PROBE, nexus);
                }
            }));
        }
    }
    async optimizeWorkerDistribution(resources) {
        const { units, actions, map } = resources;
        const bases = map.getExpansions('self');
        // Update base saturation information
        const baseSaturation = {};
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
    shouldExpand(resources) {
        const { units, map } = resources;
        const bases = map.getExpansions('self');
        const workers = units.getWorkers();
        const workersPerBase = workers.length / bases.length;
        return (workersPerBase > 16 && // More than 16 workers per base
            !this.state.expanding && // Not already expanding
            bases.length < 3 // Less than 3 bases
        );
    }
    constructor(options) {
        super({
            name: 'EconomySystem',
            type: 'economy',
            defaultOptions: options.defaultOptions,
            async onStep({ resources }) {
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
                }
                catch (error) {
                    logger_1.Logger.log(`Error in EconomySystem onStep: ${error}`, 'error');
                }
            },
            async onUnitFinished({ resources }, unit) {
                try {
                    if (unit.isGasMine()) {
                        const resourcesObj = resources.get();
                        const { units, actions } = resourcesObj;
                        // Assign workers to new gas
                        const threeWorkers = units.getClosest(unit.pos, units.getMineralWorkers(), 3);
                        threeWorkers.forEach(worker => worker.labels.set('gasWorker', true));
                        await actions.mine(threeWorkers, unit);
                    }
                    else if (unit.isTownhall()) {
                        this.setState({
                            expanding: false,
                            baseCount: this.state.baseCount + 1
                        });
                    }
                }
                catch (error) {
                    logger_1.Logger.log(`Error in EconomySystem onUnitFinished: ${error}`, 'error');
                }
            }
        });
    }
}
function createEconomySystem(options) {
    return new EconomySystem(options);
}
//# sourceMappingURL=economy.js.map