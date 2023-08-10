const {
    functions: { log },
    Recorder
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 25,
    name: ["紀錄", "record", "rec"],
    type: "admin",
    expectedArgs: "<channel id> <user id>",
    description: "開始記錄語音頻道的音訊",
    minArgs: 1,
    maxArgs: 2,
    level: null,
    cooldown: null,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
            if (args.length == 2) {
                await msg.react("✅");
                let channelId = args[0];
                let channel = msg.guild.channels.cache.get(channelId);
                if (!channel) return;
                let userId = args[1];
                let member = msg.guild.members.cache.get(userId);
                if (!member) return;
                Recorder.start(msg, channel, userId);
            } else if (args.length == 1) {
                await msg.react("✅");
                let channelId = args[0];
                let channel = msg.guild.channels.cache.get(channelId);
                if (!channel) return;
                Recorder.end(msg, channel);
            }
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}