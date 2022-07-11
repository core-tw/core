const { MessageEmbed } = require("discord.js");
const {
    database: { upgrade },
    Enum: { Player },
    functions: { errorEmbed, getUpgNeed, log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

// 升級的面板
module.exports = {
    num: 5,
    name: ["升級", "upgrade", "upg"],
    type: "rpg",
    expectedArgs: "",
    description: "查看升級所需的晶玉和材料",
    minArgs: 0,
    maxArgs: 0,
    level: 1,
    cooldown: 10,
    requireItems: [],
    requireBotPermissions: [],
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
            const createEmbed = (title, content = null, field = null, footer = null) => {
                let embed = new MessageEmbed()
                    .setTitle(title)
                    .setColor(setting.embedColor.normal)
                    .setTimestamp();

                if (content) embed.setDescription(content);
                if (footer) embed.setFooter({ text: footer });
                if (field) {
                    for (let i in field) {
                        embed.addField(field[i].name, field[i].value);
                    }
                }
                return embed;
            }

            let content = "";
            let n = Math.floor(user.level / 10) + 1;
            let bigUpgrade = true;
            let userClasses = Player.classes.list[n];
            let needs = "\n";
            let coinNeed = getUpgNeed(user.level);

            if (!user.level.toString().endsWith("9")) {
                bigUpgrade = false;
                content = `\n\n**Lv. ${user.level}**  ➠  **Lv. ${user.level + 1}**\n所需：${coinNeed} 晶玉`;
            }

            for (let i in Player.classes.need[userClasses]) {
                needs += `${i} * ${Player.classes.need[userClasses][i].amount}\n\n`
            }

            msg.reply({
                embeds: [
                    createEmbed("升級面板", content, [{
                        name: `${userClasses} 所需素材`,
                        value: needs
                    }], "🔥 升級｜💥升階")
                ],
                allowedMentions: setting.allowedMentions
            }).then(async m => {
                if (!bigUpgrade) {
                    await m.react("🔥");
                }
                await m.react("💥");

                const filter = (reaction, mUser) => {
                    if (mUser.id === msg.author.id) {
                        // 處理消耗
                        if (reaction.emoji.name == "🔥" && !bigUpgrade) {
                            if (user.coin >= coinNeed) {
                                user.coin -= coinNeed;
                                upgrade(user);
                                createEmbed(
                                    "++ level up ++",
                                    `${user.level - 1} to ${user.level}`,
                                    null,
                                    author.tag)
                                return true;
                            } else {
                                errorEmbed(channel, author, null, `您沒有那麼多${setting.coinName}喔`);
                            }
                        }
                        if (reaction.emoji.name == "💥") {
                            if (user.coin >= coinNeed) {
                                user.coin -= coinNeed;
                                upgrade(user);
                                return true;
                            } else {
                                errorEmbed(channel, author, null, `您沒有那麼多${setting.coinName}喔`);
                            }
                        }
                    }
                    return false;
                }
                await m.awaitReactions({
                    filter: filter,
                    max: 1,
                    time: 120000,
                    errors: ["time"]
                }).catch(err => { });
                user.save();
            })
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}