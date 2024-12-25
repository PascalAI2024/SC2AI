import { System, SystemState } from '../utils/create-system';
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
declare class EconomySystem extends System {
    state: EconomyState;
    private manageWorkerProduction;
    private optimizeWorkerDistribution;
    private shouldExpand;
    constructor(options: {
        defaultOptions: {
            state: EconomyState;
        };
    });
}
export declare function createEconomySystem(options: {
    defaultOptions: {
        state: EconomyState;
    };
}): EconomySystem;
export {};
