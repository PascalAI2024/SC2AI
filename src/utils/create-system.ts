import { Logger } from './logger';

export interface SystemState {
    [key: string]: any;
}

export interface SystemOptions {
    state?: SystemState;
}

export interface BuildTask {
    type: 'build' | 'upgrade';
    unit?: number;
    upgrade?: number;
    count?: number;
}

export interface SystemBlueprint {
    name: string;
    type?: 'build' | 'combat' | 'economy' | 'scout';
    defaultOptions?: {
        state?: SystemState;
    };
    buildOrder?: [number, BuildTask][];
    onStep?: (world: any) => Promise<void>;
    onGameStart?: (world: any) => Promise<void>;
    onUnitCreated?: (world: any, unit: any) => Promise<void>;
    onUnitFinished?: (world: any, unit: any) => Promise<void>;
    onUpgradeComplete?: (world: any, upgrade: any) => Promise<void>;
    buildComplete?: () => Promise<void>;
    [key: string]: any; // Allow additional methods and properties
}

export interface SystemMethods {
    setState(newState: Partial<SystemState>): void;
    getBuildOrder(): [number, BuildTask][] | undefined;
    getType(): string;
    getName(): string;
    [key: string]: any;
}

export class System implements SystemMethods {
    public name: string;
    public type: string;
    public state: SystemState;
    public buildOrder?: [number, BuildTask][];

    constructor(blueprint: SystemBlueprint) {
        this.name = blueprint.name;
        this.type = blueprint.type || 'generic';
        this.state = blueprint.defaultOptions?.state || {};
        this.buildOrder = blueprint.buildOrder;

        // Bind all methods from blueprint to this instance
        Object.entries(blueprint).forEach(([key, value]) => {
            if (typeof value === 'function') {
                (this as any)[key] = value.bind(this);
            }
        });

        // Create a proxy to handle method access
        return new Proxy(this, {
            get: (target: System, prop: string | symbol) => {
                const value = (target as any)[prop];
                if (typeof value === 'function') {
                    return value.bind(target);
                }
                return value;
            }
        });

        Logger.log(`System created: ${this.name} (${this.type})`);
    }

    public setState(newState: Partial<SystemState>): void {
        this.state = {
            ...this.state,
            ...newState,
        };
        Logger.log(`State updated for ${this.name}: ${JSON.stringify(newState)}`);
    }

    public getBuildOrder(): [number, BuildTask][] | undefined {
        return this.buildOrder;
    }

    public getType(): string {
        return this.type;
    }

    public getName(): string {
        return this.name;
    }
}


export function createSystem(blueprint: SystemBlueprint): System {
    return new System(blueprint);
}
