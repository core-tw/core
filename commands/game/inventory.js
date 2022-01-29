const Discord = require('discord.js');
const { Weapons, Objects, findName, config } = require('./../../_data_.js');
const { loadUser } = require('./../../_database_.js');
const { User, Item } = require('./../../_model_.js');
module.exports = {
  num: 4,
  name: ['背包', 'inventory', 'i'],
  type: 'game',
  expectedArgs: '<@對象 or id (不強制)>',
  description: '個人的空間背包，是帝國公民的標配物件',
  minArgs: 0,
  maxArgs: 1,
  level: null,
  cooldown: 5,
  requireObject: ['公民證'],
  requirePermission: [],
  async execute(msg, args, user) {
    msg.react('✅');
    const mention_user = msg.mentions.users.first();
    if (mention_user) {
      const another_user = await loadUser(mention_user.id, User);
      if (!another_user) return msg.lineReply(config.notFindUser);
      let icon = mention_user.displayAvatarURL();
      msg.channel.send(await generateEmbed(another_user, icon));
    } else {
      if (args[0]) {
        const another_user = await loadUser(args[0], User);
        if (!another_user) return msg.lineReply(config.notFindUser);
        let icon = mention_user.displayAvatarURL();
        msg.channel.send(await generateEmbed(another_user, icon));
      } else if (user) {
        let icon = msg.author.displayAvatarURL();
        msg.channel.send(await generateEmbed(user, icon));
        return;
      } else {
        msg.lineReply(config.notFindUser);
      }
    }
    async function generateEmbed(user, icon) {
      let embed = new Discord.MessageEmbed()
        .setColor(config.embed_color)
        .setAuthor(`${user.name}`, icon)
        //.setDescription(``)
        .setThumbnail(icon)
        .setTimestamp();

      let things = await Item.find({
        owmer: user._id,
      });
      let ob_str = 'x';
      let w_str = 'x';
      for (let i in things) {
        if (things[i].amount > 0) {
          if (things[i].itemId.startsWith('ob')) {
            (ob_str == 'x')?ob_str="":ob_str
            ob_str += `${findName(Objects, things[i].itemId)} - ${things[i].amount}\n`
          } else if(things[i].itemId.startsWith('w')) {
            (w_str == 'x')?w_str="":w_str,
            w_str += `| **${findName(Weapons, things[i].itemId)}**\n`
          }
        }
      }
      embed.addField(`物品欄`, ob_str, true);
      embed.addField(`武裝列表`, w_str, true);

      return embed;
    }
  }
}