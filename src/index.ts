import { createImprovedAgent } from './agent/improved-agent';
import { Race, Difficulty, PlayerType } from './constants/enums';
import { createSystems } from './systems';
import { Logger } from './utils/logger';
import { createEngine as createEngineCore, createPlayer as createPlayerCore } from '@node-sc2/core';
import { CreateEngine, CreatePlayer, Engine } from './types/core';

const createEngine = createEngineCore;
const createPlayer = createPlayerCore;

async function initializeBot() {
    try {
        Logger.log('Initializing SC2 AI Bot');

        // Create our bot instance
        const bot = createImprovedAgent({
            settings: {
                race: Race.Protoss,
            }
        });

        // Initialize all systems
        const systems = createSystems();
        bot.use(Object.values(systems));

        Logger.log('Bot systems initialized successfully');

        return bot;
    } catch (error) {
        Logger.error(`Failed to initialize bot: ${error}`);
        throw error;
    }
}

async function startGame(bot: ReturnType<typeof createImprovedAgent>) {
    try {
        Logger.log('Starting SC2 game');

        const engine = createEngine({
            host: '127.0.0.1',
            port: 5000
        }) as any;
        await engine.connect();
        Logger.log('Connected to SC2 client');

        // Run game against Elite AI
        await engine.runGame('AcropolisLE', [
            createPlayer({ race: Race.Protoss, type: PlayerType.Participant }, bot),
            createPlayer({ race: Race.Random, type: PlayerType.Computer, difficulty: Difficulty.VeryHard }),
        ]);

        Logger.log('Game completed successfully');
    } catch (error) {
        Logger.error(`Error during game: ${error}`);
        throw error;
    }
}

// Initialize and run the bot
initializeBot()
    .then(startGame)
    .catch(error => {
        Logger.error(`Fatal error: ${error}`);
        process.exit(1);
    });
