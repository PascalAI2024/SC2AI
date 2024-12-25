import { System } from '../utils/create-system';
import { SystemInitializer } from '../types/common';
interface BuildOrderState {
    buildComplete: boolean;
    workerTarget: number;
}
declare class BuildOrderSystem extends System {
    state: BuildOrderState;
    constructor(options: SystemInitializer<BuildOrderState>);
}
export declare function createBuildOrderSystem(options: SystemInitializer<BuildOrderState>): BuildOrderSystem;
export {};
