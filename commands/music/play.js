const {
    functions: { log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 16,
    superior: setting.superior.music,
    name: ["播放歌曲", "播放", "play", "pl"],
    type: "music",
    expectedArgs: "<歌曲關鍵字 / 連結>",
    description: "播放歌曲",
    minArgs: 1,
    maxArgs: null,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: ["SPEAK"],
    async execute(msg, args, client, user) {
        try {
            await client.music.play(msg, args.join(" "));
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}