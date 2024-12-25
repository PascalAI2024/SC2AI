"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alliance = exports.PlayerType = exports.Difficulty = exports.Race = void 0;
// Match SC2APIProtocol.Race values
var Race;
(function (Race) {
    Race[Race["NoRace"] = 0] = "NoRace";
    Race[Race["Terran"] = 1] = "Terran";
    Race[Race["Zerg"] = 2] = "Zerg";
    Race[Race["Protoss"] = 3] = "Protoss";
    Race[Race["Random"] = 4] = "Random";
})(Race || (exports.Race = Race = {}));
// Match SC2APIProtocol.Difficulty values
var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["VeryEasy"] = 1] = "VeryEasy";
    Difficulty[Difficulty["Easy"] = 2] = "Easy";
    Difficulty[Difficulty["Medium"] = 3] = "Medium";
    Difficulty[Difficulty["MediumHard"] = 4] = "MediumHard";
    Difficulty[Difficulty["Hard"] = 5] = "Hard";
    Difficulty[Difficulty["Harder"] = 6] = "Harder";
    Difficulty[Difficulty["VeryHard"] = 7] = "VeryHard";
    Difficulty[Difficulty["CheatVision"] = 8] = "CheatVision";
    Difficulty[Difficulty["CheatMoney"] = 9] = "CheatMoney";
    Difficulty[Difficulty["CheatInsane"] = 10] = "CheatInsane";
})(Difficulty || (exports.Difficulty = Difficulty = {}));
// Match SC2APIProtocol.PlayerType values
var PlayerType;
(function (PlayerType) {
    PlayerType[PlayerType["Participant"] = 1] = "Participant";
    PlayerType[PlayerType["Computer"] = 2] = "Computer";
    PlayerType[PlayerType["Observer"] = 3] = "Observer";
})(PlayerType || (exports.PlayerType = PlayerType = {}));
// Match SC2APIProtocol.Alliance values
var Alliance;
(function (Alliance) {
    Alliance[Alliance["Self"] = 1] = "Self";
    Alliance[Alliance["Ally"] = 2] = "Ally";
    Alliance[Alliance["Enemy"] = 3] = "Enemy";
    Alliance[Alliance["Neutral"] = 4] = "Neutral";
})(Alliance || (exports.Alliance = Alliance = {}));
//# sourceMappingURL=enums.js.map