const fl = "./data/";
const maps = require(fl + "maps.js");
const classes = require(fl + "classes.js");
const player = require(fl + "player.js");
const gameInfo = require(fl + "gameInfo.js");
const creatures = require(fl + "creatures.js");
module.exports = {
    Maps: maps,
    Status: {},
    Classes: classes,
	Player: player,
	GameInfo: gameInfo,
	Creatures: creatures,
	UUID_PREFIX: {
		Maps: "MAPS_",
	    Status: "STATUS_",
	    Attribute: "ATTRIBUTE_",
	    Classes: "CLASSES_",
		Player: "PLAYER_",
		GameInfo: "GAMEINFO_",
	}
};