const path = require("path");
require('dotenv').config({ path: path.join(__dirname, "./.env") });

var config = {};

config["admin_id"] = ["823885929830940682"];

config["console_prefix"] = "|- ";

config["port"] = process.env.port || 3000;

config["system_time"] = "系統時間";

config["host"] = "https://core.coretw.repl.co/";

config["token"] = process.env.token;

config["YOUTUBE_COOKIE"] = process.env.YOUTUBE_COOKIE;
config["logChannel"] = process.env.logChannel;
config["mongoPath"] = process.env.mongoPath;

module.exports = config;