const fl = "./enums/";
const maps = require(fl + "maps.js");
const attribute = require(fl + "attribute.js");
const classes = require(fl + "classes.js");
const player = require(fl + "player.js");
const gameInfo = require(fl + "gameInfo.js");
module.exports = {
    Maps: maps,
    Status: {},
    Attribute: attribute,
    Classes: classes,
	Player: player,
	GameInfo: gameInfo,
	UUID_PREFIX: {
		Maps: "MAPS_",
	    Status: "STATUS_",
	    Attribute: "ATTRIBUTE_",
	    Classes: "CLASSES_",
		Player: "PLAYER_",
		GameInfo: "GAMEINFO_",
	}
};