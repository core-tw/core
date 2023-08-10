const { MessageEmbed } = require("discord.js");
const {
    database: { loadUser },
    Enum: { Player: { typesList } },
    functions: { errorEmbed, getAreaByUUID, log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

/* 個人面板
*/
module.exports = {
    num: 2,
    name: ["面板", "profile", "pf"],
    type: "rpg",
    expectedArgs: "<@user (可無)>",
    description: "個人面板",
    minArgs: 0,
    maxArgs: 1,
    level: 1,
    cooldown: 3,
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

            const createEmbed = (user, icon) => {
                let a = getAreaByUUID(user.area);
                if (!a) {
                    errorEmbed(channel, author, null, setting.error.no);
                    return null;
                }
                let info =
                    `**所在區域 -\\ ${a[0]} ${a[1]} \\ **
						職業 － ${typesList[user.type]}
				        等級 － ${user.level}
						轉換率 － ${(user.level * (user.act.HEA / user.stat.HEA)).toFixed(3)}%
				        ${setting.xpName} － ${user.xp} / ${user.reqxp}`;


                let body = `
					⨢血⨢ - ${user.act.HEA} / ${user.stat.HEA}
                    ⨢靈⨢ - ${user.act.SOR} / ${user.stat.SOR}
                    ⨢勢⨢ - ${user.act.STR} / ${user.stat.VEL}
                    ⨢體⨢ - ${user.act.VIT} / ${user.stat.VEL}
                    ⨢睿⨢ - ${user.act.INT} / ${user.stat.VEL}
					⨢迅⨢ - ${user.act.VEL} / ${user.stat.VEL}
			
			      	**${setting.coinName}** - ${user.coin}`;
                let embed = new MessageEmbed()
                    .setColor(setting.embedColor.normal)
                    .setAuthor({
                        name: user.name,
                        iconURL: icon
                    })
                    .setDescription(info)
                    //.setThumbnail(icon)
                    .addFields([
                        {
                            name: "狀態欄",
                            value: body,
                            inline: true
                        },
                        {
                            name: "裝備欄",
                            value: `
			            	武裝 - ${user.armor === "null" ? "無" : user.armor}
			           		武器 - ${user.weapon === "null" ? "無" : user.weapon}
			            	`,
                            inline: true
                        }
                    ])
                    .setTimestamp();
                return embed;
            }

            const mention_user = msg.mentions.users.first();
            if (mention_user) {
                const another_user = await loadUser(mention_user.id);
                if (!another_user) {
                    msg.reply({
                        content: setting.error.notFindUser,
                        allowedMentions: setting.allowedMentions
                    });
                }
                let icon = mention_user.displayAvatarURL();
                let embed = createEmbed(another_user, icon);
                if (embed) {
                    msg.reply({
                        embeds: [
                            embed
                        ],
                        allowedMentions: setting.allowedMentions
                    });
                }

            } else {
                if (args[0]) {
                    const another_user = await loadUser(args[0]);
                    if (!another_user) {
                        msg.reply({
                            content: setting.error.notFindUser,
                            allowedMentions: setting.allowedMentions
                        });
                        return;
                    }
                    let icon = mention_user.displayAvatarURL();
                    msg.reply({
                        embeds: [
                            createEmbed(another_user, icon)
                        ],
                        allowedMentions: setting.allowedMentions
                    });
                } else if (user) {
                    let icon = author.displayAvatarURL();
                    let embed = createEmbed(user, icon);
                    if (embed) {
                        msg.reply({
                            embeds: [
                                embed
                            ],
                            allowedMentions: setting.allowedMentions
                        });
                    }
                    return;
                } else {
                    msg.reply({
                        content: setting.error.notFindUser,
                        allowedMentions: setting.allowedMentions
                    });
                }
            }
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}
