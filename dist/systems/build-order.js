"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBuildOrderSystem = createBuildOrderSystem;
const create_system_1 = require("../utils/create-system");
const logger_1 = require("../utils/logger");
const unit_type_1 = require("../constants/unit-type");
const upgrade_1 = require("../constants/upgrade");
class BuildOrderSystem extends create_system_1.System {
    constructor(options) {
        super({
            name: 'BuildOrderSystem',
            type: 'build',
            defaultOptions: options.defaultOptions,
            buildOrder: [
                [16, { type: 'build', unit: unit_type_1.ASSIMILATOR }],
                [17, { type: 'build', unit: unit_type_1.GATEWAY }],
                [20, { type: 'build', unit: unit_type_1.NEXUS }],
                [21, { type: 'build', unit: unit_type_1.CYBERNETICSCORE }],
                [26, { type: 'build', unit: unit_type_1.TWILIGHTCOUNCIL }],
                [34, { type: 'upgrade', upgrade: upgrade_1.CHARGE }],
                [34, { type: 'build', unit: unit_type_1.GATEWAY, count: 7 }],
            ],
            async onStep({ resources }) {
                try {
                    const { units, actions } = resources.get();
                    // Worker production
                    if (!this.state.buildComplete) {
                        const nexuses = units.getById(unit_type_1.NEXUS, { buildProgress: 1 });
                        const currentWorkers = units.getWorkers().length;
                        if (currentWorkers < this.state.workerTarget) {
                            await Promise.all(nexuses.map(nexus => {
                                if (!nexus.orders || nexus.orders.length === 0) {
                                    return actions.train(unit_type_1.PROBE, nexus);
                                }
                            }));
                        }
                    }
                }
                catch (error) {
                    logger_1.Logger.log(`Error in BuildOrderSystem onStep: ${error}`, 'error');
                }
            },
            async onUnitFinished({ resources }, unit) {
                try {
                    if (unit.isGasMine()) {
                        const { units, actions } = resources.get();
                        const threeWorkers = units.getClosest(unit.pos, units.getMineralWorkers(), 3);
                        threeWorkers.forEach(worker => worker.labels.set('gasWorker', true));
                        await actions.mine(threeWorkers, unit);
                    }
                }
                catch (error) {
                    logger_1.Logger.log(`Error in BuildOrderSystem onUnitFinished: ${error}`, 'error');
                }
            },
            async onUnitCreated({ resources }, unit) {
                try {
                    if (unit.isWorker()) {
                        const { actions } = resources.get();
                        return actions.gather(unit);
                    }
                }
                catch (error) {
                    logger_1.Logger.log(`Error in BuildOrderSystem onUnitCreated: ${error}`, 'error');
                }
            },
            async buildComplete() {
                try {
                    this.setState({ buildComplete: true });
                    logger_1.Logger.log('Build order completed');
                }
                catch (error) {
                    logger_1.Logger.log(`Error in BuildOrderSystem buildComplete: ${error}`, 'error');
                }
            }
        });
    }
}
function createBuildOrderSystem(options) {
    return new BuildOrderSystem(options);
}
//# sourceMappingURL=build-order.js.map