const Discord = require('discord.js');
const Item = require('./../../model/Item.js');
const Store = require('./../../data/store.js');
const findName = require('./../../data/findName.js');
const config = require('./../../data/config.json');
const loadUser = require('./../../database/loadUser.js');
const addItem = require('./../../database/addItem.js');
const map = require('./../../data/map.js');
module.exports = {
  num: 5,
  name: ['商店', 'store', 'shop'],
  type: 'game',
  expectedArgs: '',
  description: '各個星球當地的商店',
  minArgs: 0,
  maxArgs: 0,
  level: 1,
  cooldown: 5,
  requireObject: ['公民證'],
  async execute(msg, args, user, User) {
    msg.react('✅');
    if(!user) return msg.lineReply(config.notFindUser);

    const creatembed = index  => {
      let current = datas.slice(index, index + max);
      let embed = new Discord.MessageEmbed()
      .setTitle('商店')
      .setColor(config.embed_color)
      .setFooter(`${map[user.area]}`)
      .setTimestamp();

      current.map(d=>{
        embed.addField(`-| ${a1[0]}`,`${a2.trim()}\n編輯者：<@${d.authorId}>`,true)
      })
      return embed;
    }
  }
}