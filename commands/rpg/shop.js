const { MessageEmbed } = require("discord.js");
const {
    functions: { errorEmbed, getShop, log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

/* 雲端商店
*/
module.exports = {
    num: 7,
    name: ["商店", "shop", "sh"],
    type: "rpg",
    expectedArgs: "",
    description: "雲端商店",
    minArgs: 0,
    maxArgs: 1,
    level: 1,
    cooldown: 5,
    requireItems: [],
    requireBotPermissions: ["MANAGE_MESSAGES"],
    async execute(msg, args, client, user) {
        try {
            await msg.react("✅");

            if (!user) {
                msg.reply({
                    content: `您還沒有帳戶喔`,
                    allowedMentions: setting.allowedMentions
                });
                return;
            }

            const { author, channel } = msg;
            // 若無指定，為預設雲端商店  
            const numToEmo = [
                "1️⃣",
                "2️⃣",
                "3️⃣",
                "4️⃣",
                "5️⃣",
                "6️⃣",
                "7️⃣"
            ];

            if (args[0]) {

            } else {
                let shopData = getShop();
                let list = [];
                let data = [];
                let select = false;
                let itemType = null;
                let currentIndex = 0;
                let max = 10;


                const filter = (reaction, user) => {
                    if (user.id === msg.author.id) {
                        let cases = {
                            "1️⃣": 0,
                            "2️⃣": 1,
                            "3️⃣": 2,
                            "4️⃣": 3,
                            "5️⃣": 4,
                            "6️⃣": 5,
                            "7️⃣": 6,
                        }
                        if (typeof cases[reaction.emoji.name] !== "undefined") {
                            let sh = setting.shop[cases[reaction.emoji.name]];
                            let t = Object.keys(sh)[0];
                            itemType = Object.values(sh)[0];
                            for (let i in shopData[t]) {
                                if (shopData[t][i].type === t) {
                                    data.push({
                                        name: i,
                                        price: shopData[t][i].forSale
                                    });
                                }
                            }
                            select = true;
                            return true;
                        }
                    }
                    return false;
                }

                const createEmbed = (index) => {
                    let current = data.slice(index, index + max);
                    let embed = new MessageEmbed()
                        .setTitle(itemType)
                        .setColor(setting.embedColor.normal)
                        .setFooter({ text: "帝國雲端商店" })
                        .setTimestamp();
                    if (current.length > 0) {
                        current.map(d => {
                            embed.addField(`${d.name}`, `$ ${d.price} ${setting.coinName}`, true)
                        });
                    } else {
                        embed.setDescription("暫無商品");
                    }
                    return embed;
                }

                for (let i in setting.shop) {
                    list[i] = {
                        name: Object.values(setting.shop[i])[0],
                        value: numToEmo[i],
                        inline: true
                    };
                }

                let m = await msg.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("帝國雲端商店")
                            .setColor(setting.embedColor.normal)
                            .addFields(list)
                            .setFooter({
                                text: "此訊息將在2分鐘後失效"
                            })
                            .setTimestamp()
                    ],
                    allowedMentions: setting.allowedMentions
                });

                for (let i in numToEmo)
                    await m.react(numToEmo[i]);


                await m.awaitReactions({
                    filter: filter,
                    max: 1,
                    time: 120000,
                    errors: ["time"]
                }).catch(err => { });

                if (!select) return;

                await m.edit({
                    embeds: [
                        createEmbed(currentIndex)
                    ],
                    allowedMentions: setting.allowedMentions
                });

                if (data.length <= max) return
                m.react("➡️");

                filter = (reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && user.id === msg.author.id;
                const collector = m.createReactionCollector({
                    filter: filter,
                    time: 60000
                });

                collector.on("collect", async reaction => {
                    await m.reactions.removeAll();
                    reaction.emoji.name === "⬅️" ? currentIndex -= max : currentIndex += max
                    await m.edit(createEmbed(currentIndex));
                    if (currentIndex !== 0) await m.react("⬅️");
                    if (currentIndex + max < data.length) await m.react("➡️");
                });
            }
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}