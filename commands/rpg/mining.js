const { MessageEmbed } = require("discord.js");
const {
	database: { addItems },
	Enum: { Maps },
	functions: { errorEmbed, log, random, wait, generate, getAreaByUUID },
	models: { Items }
} = require("./../../lib/index.js");
const { items: { UUID : itemUUID } } = require("./../../objects/index.js");
const setting = require("./../../config/setting.json");
const chance = new require("chance")();

/* 採集指令
	找到礦物=>延遲3秒
	找不到=>5秒後回應
*/
module.exports = {
  num: 9,
  name: ["挖礦", "mining", "m"],
  type: "rpg",
  expectedArgs: "",
  description: "挖掘所在區域的礦物！",
  minArgs: 0,
  maxArgs: 0,
  level: 1,
  cooldown: 180,
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
      const createEmbed = (title, content = "") => {
        let embed = new MessageEmbed()
          .setTitle(title)
          .setColor(setting.embedColor.normal)
					.setDescription(content)
          .setFooter({
            text: author.tag
          })
          .setTimestamp();
        return embed;
      }

      // 先取得玩家位置
      let a = getAreaByUUID(user.area);
      if (!a) {
        errorEmbed(channel, author, null, setting.error.no);
        return;
      }

			let minerals = Maps["planet"][a[0]]["area"][a[1]]["minerals"];

      // 無礦物
      if (!minerals) {
        msg.reply({
          embeds: [
            createEmbed(`${a[1]}似乎沒有出產任何礦物呢......`)
          ],
          allowedMentions: setting.allowedMentions
        });
        return;
      }

      // 有機率找不到礦物
      let rateToAppear = Maps["planet"][a[0]]["area"][a[1]]["mineralRate"] || 0;
      if (!chance.bool({ likelihood: rateToAppear })) {
        await wait(5000);
        msg.reply({
          embeds: [
            createEmbed(`沒有發現到任何東西呢......`)
          ],
          allowedMentions: setting.allowedMentions
        });
        return;
      }

      // 隨機礦物
      let mineralsKey = Object.keys(minerals);
      let mineralName = mineralsKey[random(mineralsKey.length)];
      let mineral = minerals[mineralName];

      // 有機會失敗
      if (!chance.bool({ likelihood: mineral["rate"] })) {
        await wait(4000);
        msg.reply({
          embeds: [
            createEmbed(`沒有發現到任何東西呢......`)
          ],
          allowedMentions: setting.allowedMentions
        });
        return;
      }

      await wait(3000);

			// 預存UUID
			let UUID = itemUUID + mineral.data.UUID;
			let num = Math.floor(((user.level/2) + (Math.random() * (user.level/2))) * mineral["rate"] / 100) + 1;
			await addItems(user, UUID, num);
			msg.reply({
        embeds: [
          createEmbed(`恭喜你挖到了**${mineralName}**`, `數量 － ${num}`)
        ],
        allowedMentions: setting.allowedMentions
      });
			user.save();
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}