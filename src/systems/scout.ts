import { Race } from '../constants/enums';
import { System, SystemWrapper } from '../types/agent';
import { Logger } from '../utils/logger';
import { Unit, Position } from '../types/base-types';

interface ScoutState {
    scoutingUnits: number[];
    exploredPositions: Position[];
    enemyBaseLocation?: Position;
    enemyRace?: Race;
    lastScoutTime: number;
    scoutInterval: number;
}

class ScoutManager implements System {
    public _system: any;
    public state: ScoutState = {
        scoutingUnits: [],
        exploredPositions: [],
        lastScoutTime: 0,
        scoutInterval: 300  // Scout every 300 game loops (roughly every 5 seconds)
    };

    constructor() {
        this._system = {};
    }

    public pause(): void {
        Logger.log('Scout manager paused');
    }

    public unpause(): void {
        Logger.log('Scout manager resumed');
    }

    public setState(newState: Partial<ScoutState>): void {
        this.state = { ...this.state, ...newState };
    }

    public setup(world: any): void {
        const resources = world.resources.get();
        const { race } = world.agent.settings;

        // Select appropriate scouting unit based on race
        const scoutUnitType = this.getScoutUnitType(race);
        const scoutUnits = resources.units.getByType(scoutUnitType);

        if (scoutUnits.length > 0) {
            this.state.scoutingUnits = scoutUnits.map((unit: {tag: number}) => unit.tag);
            Logger.log(`Initialized scout units for ${Race[race]}`);
        } else {
            Logger.log('No scout units available');
        }
    }

    private getScoutUnitType(race: Race): number {
        switch (race) {
            case Race.Protoss: return 71;  // Probe
            case Race.Terran: return 45;   // SCV
            case Race.Zerg: return 104;    // Drone
            default: return 71;            // Default to Probe
        }
    }

    public async scout(world: any): Promise<void> {
        const resources = world.resources.get();
        const { units, map, actions } = resources;
        const currentGameLoop = resources.frame.getGameLoop();

        // Only scout periodically
        if (currentGameLoop - this.state.lastScoutTime < this.state.scoutInterval) {
            return;
        }

        // Get scout units
        const scoutUnits: Unit[] = this.state.scoutingUnits
            .map(tag => units.getById(tag)[0])
            .filter((unit: Unit | undefined): unit is Unit => unit !== undefined && !unit.orders?.length);

        if (scoutUnits.length === 0) {
            return;
        }

        // Find unexplored map positions
        const startPositions: Position[] = map.getStartingPositions();
        const unexploredPositions = startPositions.filter(pos => 
            !this.state.exploredPositions.some(explored => 
                this.positionsMatch(explored, pos)
            )
        );

        if (unexploredPositions.length > 0) {
            const targetPosition = unexploredPositions[0];
            
            // Send scout to unexplored position
            await actions.move(scoutUnits, targetPosition);
            
            // Track explored positions
            this.state.exploredPositions.push(targetPosition);
            this.state.lastScoutTime = currentGameLoop;

            Logger.log(`Scouting unexplored position: ${JSON.stringify(targetPosition)}`);
        }
    }

    private positionsMatch(pos1: Position, pos2: Position, tolerance: number = 5): boolean {
        return (
            Math.abs(pos1.x - pos2.x) <= tolerance &&
            Math.abs(pos1.y - pos2.y) <= tolerance
        );
    }

    public analyzeEnemyBase(world: any): void {
        const resources = world.resources.get();
        const enemyUnits = resources.units.getById(0, { alliance: 'enemy' });

        if (enemyUnits.length > 0) {
            // Determine enemy race based on units
            const enemyRace = this.determineEnemyRace(enemyUnits);
            
            if (enemyRace) {
                this.state.enemyRace = enemyRace;
                Logger.log(`Enemy race detected: ${Race[enemyRace]}`);
            }

            // Find enemy base location
            const baseLocation = this.findEnemyBaseLocation(enemyUnits);
            if (baseLocation) {
                this.state.enemyBaseLocation = baseLocation;
                Logger.log(`Enemy base location found: ${JSON.stringify(baseLocation)}`);
            }
        }
    }

    private determineEnemyRace(enemyUnits: Unit[]): Race | undefined {
        const raceUnitTypes: {[key in Race]: number[]} = {
            [Race.Protoss]: [59, 63, 65, 74],  // Nexus, Gateway, Zealot, Stalker
            [Race.Terran]: [41, 48, 51, 54],   // Command Center, Barracks, Marine, Marauder
            [Race.Zerg]: [101, 106, 105, 108],  // Hatchery, Spawning Pool, Zergling, Roach
            [Race.NoRace]: [],
            [Race.Random]: []  // Add Random race with empty array
        };

        for (const [race, unitTypes] of Object.entries(raceUnitTypes)) {
            if (enemyUnits.some((unit: Unit) => unitTypes.includes(unit.type))) {
                return parseInt(race) as Race;
            }
        }

        return undefined;
    }

    private findEnemyBaseLocation(enemyUnits: any[]): {x: number, y: number} | undefined {
        // Look for townhall-type structures
        const townhallTypes = [59, 41, 101];  // Nexus, Command Center, Hatchery
        const townhalls = enemyUnits.filter(unit => townhallTypes.includes(unit.type));

        if (townhalls.length > 0) {
            // Return position of first townhall found
            return townhalls[0].pos;
        }

        return undefined;
    }
}

export function createScoutManager(): SystemWrapper<ScoutManager> {
    const manager = new ScoutManager();
    
    const wrapper = async (world: any) => {
        await manager.scout(world);
        manager.analyzeEnemyBase(world);
    };

    wrapper._system = manager;
    wrapper.setup = manager.setup.bind(manager);

    return wrapper;
}
