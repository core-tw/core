const {
    functions: { log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 18,
    superior: setting.superior.music,
    name: ["恢復", "resume", "rs"],
    type: "music",
    expectedArgs: "",
    description: "繼續播放歌曲",
    minArgs: 0,
    maxArgs: 0,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
            await client.music.resume(msg);
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}