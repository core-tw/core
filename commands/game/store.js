const Discord = require('discord.js');
const { Weapons, Objects, config, map } = require('./../../_data_.js');
module.exports = {
  num: 6,
  name: ['商店', 'store', 'shop'],
  type: 'game',
  expectedArgs: '',
  description: '各個星球當地的商店',
  minArgs: 0,
  maxArgs: 0,
  level: 1,
  cooldown: 5,
  requireObject: ['公民證'],
  requirePermission: ['MANAGE_MESSAGES'],
  async execute(msg, args, user) {
    msg.react('✅');
    if (!user) return msg.lineReply(config.notFindUser);

    let mainEmbed = new Discord.MessageEmbed()
      .setTitle('歡迎光臨本商店')
      .setColor(config.embed_color)
      .setDescription(`
    想要查看一般商品，請點擊🇦

    想要查看武裝，請點擊🇧`)
      .setFooter(`${map[user.area]["名稱"]}`)
      .setTimestamp();

    var datas = [];
    var store_type = null;

    msg.channel.send(mainEmbed).then(async (m) => {
      await m.react('🇦');
      await m.react('🇧');
      const collector = m.createReactionCollector(
        (reaction, user) => ['🇦', '🇧'].includes(reaction.emoji.name) && user.id === msg.author.id,
        { time: 60000 }
      );
      let currentIndex = 0
      let locked = false;
      collector.on('collect', async reaction => {
        await m.reactions.removeAll();
        if(locked) return;
        if (reaction.emoji.name === '🇦') {
          store_type = "一般商品";
          for (let ob in Objects) {
            datas.push({
              name: ob,
              description: Objects[ob]['描述'],
              price: Objects[ob].cost
            });
          }
        } else if (reaction.emoji.name === '🇧') {
          store_type = "武裝";
          for (let w in Weapons) {
            datas.push({
              name: w,
              description: Weapons[w]['描述'],
              price: Weapons[w].cost
            });
          }
        }
        await m.edit(creatembed(currentIndex));
        m.react('➡️');
        const collector2 = m.createReactionCollector(
          (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === msg.author.id,
          { time: 60000 }
        );
        let currentIndex2 = 0;
        collector2.on('collect', async reaction => {
          await m.reactions.removeAll();
          reaction.emoji.name === '⬅️' ? currentIndex2 -= 1 : currentIndex2 += 1
          await m.edit(creatembed(currentIndex2));
          if (currentIndex2 !== 0) await m.react('⬅️');
          if (currentIndex2 + 1 < datas.length) await m.react('➡️');
        });
      });
    });

    const creatembed = index => {
      let current = datas.slice(index, index + 1);
      let embed = new Discord.MessageEmbed()
        .setTitle(store_type)
        .setColor(config.embed_color)
        .setFooter(`${map[user.area]["名稱"]}`)
        .setTimestamp();
      current.map(d => {
        embed.addField(`${d.name}`, `${d.description}\n價格 - ${d.price}`, true)
      });
      return embed;
    }
  }
}