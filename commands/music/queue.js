const {
    functions: { log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 17,
    superior: setting.superior.music,
    name: ["隊列", "queue", "now"],
    type: "music",
    expectedArgs: "",
    description: "現正播放的列表",
    minArgs: 0,
    maxArgs: 0,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
            await client.music.queue(msg);
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}