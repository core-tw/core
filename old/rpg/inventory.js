const { MessageEmbed } = require('discord.js');
const { Items } = require('./../../_models_.js');
const { errorEmbed, findObjByUUID, log } = require('./../../_functions_.js');
const config = require('./../../config.json');

/* 個人物品欄
*/
module.exports = {
  num: 6,
  name: ['背包', 'inventory', 'i'],
  type: "rpg",
  expectedArgs: '',
  description: '個人物品欄',
  minArgs: 0,
  maxArgs: 0,
  level: 1,
  cooldown: 3,
  requireItems: [],
  requireBotPermissions: ["MANAGE_MESSAGES"],
  async execute(msg, args, client, user) {
    try {
      await msg.react('✅');

      if (!user) {
        msg.reply({
          content: `您還沒有帳戶喔`,
          allowedMentions: config.allowedMentions
        });
        return;
      }

      const { author, channel } = msg;
      let list = [];
      let currentIndex = 0;
      let max = 10;

      for (let i in user.items) {
        let item = await Items.findOne({ _id: user.items[i] });
        if (!item) {
          errorEmbed(channel, author, null, config.error.no);
          return;
        }
        if (item.amount > 0) {
          // 分解UUID
          let name = findObjByUUID(item.itemId);
          if (!name) {
            errorEmbed(channel, author, null, config.error.no);
            return;
          }

          list.push({
            name: name,
            amount: item.amount
          });
        }
      }

      const createEmbed = (index) => {
        let current = list.slice(index, index + max);
        let embed = new MessageEmbed()
          .setTitle('Inventory')
          .setColor(config.embedColor.normal)
          .setFooter({ text: author.tag })
          .setTimestamp();
        current.map(d => {
          embed.addField(`${d.name}`, `－${d.amount}`, true)
        });
        return embed;
      }


      let m = await msg.reply({
        embeds: [
          createEmbed(currentIndex)
        ],
        allowedMentions: config.allowedMentions
      });
      if (list.length <= max) return
      m.react('➡️');
      const collector = m.createReactionCollector(
        (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === msg.author.id,
        { time: 60000 }
      );
      collector.on('collect', async reaction => {
        await m.reactions.removeAll();
        reaction.emoji.name === '⬅️' ? currentIndex -= 1 : currentIndex += 1
        await m.edit(createEmbed(currentIndex));
        if (currentIndex !== 0) await m.react('⬅️');
        if (currentIndex + 1 < list.length) await m.react('➡️');
      });
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}