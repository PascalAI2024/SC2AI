import { Race } from '../constants/enums';
import { System, SystemWrapper } from '../types/agent';
import { Logger } from '../utils/logger';

// Simple machine learning model using Q-learning principles
class MLDecisionModel {
    private qTable: Map<string, number> = new Map();
    private learningRate: number = 0.1;
    private discountFactor: number = 0.9;
    private explorationRate: number = 0.2;

    constructor() {}

    public chooseAction(state: string, availableActions: string[]): string {
        // Exploration vs exploitation
        if (Math.random() < this.explorationRate) {
            return availableActions[Math.floor(Math.random() * availableActions.length)];
        }

        // Find best action based on Q-values
        let bestAction = availableActions[0];
        let bestValue = this.getQValue(state, bestAction);

        for (const action of availableActions.slice(1)) {
            const qValue = this.getQValue(state, action);
            if (qValue > bestValue) {
                bestAction = action;
                bestValue = qValue;
            }
        }

        return bestAction;
    }

    private getQValue(state: string, action: string): number {
        const key = `${state}:${action}`;
        return this.qTable.get(key) || 0;
    }

    public updateQValue(state: string, action: string, reward: number, nextState: string): void {
        const key = `${state}:${action}`;
        const currentQValue = this.getQValue(state, action);
        
        // Find max Q-value for next state
        const nextStateActions = this.getActionsForState(nextState);
        const maxNextQValue = nextStateActions.reduce((max, nextAction) => 
            Math.max(max, this.getQValue(nextState, nextAction)), 0);

        // Q-learning update rule
        const updatedQValue = currentQValue + 
            this.learningRate * (reward + this.discountFactor * maxNextQValue - currentQValue);

        this.qTable.set(key, updatedQValue);
    }

    private getActionsForState(state: string): string[] {
        // This would be dynamically determined based on game state
        const possibleActions = [
            'expand', 
            'attack', 
            'defend', 
            'tech_up', 
            'harass'
        ];
        return possibleActions;
    }
}

class MLIntegrationManager implements System {
    public _system: any;
    public state: any = {};
    private decisionModel: MLDecisionModel;

    constructor() {
        this._system = {};
        this.decisionModel = new MLDecisionModel();
    }

    public setState(newState: any): void {
        this.state = { ...this.state, ...newState };
    }

    public pause(): void {
        Logger.log('ML Integration manager paused');
    }

    public unpause(): void {
        Logger.log('ML Integration manager resumed');
    }

    public setup(world: any): void {
        const { race } = world.agent.settings;
        Logger.log(`ML Integration initialized for ${Race[race]}`);
    }

    public async makeStrategicDecision(world: any): Promise<string> {
        const resources = world.resources.get();
        const { frame, units } = resources;

        // Generate state representation
        const state = this.generateStateRepresentation(world);
        const availableActions = this.getAvailableActions(world);

        // Choose action using ML model
        const chosenAction = this.decisionModel.chooseAction(state, availableActions);

        // Log decision
        Logger.log(`ML Strategic Decision: ${chosenAction}`);

        return chosenAction;
    }

    private generateStateRepresentation(world: any): string {
        const resources = world.resources.get();
        const { frame, units } = resources;

        // Comprehensive state representation
        const currentSupply = frame.getObservation().playerCommon.foodUsed;
        const minerals = frame.getObservation().playerCommon.minerals;
        const armyCount = units.getCombatUnits().length;
        const workerCount = units.getWorkers().length;

        return `supply:${currentSupply},minerals:${minerals},army:${armyCount},workers:${workerCount}`;
    }

    private getAvailableActions(world: any): string[] {
        const resources = world.resources.get();
        const { units, frame } = resources;

        const currentSupply = frame.getObservation().playerCommon.foodUsed;
        const minerals = frame.getObservation().playerCommon.minerals;

        const actions = ['expand', 'attack', 'defend', 'tech_up'];

        // Context-based action filtering
        if (currentSupply < 30) {
            return ['expand', 'tech_up'];
        }

        if (minerals < 500) {
            return ['defend', 'harass'];
        }

        return actions;
    }

    public provideFeedback(state: string, action: string, reward: number, nextState: string): void {
        this.decisionModel.updateQValue(state, action, reward, nextState);
        Logger.log(`ML Feedback: State ${state}, Action ${action}, Reward ${reward}`);
    }
}

export function createMLIntegrationManager(): SystemWrapper<MLIntegrationManager> {
    const manager = new MLIntegrationManager();
    
    const wrapper = async (world: any) => {
        await manager.makeStrategicDecision(world);
    };

    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);

    return wrapper;
}
