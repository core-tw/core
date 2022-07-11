const {
    functions: { log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 15,
    superior: setting.superior.music,
    name: ["暫停", "pause", "pa"],
    type: "music",
    expectedArgs: "",
    description: "暫停播放",
    minArgs: 0,
    maxArgs: 0,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
            await client.music.pause(msg);
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}