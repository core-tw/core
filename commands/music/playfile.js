const {
    functions: { log }
} = require("../../lib/index.js");
const setting = require("../../config/setting.json");
const config = require("./../../config.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const path = require("path");

module.exports = {
    num: 30,
    superior: setting.superior.music,
    name: ["播放檔案歌曲", "播放檔案", "playfile", "plf"],
    type: "music",
    expectedArgs: "<檔案位置>",
    description: "播放歌曲",
    minArgs: 1,
    maxArgs: null,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: ["SPEAK"],
    async execute(msg, args, client, user) {
        try {

            const {
                author,
                guild,
                member
            } = msg;

            if(!member.voice.channel) return;

            if(!config["admin_id"].includes(author.id)) return;

            const connection = joinVoiceChannel({
                channelId: member.voice.channel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
            
            connection.subscribe(player);

            let singing = true;

            player.on("idle", () => {
                if(singing) player.play(createAudioResource(path.join(__dirname, "../../Music/", args.join(" "))));
            });

            player.play(createAudioResource(path.join(__dirname, "../../Music/", args.join(" "))));

            setTimeout(() => {
                singing = false;
            }, 10000);
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}