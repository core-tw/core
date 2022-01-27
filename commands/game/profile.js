const Discord = require('discord.js');
const config = require('./../../data/config.json');
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
  async execute(msg, args, user, User) {
    msg.react('✅');
    const mention_user = msg.mentions.users.first();
    if (mention_user) {
      const another_user = await User.findOne({
        userId: mention_user.id,
      });
      if (!another_user) return msg.lineReply(config.notFindUser);
      let icon = mention_user.displayAvatarURL();
      generateEmbed(another_user, icon);
    } else {
      if(args[0]) {
        const another_user = await User.findOne({
          userId: args[0],
        });
        if (!another_user) return msg.lineReply(config.notFindUser);
        let icon = mention_user.displayAvatarURL();
        generateEmbed(another_user, icon);
      } else if(user) {
        let icon = msg.author.displayAvatarURL();
        msg.channel.send(generateEmbed(user, icon));
        return;
      } else {
        msg.lineReply(config.notFindUser);
      }
    }
    function generateEmbed(user, icon){
      return new Discord.MessageEmbed()
      .setColor(config.embed_color)
      .setTitle(`${user.name}`)
      .setDescription(`所在區域 -\\ **母星** \\`)
      .setThumbnail(icon)
      .setTimestamp();
    }
  }
}