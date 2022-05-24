const fs = require("fs");

const database = {};
const database_path = "./database/";
database.addItems = require(database_path + "addItems.js");
database.connect = require(database_path + "connect.js");
database.dead = require(database_path + "dead.js");
database.getItems = require(database_path + "getItems.js");
database.loadUser = require(database_path + "loadUser.js");
database.upgrade = require(database_path + "upgrade.js");
module.exports.database = database;

const models = {};
const models_path = "./models/";
models.Users = require(models_path + "User.js");
models.Items = require(models_path + "Item.js");
models.Banks = require(models_path + "Bank.js");

const functions = {};
const functions_path = "./functions/";
functions.errorEmbed = require(functions_path + "errorEmbed.js");
functions.findAreaByUUID = require(functions_path + "findAreaByUUID.js");
functions.findObjByUUID = require(functions_path + "findObjByUUID.js");
functions.generate = require(functions_path + "generate.js");
functions.getAreaByUUID = require(functions_path + "getAreaByUUID.js");
functions.getShop = require(functions_path + "getShop.js");
functions.getUpgNeed = require(functions_path + "getUpgNeed.js");
functions.log = require(functions_path + "log.js");
functions.random = require(functions_path + "random.js");
functions.wait = require(functions_path + "wait.js");

const Enum = {};
const Enum_path = "./enum/";
Enum.Maps = require(Enum_path + "maps.js");
Enum.Status = {};
Enum.Classes = require(Enum_path + "classes.js");
Enum.Player = require(Enum_path + "player.js");
Enum.GameData = require(Enum_path + "gameData.js");
Enum.Creatures = require(Enum_path + "creatures.js");
Enum.Reactions = require(Enum_path + "reaction.js");
Enum.UUID_PREFIX = require(Enum_path + "UUID_PREFIX.js");

module.exports.Enum = Enum;
module.exports.functions = functions;
module.exports.models = models;