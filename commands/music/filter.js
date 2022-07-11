const { MessageEmbed } = require("discord.js");
const {
    functions: { errorEmbed, log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 24,
    superior: setting.superior.music,
    name: ["過濾器", "filter"],
    type: "music",
    expectedArgs: "<過濾器的名稱>",
    description: "將音樂的輸出套用過濾器",
    minArgs: 0,
    maxArgs: 1,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
            let { author, channel } = msg;
            let filters = [
                "bassboost_low",
                "bassboost",
                "bassboost_high",
                "8D",
                "vaporwave",
                "nightcore",
                "phaser",
                "tremolo",
                "vibrato",
                "reverse",
                "treble",
                "normalizer",
                "normalizer2",
                "surrounding",
                "pulsator",
                "subboost",
                "karaoke",
                "flanger",
                "gate",
                "haas",
                "mcompand",
                "mono",
                "mstlr",
                "mstrr",
                "compressor",
                "expander",
                "softlimiter",
                "chorus",
                "chorus2d",
                "chorus3d",
                "fadein",
                "dim",
                "earrape",
            ]
            if (!args[0] || (args.length == 1 && !filters.includes(args[0]))) {
                errorEmbed(channel, author, "參數錯誤", "請輸入以下任一種過濾器:\n" + filters.join("\n"));
                return;
            }
            await client.music.filter(msg, args[0]);
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}