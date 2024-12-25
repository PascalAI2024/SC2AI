"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const improved_agent_1 = require("./agent/improved-agent");
const enums_1 = require("./constants/enums");
const systems_1 = require("./systems");
const logger_1 = require("./utils/logger");
const core_1 = require("@node-sc2/core");
const createEngine = core_1.createEngine;
const createPlayer = core_1.createPlayer;
async function initializeBot() {
    try {
        logger_1.Logger.log('Initializing SC2 AI Bot');
        // Create our bot instance
        const bot = (0, improved_agent_1.createImprovedAgent)({
            settings: {
                race: enums_1.Race.Protoss,
            }
        });
        // Initialize all systems
        const systems = (0, systems_1.createSystems)();
        bot.use(Object.values(systems));
        logger_1.Logger.log('Bot systems initialized successfully');
        return bot;
    }
    catch (error) {
        logger_1.Logger.error(`Failed to initialize bot: ${error}`);
        throw error;
    }
}
async function startGame(bot) {
    try {
        logger_1.Logger.log('Starting SC2 game');
        const engine = createEngine({
            host: '127.0.0.1',
            port: 5000
        });
        await engine.connect();
        logger_1.Logger.log('Connected to SC2 client');
        // Run game against Elite AI
        await engine.runGame('AcropolisLE', [
            createPlayer({ race: enums_1.Race.Protoss, type: enums_1.PlayerType.Participant }, bot),
            createPlayer({ race: enums_1.Race.Random, type: enums_1.PlayerType.Computer, difficulty: enums_1.Difficulty.VeryHard }),
        ]);
        logger_1.Logger.log('Game completed successfully');
    }
    catch (error) {
        logger_1.Logger.error(`Error during game: ${error}`);
        throw error;
    }
}
// Initialize and run the bot
initializeBot()
    .then(startGame)
    .catch(error => {
    logger_1.Logger.error(`Fatal error: ${error}`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map