const {
    functions: { log },
    Recorder
} = require("../../lib/index.js");
const setting = require("../../config/setting.json");

module.exports = {
    num: 29,
    name: ["播放紀錄", "playrecord", "prec"],
    type: "admin",
    expectedArgs: "",
    description: "播放記錄下來的語音音訊",
    minArgs: null,
    maxArgs: null,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
            await msg.react("✅");
            if (!msg.member.voice.channelId) {
                msg.reply({
                    content: setting.music.askChannel,
                    allowedMentions: setting.allowedMentions
                });
                return;
            }
            if (
                msg.guild.me.voice.channelId &&
                msg.guild.me.voice.channelId != msg.member.voice.channelId
            ) {
                msg.reply({
                    content: setting.music.otherChannel,
                    allowedMentions: setting.allowedMentions
                });
                return;
            }
            if (!msg.reference) {
                msg.reply({
                    content: setting.record.noReference,
                    allowedMentions: setting.allowedMentions
                });
                return;
            }
            Recorder.play(msg);

        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}