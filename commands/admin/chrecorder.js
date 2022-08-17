const {
    functions: { log },
	chRecorder
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 26,
    name: ["頻道紀錄", "chrecord", "chrec"],
    type: "admin",
    expectedArgs: "<channel id> <start / end>",
    description: "開始記錄語音頻道的音訊",
    minArgs: 2,
    maxArgs: 2,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
			if(args[1] == "start") {
				await msg.react("✅");
				let channelId = args[0];
				let channel = msg.guild.channels.cache.get(channelId);
				if(!channel) return;
				chRecorder.start(client, msg, channel);
			} else if(args[1] == "end") {
				await msg.react("✅");
				let channelId = args[0];
				let channel = msg.guild.channels.cache.get(channelId);
				if(!channel) return;
				chRecorder.end(client, msg, channel);
			}
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}