const {
    functions: { log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 13,
    superior: setting.superior.music,
    name: ["加入", "join"],
    type: "music",
    expectedArgs: "",
    description: "加入所在語音頻道",
    minArgs: 0,
    maxArgs: 0,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: ["CONNECT"],
    async execute(msg, args, client, user) {
        try {
            let res = await client.music.join(msg);
            if (res) {
                msg.react("✅");
            }
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}