const Discord = require('discord.js')
const { config } = require('./../_data_.js');
module.exports = (msg, user) => {
  if (!user) return;
  let old_level = user.level;
  while (user.xp >= user.reqxp) {
    user.thp += 0 * user.level;
    user.tmp += 0;
    user.atk += 0;
    user.def += 0;
    user.xp -= user.reqxp;
    user.reqxp = Math.floor(user.reqxp * config.level_up_req);
    user.level += 1;
  }
  user.hp = user.thp;
  user.mp = user.tmp;
  if (user.level !== old_level) {
    let level_str = `
    權限提升至 ${user.level}
    經驗值 ${user.xp} / ${user.reqxp}`;
    user.save().catch(err => console.log(err));
    let embed = new Discord.MessageEmbed()
      .setColor(config.embed_color)
      .setTitle(``)
      .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL())
      .addField('**權限提升！**', level_str, true)
      .setTimestamp()
    msg.channel.send(embed);
  }
}