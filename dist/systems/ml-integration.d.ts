import { System, SystemWrapper } from '../types/agent';
declare class MLIntegrationManager implements System {
    _system: any;
    state: any;
    private decisionModel;
    constructor();
    setState(newState: any): void;
    pause(): void;
    unpause(): void;
    setup(world: any): void;
    makeStrategicDecision(world: any): Promise<string>;
    private generateStateRepresentation;
    private getAvailableActions;
    provideFeedback(state: string, action: string, reward: number, nextState: string): void;
}
export declare function createMLIntegrationManager(): SystemWrapper<MLIntegrationManager>;
export {};
