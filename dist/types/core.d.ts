import { Agent } from './agent';
export interface EngineOptions {
    host?: string;
    port?: number;
    launch?: boolean;
}
export interface PlayerSetup {
    type: number;
    race: number;
    agent?: Agent;
}
export interface GameResult {
    result: any[];
    data: any;
}
export interface Engine {
    connect: () => Promise<any>;
    runGame: (map: string, players: PlayerSetup[]) => Promise<GameResult>;
}
export type CreateEngine = (opts?: EngineOptions) => Engine;
export type CreatePlayer = (settings: {
    race: number;
    difficulty?: number;
}, agent?: Agent) => PlayerSetup;
