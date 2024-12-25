'use strict';

const Ability = {
    INVALID: 0,
    SMART: 1,     // Target: Unit, Point.
    ATTACK: 3674,  // Target: Unit, Point.
    ATTACK_ATTACK: 23,    // Target: Unit, Point.
    ATTACK_ATTACKBUILDING: 2048,  // Target: Unit, Point.
    ATTACK_REDIRECT: 1682,  // Target: Unit, Point.
    BEHAVIOR_BUILDINGATTACKOFF: 2082,  // Target: None.
    BEHAVIOR_BUILDINGATTACKON: 2081,  // Target: None.
    BEHAVIOR_CLOAKOFF: 3677,  // Target: None.
    BEHAVIOR_CLOAKOFF_BANSHEE: 393,   // Target: None.
    BEHAVIOR_CLOAKOFF_GHOST: 383,   // Target: None.
    BEHAVIOR_CLOAKON: 3676,  // Target: None.
    BEHAVIOR_CLOAKON_BANSHEE: 392,   // Target: None.
    BEHAVIOR_CLOAKON_GHOST: 382,   // Target: None.
    BEHAVIOR_GENERATECREEPOFF: 1693,  // Target: None.
    BEHAVIOR_GENERATECREEPON: 1692,  // Target: None.
    BEHAVIOR_HOLDFIREOFF: 3689,  // Target: None.
    BEHAVIOR_HOLDFIREOFF_LURKER: 2552,  // Target: None.
    BEHAVIOR_HOLDFIREON: 3688,  // Target: None.
    BEHAVIOR_HOLDFIREON_GHOST: 36,    // Target: None.
    BEHAVIOR_HOLDFIREON_LURKER: 2550,  // Target: None.
    BEHAVIOR_PULSARBEAMOFF: 2376,  // Target: None.
    BEHAVIOR_PULSARBEAMON: 2375,  // Target: None.
    BUILD_ARMORY: 331,   // Target: Point.
    BUILD_ASSIMILATOR: 882,   // Target: Unit.
    BUILD_BANELINGNEST: 1162,  // Target: Point.
    BUILD_BARRACKS: 321,   // Target: Point.
    BUILD_BUNKER: 324,   // Target: Point.
    BUILD_COMMANDCENTER: 318,   // Target: Point.
    BUILD_CREEPTUMOR: 3691,  // Target: Point.
    BUILD_CREEPTUMOR_QUEEN: 1694,  // Target: Point.
    BUILD_CREEPTUMOR_TUMOR: 1733,  // Target: Point.
    BUILD_CYBERNETICSCORE: 894,   // Target: Point.
    BUILD_DARKSHRINE: 891,   // Target: Point.
    BUILD_ENGINEERINGBAY: 322,   // Target: Point.
    BUILD_EVOLUTIONCHAMBER: 1156,  // Target: Point.
    BUILD_EXTRACTOR: 1154,  // Target: Unit.
    BUILD_FACTORY: 328,   // Target: Point.
    BUILD_FLEETBEACON: 885,   // Target: Point.
    BUILD_FORGE: 884,   // Target: Point.
    BUILD_FUSIONCORE: 333,   // Target: Point.
    BUILD_GATEWAY: 883,   // Target: Point.
    BUILD_GHOSTACADEMY: 327,   // Target: Point.
    BUILD_HATCHERY: 1152,  // Target: Point.
    BUILD_HYDRALISKDEN: 1157,  // Target: Point.
    BUILD_INFESTATIONPIT: 1160,  // Target: Point.
    BUILD_INTERCEPTORS: 1042,  // Target: None.
    BUILD_MISSILETURRET: 323,   // Target: Point.
    BUILD_NEXUS: 880,   // Target: Point.
    BUILD_NUKE: 710,   // Target: None.
    BUILD_NYDUSNETWORK: 1161,  // Target: Point.
    BUILD_NYDUSWORM: 1768,  // Target: Point.
    BUILD_PHOTONCANNON: 887,   // Target: Point.
    BUILD_PYLON: 881,   // Target: Point.
    BUILD_REACTOR: 3683,  // Target: None.
    BUILD_REACTOR_BARRACKS: 422,   // Target: None.
    BUILD_REACTOR_FACTORY: 455,   // Target: None.
    BUILD_REACTOR_STARPORT: 488,   // Target: None.
    BUILD_REFINERY: 320,   // Target: Unit.
    BUILD_ROACHWARREN: 1165,  // Target: Point.
    BUILD_ROBOTICSBAY: 892,   // Target: Point.
    BUILD_ROBOTICSFACILITY: 893,   // Target: Point.
    BUILD_SENSORTOWER: 326,   // Target: Point.
    BUILD_SHIELDBATTERY: 895,   // Target: Point.
    BUILD_SPAWNINGPOOL: 1155,  // Target: Point.
    BUILD_SPINECRAWLER: 1166,  // Target: Point.
    BUILD_SPIRE: 1158,  // Target: Point.
    BUILD_SPORECRAWLER: 1167,  // Target: Point.
    BUILD_STARGATE: 889,   // Target: Point.
    BUILD_STARPORT: 329,   // Target: Point.
    BUILD_STASISTRAP: 2505,  // Target: Point.
    BUILD_SUPPLYDEPOT: 319,   // Target: Point.
    BUILD_TECHLAB: 3682,  // Target: None.
    BUILD_TECHLAB_BARRACKS: 421,   // Target: None.
    BUILD_TECHLAB_FACTORY: 454,   // Target: None.
    BUILD_TECHLAB_STARPORT: 487,   // Target: None.
    BUILD_TEMPLARARCHIVE: 890,   // Target: Point.
    BUILD_TWILIGHTCOUNCIL: 886,   // Target: Point.
    BUILD_ULTRALISKCAVERN: 1159,  // Target: Point.
    BURROWDOWN: 3661,  // Target: None.
    BURROWDOWN_BANELING: 1374,  // Target: None.
    BURROWDOWN_DRONE: 1378,  // Target: None.
    BURROWDOWN_HYDRALISK: 1382,  // Target: None.
    BURROWDOWN_INFESTOR: 1444,  // Target: None.
    BURROWDOWN_LURKER: 2108,  // Target: None.
    BURROWDOWN_QUEEN: 1433,  // Target: None.
    BURROWDOWN_RAVAGER: 2340,  // Target: None.
    BURROWDOWN_ROACH: 1386,  // Target: None.
    BURROWDOWN_SWARMHOST: 2014,  // Target: None.
    BURROWDOWN_WIDOWMINE: 2095,  // Target: None.
    BURROWDOWN_ZERGLING: 1390,  // Target: None.
    BURROWUP: 3662,  // Target: None.
    BURROWUP_BANELING: 1376,  // Target: None.
    BURROWUP_DRONE: 1380,  // Target: None.
    BURROWUP_HYDRALISK: 1384,  // Target: None.
    BURROWUP_INFESTOR: 1446,  // Target: None.
    BURROWUP_LURKER: 2110,  // Target: None.
    BURROWUP_QUEEN: 1435,  // Target: None.
    BURROWUP_RAVAGER: 2342,  // Target: None.
    BURROWUP_ROACH: 1388,  // Target: None.
    BURROWUP_SWARMHOST: 2016,  // Target: None.
    BURROWUP_WIDOWMINE: 2097,  // Target: None.
    BURROWUP_ZERGLING: 1392,  // Target: None.
    CANCEL: 3659,  // Target: None.
    CANCELSLOT_ADDON: 313,   // Target: None.
    CANCELSLOT_QUEUE1: 305,   // Target: None.
    CANCELSLOT_QUEUE5: 307,   // Target: None.
    CANCELSLOT_QUEUECANCELTOSELECTION: 309,   // Target: None.
    CANCELSLOT_QUEUEPASSIVE: 1832,  // Target: None.
    CANCEL_ADEPTPHASESHIFT: 2594,  // Target: None.
    CANCEL_ADEPTSHADEPHASESHIFT: 2596,  // Target: None.
    CANCEL_BARRACKSADDON: 451,   // Target: None.
    CANCEL_BUILDINPROGRESS: 314,   // Target: None.
    CANCEL_CREEPTUMOR: 1763,  // Target: None.
    CANCEL_FACTORYADDON: 484,   // Target: None.
    CANCEL_GRAVITONBEAM: 174,   // Target: None.
    CANCEL_LAST: 3671,  // Target: None.
    CANCEL_MORPHBROODLORD: 1373,  // Target: None.
    CANCEL_MORPHLAIR: 1217,  // Target: None.
    CANCEL_MORPHLURKER: 2333,  // Target: None.
    CANCEL_MORPHLURKERDEN: 2113,  // Target: None.
    CANCEL_MORPHMOTHERSHIP: 1848,  // Target: None.
    CANCEL_MORPHORBITAL: 1517,  // Target: None.
    CANCEL_MORPHOVERLORDTRANSPORT: 2709,  // Target: None.
    CANCEL_MORPHOVERSEER: 1449,  // Target: None.
    CANCEL_MORPHPLANETARYFORTRESS: 1451,  // Target: None.
    CANCEL_MORPHRAVAGER: 2331,  // Target: None.
    CANCEL_QUEUE1: 304,   // Target: None.
    CANCEL_QUEUE5: 306,   // Target: None.
    CANCEL_QUEUEADDON: 312,   // Target: None.
    CANCEL_QUEUECANCELTOSELECTION: 308,   // Target: None.
    CANCEL_QUEUEPASIVE: 1831,  // Target: None.
    CANCEL_QUEUEPASSIVECANCELTOSELECTION: 1833,  // Target: None.
    CANCEL_SPINECRAWLERROOT: 1730,  // Target: None.
    CANCEL_STARPORTADDON: 517,   // Target: None.
    EFFECT_ABDUCT: 2067,  // Target: Unit.
    EFFECT_ADEPTPHASESHIFT: 2544,  // Target: Point.
    EFFECT_AUTOTURRET: 1764,  // Target: Point.
    EFFECT_BLINDINGCLOUD: 2063,  // Target: Point.
    EFFECT_BLINK: 3687,  // Target: Point.
    EFFECT_BLINK_STALKER: 1442,  // Target: Point.
    EFFECT_CALLDOWNMULE: 171,   // Target: Unit, Point.
    EFFECT_CAUSTICSPRAY: 2324,  // Target: Unit.
    EFFECT_CHARGE: 1819,  // Target: Unit.
    EFFECT_CHRONOBOOST: 261,   // Target: Unit.
    EFFECT_CHRONOBOOSTENERGYCOST: 3755,
    EFFECT_CONTAMINATE: 1825,  // Target: Unit.
    EFFECT_CORROSIVEBILE: 2338,  // Target: Point.
    EFFECT_EMP: 1628,  // Target: Point.
    EFFECT_EXPLODE: 42,    // Target: None.
    EFFECT_FEEDBACK: 140,   // Target: Unit.
    EFFECT_FORCEFIELD: 1526,  // Target: Point.
    EFFECT_FUNGALGROWTH: 74,    // Target: Point.
    EFFECT_GHOSTSNIPE: 2714,  // Target: Unit.
    EFFECT_GRAVITONBEAM: 173,   // Target: Unit.
    EFFECT_GUARDIANSHIELD: 76,    // Target: None.
    EFFECT_HEAL: 386,   // Target: Unit.
    EFFECT_HUNTERSEEKERMISSILE: 169,   // Target: Unit.
    EFFECT_IMMORTALBARRIER: 2328,  // Target: None.
    EFFECT_INFESTEDTERRANS: 247,   // Target: Point.
    EFFECT_INJECTLARVA: 251,   // Target: Unit.
    EFFECT_KD8CHARGE: 2588,  // Target: Unit, Point.
    EFFECT_LOCKON: 2350,  // Target: Unit.
    EFFECT_LOCUSTSWOOP: 2387,  // Target: Point.
    EFFECT_MASSRECALL: 3686,  // Target: Unit.
    EFFECT_MASSRECALL_MOTHERSHIP: 2368,  // Target: Unit.
    EFFECT_MASSRECALL_MOTHERSHIPCORE: 1974,  // Target: Unit.
    EFFECT_MEDIVACIGNITEAFTERBURNERS: 2116,  // Target: None.
    EFFECT_NEURALPARASITE: 249,   // Target: Unit.
    EFFECT_NUKECALLDOWN: 1622,  // Target: Point.
    EFFECT_ORACLEREVELATION: 2146,  // Target: Point.
    EFFECT_PARASITICBOMB: 2542,  // Target: Unit.
    EFFECT_PHOTONOVERCHARGE: 2162,  // Target: Unit.
    EFFECT_POINTDEFENSEDRONE: 144,   // Target: Point.
    EFFECT_PSISTORM: 1036,  // Target: Point.
    EFFECT_PURIFICATIONNOVA: 2346,  // Target: Point.
    EFFECT_REPAIR: 3685,  // Target: Unit.
    EFFECT_REPAIR_MULE: 78,    // Target: Unit.
    EFFECT_REPAIR_SCV: 316,   // Target: Unit.
    EFFECT_RESTORE: 3765,      // Target: Unit.
    EFFECT_SALVAGE: 32,    // Target: None.
    EFFECT_SCAN: 399,   // Target: Point.
    EFFECT_SHADOWSTRIDE: 2700,  // Target: Point.
    EFFECT_SPAWNCHANGELING: 181,   // Target: None.
    EFFECT_SPAWNLOCUSTS: 2704,  // Target: Point.
    EFFECT_SPRAY: 3684,  // Target: Point.
    EFFECT_SPRAY_PROTOSS: 30,    // Target: Point.
    EFFECT_SPRAY_TERRAN: 26,    // Target: Point.
    EFFECT_SPRAY_ZERG: 28,    // Target: Point.
    EFFECT_STIM: 3675,  // Target: None.
    EFFECT_STIM_MARAUDER: 253,   // Target: None.
    EFFECT_STIM_MARINE: 380,   // Target: None.
    EFFECT_STIM_MARINE_REDIRECT: 1683,  // Target: None.
    EFFECT_SUPPLYDROP: 255,   // Target: Unit.
    EFFECT_TACTICALJUMP: 2358,  // Target: Point.
    EFFECT_TEMPESTDISRUPTIONBLAST: 2698,  // Target: Point.
    EFFECT_TIMEWARP: 2244,  // Target: Point.
    EFFECT_TRANSFUSION: 1664,  // Target: Unit.
    EFFECT_VIPERCONSUME: 2073,  // Target: Unit.
    EFFECT_VOIDRAYPRISMATICALIGNMENT: 2393,  // Target: None.
    EFFECT_WIDOWMINEATTACK: 2099,  // Target: Unit.
    EFFECT_YAMATOGUN: 401,   // Target: Unit.
    HALLUCINATION_ADEPT: 2391,  // Target: None.
    HALLUCINATION_ARCHON: 146,   // Target: None.
    HALLUCINATION_COLOSSUS: 148,   // Target: None.
    HALLUCINATION_DISRUPTOR: 2389,  // Target: None.
    HALLUCINATION_HIGHTEMPLAR: 150,   // Target: None.
    HALLUCINATION_IMMORTAL: 152,   // Target: None.
    HALLUCINATION_ORACLE: 2114,  // Target: None.
    HALLUCINATION_PHOENIX: 154,   // Target: None.
    HALLUCINATION_PROBE: 156,   // Target: None.
    HALLUCINATION_STALKER: 158,   // Target: None.
    HALLUCINATION_VOIDRAY: 160,   // Target: None.
    HALLUCINATION_WARPPRISM: 162,   // Target: None.
    HALLUCINATION_ZEALOT: 164,   // Target: None.
    HALT: 3660,  // Target: None.
    HALT_BUILDING: 315,   // Target: None.
    HALT_TERRANBUILD: 348,   // Target: None.
    HARVEST_GATHER: 3666,  // Target: Unit.
    HARVEST_GATHER_DRONE: 1183,  // Target: Unit.
    HARVEST_GATHER_PROBE: 298,   // Target: Unit.
    HARVEST_GATHER_SCV: 295,   // Target: Unit.
    HARVEST_RETURN: 3667,  // Target: None.
    HARVEST_RETURN_DRONE: 1184,  // Target: None.
    HARVEST_RETURN_MULE: 167,   // Target: None.
    HARVEST_RETURN_PROBE: 299,   // Target: None.
    HARVEST_RETURN_SCV: 296,   // Target: None.
    HOLDPOSITION: 18,    // Target: None.
    LAND: 3678,  // Target: Point.
    LAND_BARRACKS: 554,   // Target: Point.
    LAND_COMMANDCENTER: 419,   // Target: Point.
    LAND_FACTORY: 520,   // Target: Point.
    LAND_ORBITALCOMMAND: 1524,  // Target: Point.
    LAND_STARPORT: 522,   // Target: Point.
    LIFT: 3679,  // Target: None.
    LIFT_BARRACKS: 452,   // Target: None.
    LIFT_COMMANDCENTER: 417,   // Target: None.
    LIFT_FACTORY: 485,   // Target: None.
    LIFT_ORBITALCOMMAND: 1522,  // Target: None.
    LIFT_STARPORT: 518,   // Target: None.
    LOAD: 3668,  // Target: Unit.
    LOADALL: 3663,  // Target: None.
    LOADALL_COMMANDCENTER: 416,   // Target: None.
    LOAD_BUNKER: 407,   // Target: Unit.
    LOAD_MEDIVAC: 394,   // Target: Unit.
    MORPH_ARCHON: 1766,  // Target: None.
    MORPH_BROODLORD: 1372,  // Target: None.
    MORPH_GATEWAY: 1520,  // Target: None.
    MORPH_GREATERSPIRE: 1220,  // Target: None.
    MORPH_HELLBAT: 1998,  // Target: None.
    MORPH_HELLION: 1978,  // Target: None.
    MORPH_HIVE: 1218,  // Target: None.
    MORPH_LAIR: 1216,  // Target: None.
    MORPH_LIBERATORAAMODE: 2560,  // Target: None.
    MORPH_LIBERATORAGMODE: 2558,  // Target: Point.
    MORPH_LURKER: 2332,  // Target: None.
    MORPH_LURKERDEN: 2112,  // Target: None.
    MORPH_MOTHERSHIP: 1847,  // Target: None.
    MORPH_ORBITALCOMMAND: 1516,  // Target: None.
    MORPH_OVERLORDTRANSPORT: 2708,  // Target: None.
    MORPH_OVERSEER: 1448,  // Target: None.
    MORPH_PLANETARYFORTRESS: 1450,  // Target: None.
    MORPH_RAVAGER: 2330,  // Target: None.
    MORPH_ROOT: 3680,  // Target: Point.
    MORPH_SIEGEMODE: 388,   // Target: None.
    MORPH_SPINECRAWLERROOT: 1729,  // Target: Point.
    MORPH_SPINECRAWLERUPROOT: 1725,  // Target: None.
    MORPH_SPORECRAWLERROOT: 1731,  // Target: Point.
    MORPH_SPORECRAWLERUPROOT: 1727,  // Target: None.
    MORPH_SUPPLYDEPOT_LOWER: 556,   // Target: None.
    MORPH_SUPPLYDEPOT_RAISE: 558,   // Target: None.
    MORPH_THOREXPLOSIVEMODE: 2364,  // Target: None.
    MORPH_THORHIGHIMPACTMODE: 2362,  // Target: None.
    MORPH_UNSIEGE: 390,   // Target: None.
    MORPH_UPROOT: 3681,  // Target: None.
    MORPH_VIKINGASSAULTMODE: 403,   // Target: None.
    MORPH_VIKINGFIGHTERMODE: 405,   // Target: None.
    MORPH_WARPGATE: 1518,  // Target: None.
    MORPH_WARPPRISMPHASINGMODE: 1528,  // Target: None.
    MORPH_WARPPRISMTRANSPORTMODE: 1530,  // Target: None.
    MOVE: 16,    // Target: Unit, Point.
    PATROL: 17,    // Target: Unit, Point.
    RALLY_BUILDING: 195,   // Target: Unit, Point.
    RALLY_COMMANDCENTER: 203,   // Target: Unit, Point.
    RALLY_HATCHERY_UNITS: 211,   // Target: Unit, Point.
    RALLY_HATCHERY_WORKERS: 212,   // Target: Unit, Point.
    RALLY_MORPHING_UNIT: 199,   // Target: Unit, Point.
    RALLY_NEXUS: 207,   // Target: Unit, Point.
    RALLY_UNITS: 3673,  // Target: Unit, Point.
    RALLY_WORKERS: 3690,  // Target: Unit, Point.
    RESEARCH_ADEPTRESONATINGGLAIVES: 1594,  // Target: None.
    RESEARCH_ADVANCEDBALLISTICS: 805,   // Target: None.
    RESEARCH_BANSHEECLOAKINGFIELD: 790,   // Target: None.
    RESEARCH_BANSHEEHYPERFLIGHTROTORS: 799,   // Target: None.
    RESEARCH_BATTLECRUISERWEAPONREFIT: 1532,  // Target: None.
    RESEARCH_BLINK: 1593,  // Target: None.
    RESEARCH_BURROW: 1225,  // Target: None.
    RESEARCH_CENTRIFUGALHOOKS: 1482,  // Target: None.
    RESEARCH_CHARGE: 1592,  // Target: None.
    RESEARCH_CHITINOUSPLATING: 265,   // Target: None.
    RESEARCH_COMBATSHIELD: 731,   // Target: None.
    RESEARCH_CONCUSSIVESHELLS: 732,   // Target: None.
    RESEARCH_DRILLINGCLAWS: 764,   // Target: None.
    RESEARCH_ENHANCEDMUNITIONS: 806,   // Target: None.
    RESEARCH_EXTENDEDTHERMALLANCE: 1097,  // Target: None.
    RESEARCH_GLIALREGENERATION: 216,   // Target: None.
    RESEARCH_GRAVITICBOOSTER: 1093,  // Target: None.
    RESEARCH_GRAVITICDRIVE: 1094,  // Target: None.
    RESEARCH_GROOVEDSPINES: 1282,  // Target: None.
    RESEARCH_HIGHCAPACITYFUELTANKS: 804,   // Target: None.
    RESEARCH_HISECAUTOTRACKING: 650,   // Target: None.
    RESEARCH_INFERNALPREIGNITER: 761,   // Target: None.
    RESEARCH_INTERCEPTORGRAVITONCATAPULT: 44,    // Target: None.
    RESEARCH_MAGFIELDLAUNCHERS: 766,   // Target: None.
    RESEARCH_MUSCULARAUGMENTS: 1283,  // Target: None.
    RESEARCH_NEOSTEELFRAME: 655,   // Target: None.
    RESEARCH_NEURALPARASITE: 1455,  // Target: None.
    RESEARCH_PATHOGENGLANDS: 1454,  // Target: None.
    RESEARCH_PERSONALCLOAKING: 820,   // Target: None.
    RESEARCH_PHOENIXANIONPULSECRYSTALS: 46,    // Target: None.
    RESEARCH_PNEUMATIZEDCARAPACE: 1223,  // Target: None.
    RESEARCH_PROTOSSAIRARMOR: 3692,  // Target: None.
    RESEARCH_PROTOSSAIRARMORLEVEL1: 1565,  // Target: None.
    RESEARCH_PROTOSSAIRARMORLEVEL2: 1566,  // Target: None.
    RESEARCH_PROTOSSAIRARMORLEVEL3: 1567,  // Target: None.
    RESEARCH_PROTOSSAIRWEAPONS: 3693,  // Target: None.
    RESEARCH_PROTOSSAIRWEAPONSLEVEL1: 1562,  // Target: None.
    RESEARCH_PROTOSSAIRWEAPONSLEVEL2: 1563,  // Target: None.
    RESEARCH_PROTOSSAIRWEAPONSLEVEL3: 1564,  // Target: None.
    RESEARCH_PROTOSSGROUNDARMOR: 3694,  // Target: None.
    RESEARCH_PROTOSSGROUNDARMORLEVEL1: 1065,  // Target: None.
    RESEARCH_PROTOSSGROUNDARMORLEVEL2: 1066,  // Target: None.
    RESEARCH_PROTOSSGROUNDARMORLEVEL3: 1067,  // Target: None.
    RESEARCH_PROTOSSGROUNDWEAPONS: 3695,  // Target: None.
    RESEARCH_PROTOSSGROUNDWEAPONSLEVEL1: 1062,  // Target: None.
    RESEARCH_PROTOSSGROUNDWEAPONSLEVEL2: 1063,  // Target: None.
    RESEARCH_PROTOSSGROUNDWEAPONSLEVEL3: 1064,  // Target: None.
    RESEARCH_PROTOSSSHIELDS: 3696,  // Target: None.
    RESEARCH_PROTOSSSHIELDSLEVEL1: 1068,  // Target: None.
    RESEARCH_PROTOSSSHIELDSLEVEL2: 1069,  // Target: None.
    RESEARCH_PROTOSSSHIELDSLEVEL3: 1070,  // Target: None.
    RESEARCH_PSISTORM: 1126,  // Target: None.
    RESEARCH_RAPIDFIRELAUNCHERS: 768,  // Target: None.
    RESEARCH_RAVENCORVIDREACTOR: 793,   // Target: None.
    RESEARCH_RAVENRECALIBRATEDEXPLOSIVES: 803,   // Target: None.
    RESEARCH_SHADOWSTRIKE: 2720,  // Target: None.
    RESEARCH_SMARTSERVOS: 766, // Target: None.
    RESEARCH_STIMPACK: 730,   // Target: None.
    RESEARCH_TERRANINFANTRYARMOR: 3697,  // Target: None.
    RESEARCH_TERRANINFANTRYARMORLEVEL1: 656,   // Target: None.
    RESEARCH_TERRANINFANTRYARMORLEVEL2: 657,   // Target: None.
    RESEARCH_TERRANINFANTRYARMORLEVEL3: 658,   // Target: None.
    RESEARCH_TERRANINFANTRYWEAPONS: 3698,  // Target: None.
    RESEARCH_TERRANINFANTRYWEAPONSLEVEL1: 652,   // Target: None.
    RESEARCH_TERRANINFANTRYWEAPONSLEVEL2: 653,   // Target: None.
    RESEARCH_TERRANINFANTRYWEAPONSLEVEL3: 654,   // Target: None.
    RESEARCH_TERRANSHIPWEAPONS: 3699,  // Target: None.
    RESEARCH_TERRANSHIPWEAPONSLEVEL1: 861,   // Target: None.
    RESEARCH_TERRANSHIPWEAPONSLEVEL2: 862,   // Target: None.
    RESEARCH_TERRANSHIPWEAPONSLEVEL3: 863,   // Target: None.
    RESEARCH_TERRANSTRUCTUREARMORUPGRADE: 651,   // Target: None.
    RESEARCH_TERRANVEHICLEANDSHIPPLATING: 3700,  // Target: None.
    RESEARCH_TERRANVEHICLEANDSHIPPLATINGLEVEL1: 864,   // Target: None.
    RESEARCH_TERRANVEHICLEANDSHIPPLATINGLEVEL2: 865,   // Target: None.
    RESEARCH_TERRANVEHICLEANDSHIPPLATINGLEVEL3: 866,   // Target: None.
    RESEARCH_TERRANVEHICLEWEAPONS: 3701,  // Target: None.
    RESEARCH_TERRANVEHICLEWEAPONSLEVEL1: 855,   // Target: None.
    RESEARCH_TERRANVEHICLEWEAPONSLEVEL2: 856,   // Target: None.
    RESEARCH_TERRANVEHICLEWEAPONSLEVEL3: 857,   // Target: None.
    RESEARCH_TUNNELINGCLAWS: 217,   // Target: None.
    RESEARCH_WARPGATE: 1568,  // Target: None.
    RESEARCH_ZERGFLYERARMOR: 3702,  // Target: None.
    RESEARCH_ZERGFLYERARMORLEVEL1: 1315,  // Target: None.
    RESEARCH_ZERGFLYERARMORLEVEL2: 1316,  // Target: None.
    RESEARCH_ZERGFLYERARMORLEVEL3: 1317,  // Target: None.
    RESEARCH_ZERGFLYERATTACK: 3703,  // Target: None.
    RESEARCH_ZERGFLYERATTACKLEVEL1: 1312,  // Target: None.
    RESEARCH_ZERGFLYERATTACKLEVEL2: 1313,  // Target: None.
    RESEARCH_ZERGFLYERATTACKLEVEL3: 1314,  // Target: None.
    RESEARCH_ZERGGROUNDARMOR: 3704,  // Target: None.
    RESEARCH_ZERGGROUNDARMORLEVEL1: 1189,  // Target: None.
    RESEARCH_ZERGGROUNDARMORLEVEL2: 1190,  // Target: None.
    RESEARCH_ZERGGROUNDARMORLEVEL3: 1191,  // Target: None.
    RESEARCH_ZERGLINGADRENALGLANDS: 1252,  // Target: None.
    RESEARCH_ZERGLINGMETABOLICBOOST: 1253,  // Target: None.
    RESEARCH_ZERGMELEEWEAPONS: 3705,  // Target: None.
    RESEARCH_ZERGMELEEWEAPONSLEVEL1: 1186,  // Target: None.
    RESEARCH_ZERGMELEEWEAPONSLEVEL2: 1187,  // Target: None.
    RESEARCH_ZERGMELEEWEAPONSLEVEL3: 1188,  // Target: None.
    RESEARCH_ZERGMISSILEWEAPONS: 3706,  // Target: None.
    RESEARCH_ZERGMISSILEWEAPONSLEVEL1: 1192,  // Target: None.
    RESEARCH_ZERGMISSILEWEAPONSLEVEL2: 1193,  // Target: None.
    RESEARCH_ZERGMISSILEWEAPONSLEVEL3: 1194,  // Target: None.
    SCAN_MOVE: 19,    // Target: Unit, Point.
    STOP: 3665,  // Target: None.
    STOP_BUILDING: 2057,  // Target: None.
    STOP_CHEER: 6,     // Target: None.
    STOP_DANCE: 7,     // Target: None.
    STOP_REDIRECT: 1691,  // Target: None.
    STOP_STOP: 4,     // Target: None.
    TRAINWARP_ADEPT: 1419,  // Target: Point.
    TRAINWARP_DARKTEMPLAR: 1417,  // Target: Point.
    TRAINWARP_HIGHTEMPLAR: 1416,  // Target: Point.
    TRAINWARP_SENTRY: 1418,  // Target: Point.
    TRAINWARP_STALKER: 1414,  // Target: Point.
    TRAINWARP_ZEALOT: 1413,  // Target: Point.
    TRAIN_ADEPT: 922,   // Target: None.
    TRAIN_BANELING: 80,    // Target: None.
    TRAIN_BANSHEE: 621,   // Target: None.
    TRAIN_BATTLECRUISER: 623,   // Target: None.
    TRAIN_CARRIER: 948,   // Target: None.
    TRAIN_COLOSSUS: 978,   // Target: None.
    TRAIN_CORRUPTOR: 1353,  // Target: None.
    TRAIN_CYCLONE: 597,   // Target: None.
    TRAIN_DARKTEMPLAR: 920,   // Target: None.
    TRAIN_DISRUPTOR: 994,   // Target: None.
    TRAIN_DRONE: 1342,  // Target: None.
    TRAIN_GHOST: 562,   // Target: None.
    TRAIN_HELLBAT: 596,   // Target: None.
    TRAIN_HELLION: 595,   // Target: None.
    TRAIN_HIGHTEMPLAR: 919,   // Target: None.
    TRAIN_HYDRALISK: 1345,  // Target: None.
    TRAIN_IMMORTAL: 979,   // Target: None.
    TRAIN_INFESTOR: 1352,  // Target: None.
    TRAIN_LIBERATOR: 626,   // Target: None.
    TRAIN_MARAUDER: 563,   // Target: None.
    TRAIN_MARINE: 560,   // Target: None.
    TRAIN_MEDIVAC: 620,   // Target: None.
    TRAIN_MOTHERSHIP: 110,  // Target: None.
    TRAIN_MOTHERSHIPCORE: 1853,  // Target: None.
    TRAIN_MUTALISK: 1346,  // Target: None.
    TRAIN_OBSERVER: 977,   // Target: None.
    TRAIN_ORACLE: 954,   // Target: None.
    TRAIN_OVERLORD: 1344,  // Target: None.
    TRAIN_PHOENIX: 946,   // Target: None.
    TRAIN_PROBE: 1006,  // Target: None.
    TRAIN_QUEEN: 1632,  // Target: None.
    TRAIN_RAVEN: 622,   // Target: None.
    TRAIN_REAPER: 561,   // Target: None.
    TRAIN_ROACH: 1351,  // Target: None.
    TRAIN_SCV: 524,   // Target: None.
    TRAIN_SENTRY: 921,   // Target: None.
    TRAIN_SIEGETANK: 591,   // Target: None.
    TRAIN_STALKER: 917,   // Target: None.
    TRAIN_SWARMHOST: 1356,  // Target: None.
    TRAIN_TEMPEST: 955,   // Target: None.
    TRAIN_THOR: 594,   // Target: None.
    TRAIN_ULTRALISK: 1348,  // Target: None.
    TRAIN_VIKINGFIGHTER: 624,   // Target: None.
    TRAIN_VIPER: 1354,  // Target: None.
    TRAIN_VOIDRAY: 950,   // Target: None.
    TRAIN_WARPPRISM: 976,   // Target: None.
    TRAIN_WIDOWMINE: 614,   // Target: None.
    TRAIN_ZEALOT: 916,   // Target: None.
    TRAIN_ZERGLING: 1343,  // Target: None.
    UNLOADALL: 3664,  // Target: None.
    UNLOADALLAT: 3669,  // Target: Unit, Point.
    UNLOADALLAT_MEDIVAC: 396,   // Target: Unit, Point.
    UNLOADALLAT_OVERLORD: 1408,  // Target: Unit, Point.
    UNLOADALLAT_WARPPRISM: 913,   // Target: Unit, Point.
    UNLOADALL_BUNKER: 408,   // Target: None.
    UNLOADALL_COMMANDCENTER: 413,   // Target: None.
    UNLOADALL_NYDASNETWORK: 1438,  // Target: None.
    UNLOADALL_NYDUSWORM: 2371,  // Target: None.
    UNLOADUNIT_BUNKER: 410,   // Target: None.
    UNLOADUNIT_COMMANDCENTER: 415,   // Target: None.
    UNLOADUNIT_MEDIVAC: 397,   // Target: None.
    UNLOADUNIT_NYDASNETWORK: 1440,  // Target: None.
    UNLOADUNIT_OVERLORD: 1409,  // Target: None.
    UNLOADUNIT_WARPPRISM: 914,   // Target: None.
};

module.exports = Ability;