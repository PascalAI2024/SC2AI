"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCombatSystem = createCombatSystem;
const create_system_1 = require("../utils/create-system");
const logger_1 = require("../utils/logger");
class CombatSystem extends create_system_1.System {
    organizeArmy(combatUnits) {
        const groups = [];
        // Main army group (70% of forces)
        const mainArmySize = Math.floor(combatUnits.length * 0.7);
        const mainArmy = combatUnits.slice(0, mainArmySize);
        if (mainArmy.length > 0) {
            groups.push({
                units: mainArmy,
                position: this.calculateArmyPosition(mainArmy),
                type: 'MAIN',
                status: this.state.attacking ? 'ATTACKING' : 'IDLE'
            });
        }
        // Harassment squad (remaining units)
        const harassSquad = combatUnits.slice(mainArmySize);
        if (harassSquad.length > 0) {
            groups.push({
                units: harassSquad,
                position: this.calculateArmyPosition(harassSquad),
                type: 'HARASS',
                status: this.state.harassmentActive ? 'ATTACKING' : 'IDLE'
            });
        }
        return groups;
    }
    calculateArmyPosition(units) {
        const positions = units.map(u => ({ x: u.pos.x, y: u.pos.y }));
        return {
            x: positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length,
            y: positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length
        };
    }
    async controlArmyGroup(group, { resources }) {
        const resourcesObj = resources.get();
        switch (group.type) {
            case 'MAIN':
                await this.controlMainArmy(group, resourcesObj);
                break;
            case 'HARASS':
                await this.controlHarassSquad(group, resourcesObj);
                break;
        }
    }
    async controlMainArmy(group, resources) {
        const { actions, map } = resources;
        if (group.units.length < this.state.armySize) {
            // Army too small, keep defensive
            const defensivePosition = map.getCombatRally();
            return actions.attackMove(group.units, defensivePosition);
        }
        if (this.state.attacking) {
            const [enemyMain, enemyNat] = map.getExpansions('enemy');
            // Attack enemy natural first, then main
            return Promise.all([enemyNat, enemyMain].map(expansion => {
                return actions.attackMove(group.units, expansion.townhallPosition, true);
            }));
        }
    }
    async controlHarassSquad(group, resources) {
        const { actions, map } = resources;
        if (!this.state.harassmentActive || group.units.length < 4)
            return;
        // Find vulnerable harassment targets (worker lines, tech structures)
        const targets = map.getExpansions('enemy')
            .map(exp => exp.townhallPosition)
            .filter(pos => this.isValidHarassTarget(pos));
        if (targets.length > 0) {
            // Rotate between harassment targets
            const targetIndex = Math.floor(Date.now() / 10000) % targets.length;
            return actions.attackMove(group.units, targets[targetIndex], true);
        }
    }
    isValidHarassTarget(position) {
        // Add logic to determine if a position is a good harassment target
        // For now, just return true
        return true;
    }
    constructor(options) {
        super({
            name: 'CombatSystem',
            type: 'combat',
            defaultOptions: options.defaultOptions,
            async onStep({ resources }) {
                try {
                    const { units, actions, map } = resources.get();
                    // Get all our combat units
                    const combatUnits = units.getCombatUnits();
                    if (combatUnits.length === 0)
                        return;
                    // Split army into main force and harassment squad
                    const armyGroups = this.organizeArmy(combatUnits);
                    // Handle each army group
                    for (const armyGroup of armyGroups) {
                        await this.controlArmyGroup(armyGroup, { resources });
                    }
                    // Update state
                    this.setState({
                        armySize: combatUnits.length,
                        attacking: armyGroups.some((group) => group.status === 'ATTACKING')
                    });
                }
                catch (error) {
                    logger_1.Logger.log(`Error in CombatSystem onStep: ${error}`, 'error');
                }
            },
            async onUnitDestroyed({ resources }, unit) {
                try {
                    if (unit.alliance === 'self' && unit.isCombatUnit()) {
                        // Adjust army size and potentially retreat if too many losses
                        const remainingArmy = resources.get().units.getCombatUnits();
                        if (remainingArmy.length < this.state.armySize * 0.6) {
                            this.setState({ attacking: false });
                        }
                    }
                }
                catch (error) {
                    logger_1.Logger.log(`Error in CombatSystem onUnitDestroyed: ${error}`, 'error');
                }
            }
        });
    }
}
function createCombatSystem(options) {
    return new CombatSystem(options);
}
//# sourceMappingURL=combat.js.map