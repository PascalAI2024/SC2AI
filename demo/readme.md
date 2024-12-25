# node-sc2
`node-sc2` is a lightweight node.js framework to facilitate fast development of agents (or "bots") for Starcraft II in JavaScript.

<!-- TOC -->

- [Motivation](#motivation)
- [Getting started](#getting-started)
    - [Hello World](#hello-world)
- [Overview and Tutorial](#overview-and-tutorial)
- [Feature Layer and Rendered Interfaces](#feature-layer-and-rendered-interfaces)
- [Notice of Active Development](#notice-of-active-development)
- [Contributing](#contributing)
- [Ladder and Tournament Submission](#ladder-and-tournament-submission)
- [Features and Roadmap](#features-and-roadmap)
- [Environmental Variables](#environmental-variables)
    - [Speed Control](#speed-control)
    - [Debugging](#debugging)
- [Getting Help](#getting-help)
- [Changelog](#changelog)

<!-- /TOC -->

### Motivation
There are a few existing libraries in the node.js ecosystem to work with the C++ API ([sc2client-api](https://github.com/Blizzard/s2client-api)), but `node-sc2` is a pure javascript implementation of [sc2client-proto](https://github.com/Blizzard/s2client-proto), with the goal of being ergonomic across a variety of environments without the need for additional build tools. Under the hood it uses [`@node-sc2/proto`](https://github.com/node-sc2/proto#readme) as the transport layer.

### Getting started
`npm install --save @node-sc2/core`

You must also have any maps you expect to load available in the standard location (`/Maps` relative to your SC2 directory). Official map downloads can be found [here](https://github.com/Blizzard/s2client-proto#map-packs). For a more up-to-date pack of maps, join the SC2 AI discord (https://discord.gg/Emm5Ztz) and type !maps in #general.

#### Hello World
The 'hello world' of sc2 bots seems to be a worker rush, so... here we go:
```js
// main.js
const { createAgent, createEngine, createPlayer } = require('@node-sc2/core');
const { Difficulty, Race } = require('@node-sc2/core/constants/enums');

const bot = createAgent({
    async onGameStart({ resources }) {
        const { units, actions, map } = resources.get();

        const workers = units.getWorkers();
        return actions.attackMove(workers, map.getEnemyMain().townhallPosition);
    }
});

const engine = createEngine();

engine.connect().then(() => {
    return engine.runGame('Blueshift LE', [
        createPlayer({ race: Race.RANDOM }, bot),
        createPlayer({ race: Race.RANDOM, difficulty: Difficulty.MEDIUM }),
    ]);
});
```

Now you can run it with `node main.js`. Wasn't that easy? Now this isn't going to win you any awards... but it might win you a few games against the built-in AI.

**NOTE**: The first time you run the bot, it will take up to 15 seconds to launch the SC2 client. After that, the default behavior is to keep the client running, so starting a new game will take only a moment. Also, feel free to manage the client yourself, as `node-sc2` will just use the existing instance listening on the selected port.

### Overview and Tutorial
An overview of the library and its usage is available by clicking [here](docs/overview.md). The overview is the recommended place to get started. If you want to skip it and go straight to a tutorial of a bot that can consistently win against the built-in Elite AI, click [here](docs/tutorial.md).

### Feature Layer and Rendered Interfaces
Although most of the supported features of `node-sc2` are based on the raw data interface, there *is* initial support for both the Feature Layer and the Rendered interfaces. Importantly, you must set your `NODE_ENV` to `production` if you don't want the rendered interface to crawl (unless you need long stack trace support). For example, on windows that would be: `set NODE_ENV=production`. The feature layer interface is pretty slow either way (on windows, linux should be significantly better). Currently there are no abstractions but you can get access the exposed data as such:

```js
/** @type {SC2APIProtocol.SpatialCameraSetup} */
const camera = {
    // you can experiment with various resolutions
    resolution: {
        x: 640,
        y: 480,
    },
    // you can also leave this off if you don't want the minimap to render
    minimapResolution: {
        x: 128,
        y: 128,
    }
};

// the 'interface' prop of your agent blueprint is of SC2APIProtocol.InterfaceOptions
const bot = createAgent({
    settings: {
        race: Race.PROTOSS,
    },
    interface: {
        raw: true,
        score: true, // optional, score data
        render: camera, // turns on the rendered interface
        featureLayer: camera, // turns on the feature layer interface
    },
    async onStep(world) {
        const { frame } = world.resources.get();
        console.log(frame.getRender(), frame.getFeatureLayer());
    }
});
```

The shape of the data is of types `SC2APIProtocol.ObservationRander` and `SC2APIProtocol.ObservationFeatureLayer`. More can be read about it in the blizzard proto definitions.

### Notice of Active Development
The goal of `@node-sc2/core` is to use semver. As long as `@node-sc2/core` is pre v1.0.0, the library is under very active development. It may be missing obvious features, even ones that are simple to implement. It may expose APIs that are fundimentally broken. It *may* even break backwards compatibility (although we're going to try really hard not to without major version bumps). The goal is to get to v1.0.0 rapidly and remove this notice.

### Contributing
*Any* contributions are appreciated. That includes detailed issue reports (with repro if possible), comments, concerns, API design/suggestions, and PRs. I will try to work together with everyone as much as feasible to create the best user experience possible.

### Ladder and Tournament Submission
Currently the following method is available as a stop-gap to be able to submit your `node-sc2`-based bot to a tournament or ladder (such as one using software like [`Sc2LadderServer`](https://github.com/Cryptyc/Sc2LadderServer)). 

First install `pkg`, which is what we're going to use to package up your bot: `npm install --save-dev pkg`

Then add the `bin` directive, and this npm script to your `package.json` under `scripts`:
```js
"bin": "main.js", // change main.js to your entrypoint file name, if different
...
"scripts": {
    "build": "pkg ./ --target win-x64 --out-path ./dist",
}
```

Finally, run the script: `npm run build`. Your compiled bot will be in `dist/your-bot-name.exe` and will be compatible with the CLI commands needed to run it using the ladder manager or similar software.


In the future, this will be built into `node-sc2` and be a cli command. It is on the major timeline and should be ready by v1.0.0.

### Features and Roadmap
This readme will be updated with a link to a Trello board shortly, outlining feature development roadmap progress. On top of that, github issues can be used to discuss features and bugs.

### Environmental Variables
Various settings can be adjusted through env vars in your shell. In a windows command shell, this is done with the `set` command, eg: `set DEBUG=sc2:debug:*`. 

#### Speed Control
Default is 4 frames per step. This can be adjusted with the `STEP_COUNT` env var... for example, `STEP_COUNT=8` for faster simulations.

#### Debugging
`node-sc2` makes use of the `debug` library. Run your agent with `DEBUG=sc2:debug:*` for additional helpful output, or `DEBUG=sc2:*` for way too much output that's probably not too helpful :) For extra fun, run your script with `node --inspect`, open a chrome instance, navigate to `chrome://inspect` and click on "Open dedicated DevTools for Node". Enjoy the full debugging experience (including cpu and memory profiling, pausing, breakpoints, etc).

### Getting Help
First I would encourage you to read through all available documentation. Beyond this readme, three other user documents are available:

- [Overview](docs/overview.md)
- [Tutorial](docs/tutorial.md)
- [API Reference](docs/api.md)

Beyond that, there are also two documents aimed towards those wanting to help develop the core library, or just understanding more about how it works:

- [Design](docs/design.md)
- [Internals](docs/internals.md)

Beyond the documentation, Starcraft 2 AI has a very active community, available through this discord invitation link: https://discord.gg/Emm5Ztz - This library specifically can be discussed in the #javascript channel. Come say hi!

### Changelog
The changelog has been moved to a dedicated document: [changelog.md](docs/changelog.md).





