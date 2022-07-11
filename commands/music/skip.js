const {
    functions: { log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 19,
    superior: setting.superior.music,
    name: ["跳過", "skip", "sk"],
    type: "music",
    expectedArgs: "",
    description: "跳過正在播放的歌曲",
    minArgs: 0,
    maxArgs: 0,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
            await client.music.skip(msg);
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}