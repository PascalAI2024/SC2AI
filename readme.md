# SC2 AI Bot

A StarCraft II AI bot built using TypeScript and the `@node-sc2/core` library.

## Project Structure

```
src/
├── agent/             # Bot agent implementation
├── constants/         # Game constants and enums
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and helpers
```

## Bot Strategy

### Core Components

1. **ImprovedAgent**: Enhanced agent implementation with:
   - Resource management (minerals, vespene, supply)
   - Tech tree progression tracking
   - Plugin system for extensibility
   - Event-driven architecture

2. **Systems**: Modular components that handle specific aspects of gameplay:
   - Build order execution
   - Unit production
   - Combat management
   - Resource gathering
   - Base expansion

### Implementation Plan

1. **Early Game (0-5 minutes)**
   - Establish efficient worker production
   - Execute initial build order
   - Scout enemy base
   - Begin tech progression

2. **Mid Game (5-12 minutes)**
   - Expand to additional bases
   - Develop army composition
   - Control map vision
   - React to enemy strategies

3. **Late Game (12+ minutes)**
   - Maintain economy
   - Execute complex army maneuvers
   - Control multiple bases
   - Tech switches based on enemy composition

### Next Steps

1. [x] Implement basic worker management
2. [x] Create build order system
3. [x] Add combat unit control
4. [x] Develop scouting logic
5. [x] Implement strategic decision-making
6. [x] Enhance base expansion logic
7. [x] Develop advanced machine learning integration
8. [x] Optimize performance and decision-making algorithms

### Current Systems

1. **Worker Management**
   - Efficiently distributes workers to mineral and gas fields
   - Tracks optimal worker count
   - Handles idle worker reassignment
   - Dynamic resource allocation
   - Adaptive worker distribution

2. **Build Order Management**
   - Race-specific build order strategies
   - Dynamic supply tracking
   - Adaptive unit production
   - Supports Protoss, Terran, and Zerg races
   - Flexible build queue management
   - Intelligent resource prioritization

3. **Combat Management**
   - Dynamic army strength calculation
   - Race-specific unit composition
   - Strategic attack, retreat, and formation maintenance
   - Adaptive decision-making based on army strength
   - Supports Protoss, Terran, and Zerg races
   - Intelligent unit positioning
   - Real-time tactical adjustments

4. **Scouting Management**
   - Periodically explore map starting positions
   - Detect enemy race
   - Locate enemy base
   - Track explored map areas
   - Race-specific scout unit selection
   - Intelligent map intelligence gathering
   - Dynamic exploration strategy

5. **Strategic Management**
   - Holistic game state analysis
   - Dynamic objective determination
   - Tech path progression tracking
   - Adaptive strategy selection
   - Objective-based decision making
   - Long-term game plan development
   - Context-aware strategic shifts

6. **Base Expansion Management**
   - Intelligent base location selection
   - Dynamic expansion thresholds
   - Race-specific expansion strategies
   - Resource-driven expansion decisions
   - Optimal base count management

7. **Machine Learning Integration**
   - Q-learning based strategic decision model
   - Adaptive action selection
   - Reward-driven learning
   - State representation generation
   - Exploration vs exploitation balance
   - Continuous strategy improvement

## Development

### Quick Setup

```bash
# Run the setup script to install dependencies
./setup.sh
```

### Prerequisites

1. **Development Environment**
   - Node.js (v14+ recommended)
   - npm or Yarn
   - Git

2. **StarCraft II (Optional for Development)**
   - Free to Play edition
   - Recommended but not required for initial development

### Development Modes

#### Without StarCraft II
- Develop and test bot logic
- Run unit tests
- Build project infrastructure

#### With StarCraft II
1. Install StarCraft II
2. Download [Ladder Maps](https://github.com/Blizzard/s2client-proto#downloads)
3. Launch in development mode:
   ```bash
   # macOS
   "/Applications/StarCraft II/Support/SC2Switcher.app/Contents/MacOS/SC2Switcher" --listen 127.0.0.1 --port 5000

   # Windows
   "C:/Program Files (x86)/StarCraft II/Support/SC2Switcher.exe" --listen 127.0.0.1 --port 5000
   ```

### Development Commands

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run bot (requires StarCraft II)
npm start
```

### Troubleshooting

If you get a 403 error:
1. Make sure StarCraft II is running in development mode
2. Check that the port (5000) is not in use
3. Try restarting StarCraft II
4. Verify map files are in the correct location

## Testing

The bot can be tested against:
- Built-in AI
- Other custom bots
- Ladder games

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
