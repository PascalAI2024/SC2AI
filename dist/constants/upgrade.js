"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPGRADE_REQUIREMENTS = exports.TECH_UPGRADES = exports.COMBAT_UPGRADES = exports.PROTOSSSHIELDSLEVEL1 = exports.PROTOSSGROUNDARMORSLEVEL1 = exports.PROTOSSGROUNDWEAPONSLEVEL1 = exports.WARPGATERESEARCH = exports.CHARGE = void 0;
// Protoss Upgrades
exports.CHARGE = 86; // Zealot speed upgrade
exports.WARPGATERESEARCH = 84; // Warpgate research
exports.PROTOSSGROUNDWEAPONSLEVEL1 = 64;
exports.PROTOSSGROUNDARMORSLEVEL1 = 65;
exports.PROTOSSSHIELDSLEVEL1 = 66;
// Upgrade Groups
exports.COMBAT_UPGRADES = [
    exports.CHARGE,
    exports.PROTOSSGROUNDWEAPONSLEVEL1,
    exports.PROTOSSGROUNDARMORSLEVEL1,
    exports.PROTOSSSHIELDSLEVEL1,
];
exports.TECH_UPGRADES = [
    exports.WARPGATERESEARCH,
];
// Upgrade Requirements Map
exports.UPGRADE_REQUIREMENTS = {
    [exports.CHARGE]: 65, // Requires Twilight Council
    [exports.WARPGATERESEARCH]: 72, // Requires Cybernetics Core
    [exports.PROTOSSGROUNDWEAPONSLEVEL1]: 72, // Requires Cybernetics Core
    [exports.PROTOSSGROUNDARMORSLEVEL1]: 72, // Requires Cybernetics Core
    [exports.PROTOSSSHIELDSLEVEL1]: 72, // Requires Cybernetics Core
};
//# sourceMappingURL=upgrade.js.map