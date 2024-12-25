// Match SC2APIProtocol.Race values
export enum Race {
    NoRace = 0,
    Terran = 1,
    Zerg = 2,
    Protoss = 3,
    Random = 4
}

// Match SC2APIProtocol.Difficulty values
export enum Difficulty {
    VeryEasy = 1,
    Easy = 2,
    Medium = 3,
    MediumHard = 4,
    Hard = 5,
    Harder = 6,
    VeryHard = 7,
    CheatVision = 8,
    CheatMoney = 9,
    CheatInsane = 10
}

// Match SC2APIProtocol.PlayerType values
export enum PlayerType {
    Participant = 1,
    Computer = 2,
    Observer = 3
}

// Match SC2APIProtocol.Alliance values
export enum Alliance {
    Self = 1,
    Ally = 2,
    Enemy = 3,
    Neutral = 4
}
