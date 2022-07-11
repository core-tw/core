const {
    functions: { errorEmbed, log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 21,
    superior: setting.superior.music,
    name: ["音量", "volume", "vol"],
    type: "music",
    expectedArgs: "<音量 0% ~ 100%>",
    description: "跳過正在播放的歌曲",
    minArgs: 1,
    maxArgs: 1,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
            let { author, channel } = msg;
            let vol = Number(args[0]);
            if (isNaN(vol) || vol < 0 || vol > 100) {
                errorEmbed(channel, author, "參數錯誤", "音量只能介於 0 ~ 100");
                return;
            }
            await client.music.volume(msg, vol);
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}