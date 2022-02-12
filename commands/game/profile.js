const Discord = require('discord.js');
const { Weapons, config, map } = require('./../../_data_.js');
const { loadUser } = require('./../../_database_.js');
module.exports = {
  num: 3,
  name: ['面板', 'profile', 'p'],
  type: 'game',
  expectedArgs: '<@對象 or id (不強制)>',
  description: '被用來查看個人數據的特殊面板，是帝國公民的標配物件',
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
      const another_user = await loadUser(mention_user.id);
      if (!another_user) return msg.lineReply(config.notFindUser);
      let icon = mention_user.displayAvatarURL();
      msg.channel.send(generateEmbed(another_user, icon));
    } else {
      if (args[0]) {
        const another_user = await loadUser(args[0]);
        if (!another_user) return msg.lineReply(config.notFindUser);
        let icon = mention_user.displayAvatarURL();
        msg.channel.send(generateEmbed(another_user, icon));
      } else if (user) {
        let icon = msg.author.displayAvatarURL();
        msg.channel.send(generateEmbed(user, icon));
        return;
      } else {
        msg.lineReply(config.notFindUser);
      }
    }
    function generateEmbed(user, icon) {
      let level = `
      等級 | ${user.level}
      經驗 | ${user.xp} / ${user.reqxp}
      `;

      let body = `
      血量 :drop_of_blood: | ${user.hp} / ${user.thp}
      能量 ⚡️ | ${user.mp} / ${user.tmp}
      攻擊 :crossed_swords: | ${user.atk}
      防禦 :shield: | ${user.def}
      速度 👟 | ${user.speed}
      **${config.money}** - ${user.coin}`;

      let money = `
      **虛空能量** :cyclone: - ${user.mp} / ${user.tmp}
      **${config.money}** - ${user.coin}`;

      let weapon = `
      ➤ ${Weapons[user.weapon]['描述']}
      攻速 - ${Weapons[user.weapon]['攻速']}
      攻擊加成 - ${Weapons[user.weapon]['攻擊加成']} %
      防禦加成 - ${Weapons[user.weapon]['防禦加成']} %
      移動加成 - ${Weapons[user.weapon]['移動加成']} %`;

      let embed = new Discord.MessageEmbed()
        .setColor(config.embed_color)
        .setAuthor(`${user.name}`, icon)
        //.setDescription(``)
        .setThumbnail(icon)
        .addFields([
          {
            name: `所在區域 -\\ **${map[user.area]['名稱']}** \\`,
            value: level,
            inline: false
          },
          {
            name: "狀態欄",
            value: body,
            inline: true
          },
          {
            name: "財產",
            value: money,
            inline: true
          },
          {
            name: `武裝 -\\ **${user.weapon}** \\`,
            value: weapon,
            inline: false
          }
        ])
        .setTimestamp();

      // embed.setTitle(``)
      return embed;
    }
  }
}