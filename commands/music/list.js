const { MessageEmbed } = require("discord.js");
const {
    functions: { errorEmbed, log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 22,
    superior: "music",
    name: ["歌單", "list"],
    type: "music",
    expectedArgs: "",
    description: "檢視個人歌單",
    minArgs: 0,
    maxArgs: 2,
    level: null,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: ["MANAGE_MESSAGES"],
    async execute(msg, args, client, user) {
        try {
            let { author, channel } = msg;
            if (!client.musicUsers[author.id]) {
                msg.reply({
                    content: `你的歌單是空的喔～\n在播放的歌曲下反應\❤️以加入歌單`,
                    allowedMentions: setting.allowedMentions
                });
                return;
            }

            let list = client.musicUsers[author.id];
            if (args.length > 1) {
                if (["刪除", "delete", "del"].includes(args[0].toLowerCase())) {
                    let num = Number(args[1]) - 1;
                    if (isNaN(num) || num > list.length || num < 0) {
                        msg.reply({
                            content: `你的歌單只有${list.length}首喔`,
                            allowedMentions: setting.allowedMentions
                        });
                        return;
                    }
                    client.musicUsers[author.id] = client.musicUsers[author.id].filter(s => s.url != list[num].url);
                    await client.db.set("musicUsers", client.musicUsers);
                    msg.react("✅");
                } else {
                    errorEmbed(channel, author, "參數錯誤", "只接受以下3種參數: `刪除 / delete / del `");
                }
                return;
            }
            if (args.length > 0) {
                let num = Number(args[0]) - 1;
                if (num > list.length || num < 0) {
                    msg.reply({
                        content: `你的歌單只有${list.length}首喔`,
                        allowedMentions: setting.allowedMentions
                    });
                    return;
                }
                let track = list[num];
                const createMusicEmbed = (user = null, title = null, url = null, content = null, fields = null, image = null, footer = null, thumbnail = null) => {
                    let embed = new MessageEmbed()
                        .setColor(setting.embedColor.normal)
                        .setTimestamp();
                    if (user) embed.setAuthor({ name: user });
                    if (title) embed.setTitle(title);
                    if (url) embed.setURL(url);
                    if (content) embed.setDescription(content);
                    if (fields) {
                        fields.map(f => {
                            embed.addField(f.name, (f.value).toString(), f.inline || true)
                        });
                    }
                    if (image) embed.setImage(image);
                    if (footer) embed.setFooter({ text: footer });
                    if (thumbnail) embed.setThumbnail(thumbnail);
                    return embed;
                }
                msg.reply({
                    embeds: [
                        createMusicEmbed(
                            `No. ${args[0]}`,
                            track.title,
                            track.url,
                            track.description,
                            null,
                            null,
                            `views ${track.views}｜likes ${track.likes}｜duration ${track.duration}`,
                            track.thumbnail
                        )
                    ],
                    allowedMentions: setting.allowedMentions
                });
                return;
            }

            let ary = [];
            for (let i in list) {
                ary.push(`**${Number(i) + 1}**. [**${list[i].title}**](${list[i].url})`);
            }
            let currentIndex = 0;
            let max = 10;

            const createEmbed = (index) => {
                let current = ary.slice(index, index + max);
                let embed = new MessageEmbed()
                    //.setTitle(itemType)
                    .setColor(setting.embedColor.normal)
                    .setFooter({ text: "個人歌單" })
                    .setTimestamp()
                if (current) {
                    embed.setDescription(current.join("\n\n"));
                }
                return embed;
            }

            let m = await msg.reply({
                embeds: [
                    createEmbed(currentIndex)
                ],
                allowedMentions: setting.allowedMentions
            });
            if (ary.length <= max) return;
            await m.react("➡️");

            let filter = (reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && user.id === author.id
            const collector = m.createReactionCollector({
                filter: filter,
                time: 60000
            });
            collector.on("collect", async reaction => {
                await m.reactions.removeAll();
                reaction.emoji.name === "⬅️" ? currentIndex -= max : currentIndex += max
                await m.edit({
                    embeds: [
                        createEmbed(currentIndex)
                    ],
                    allowedMentions: setting.allowedMentions
                });
                if (currentIndex !== 0) await m.react("⬅️");
                if (currentIndex + max < ary.length) await m.react("➡️");
            });
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}