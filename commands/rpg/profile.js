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
  name: ["面板", "profile", "p"],
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
						轉換率 － ${(user.level*(user.stat.HEA/user.stat.tHEA)).toFixed(3)}%
				    ${setting.xpName} － ${user.xp} / ${user.reqxp}`;
						

        let body = `
					⨢血⨢ - ${user.stat.HEA} / ${user.stat.tHEA}
			    ⨢靈⨢ - ${user.stat.SOR} / ${user.stat.tSOR}
			    ⨢勢⨢ - ${user.stat.STR} / ${user.stat.tVEL}
			    ⨢體⨢ - ${user.stat.VIT} / ${user.stat.tVEL}
			    ⨢睿⨢ - ${user.stat.INT} / ${user.stat.tVEL}
					⨢迅⨢ - ${user.stat.VEL} / ${user.stat.tVEL}
			
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
				if(embed) {
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
					if(embed) {
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