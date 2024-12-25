// Protoss Upgrades
export const CHARGE = 86;                   // Zealot speed upgrade
export const WARPGATERESEARCH = 84;         // Warpgate research
export const PROTOSSGROUNDWEAPONSLEVEL1 = 64;
export const PROTOSSGROUNDARMORSLEVEL1 = 65;
export const PROTOSSSHIELDSLEVEL1 = 66;

// Upgrade Groups
export const COMBAT_UPGRADES = [
    CHARGE,
    PROTOSSGROUNDWEAPONSLEVEL1,
    PROTOSSGROUNDARMORSLEVEL1,
    PROTOSSSHIELDSLEVEL1,
];

export const TECH_UPGRADES = [
    WARPGATERESEARCH,
];

// Upgrade Requirements Map
export const UPGRADE_REQUIREMENTS = {
    [CHARGE]: 65,                           // Requires Twilight Council
    [WARPGATERESEARCH]: 72,                // Requires Cybernetics Core
    [PROTOSSGROUNDWEAPONSLEVEL1]: 72,      // Requires Cybernetics Core
    [PROTOSSGROUNDARMORSLEVEL1]: 72,       // Requires Cybernetics Core
    [PROTOSSSHIELDSLEVEL1]: 72,            // Requires Cybernetics Core
} as const;
