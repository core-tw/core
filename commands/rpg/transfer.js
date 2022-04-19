const { errorEmbed, findAreaByUUID, getAreaByUUID, log, wait } = require('./../../_functions_.js');
const config = require('./../../config.json');
const { coinName } = require('./../../setting.json');

// 個人物品欄
module.exports = {
  num: 8,
  name: ['傳送', '轉移', 'transfer', 'tr'],
  type: "rpg",
  expectedArgs: '<地名>',
  description: `使用帝國傳送陣進行星球內的移動，不會收取額外的${coinName}`,
  minArgs: 1,
  maxArgs: 1,
  level: 10,
  cooldown: 300,
  requireItems: [],
  requireBotPermissions: [],
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

      const { channel, author } = msg;

      let res = findAreaByUUID(user.planet);
      let planet = getAreaByUUID(user.area)[0];
      if (!res || !planet) {
        errorEmbed(channel, author, null, config.error.no);
        return;
      }

      if (!res[args[0]]) {
        let content = "";
        for (let i in res) {
          content += `${i}\n`
        }
        errorEmbed(channel, author, null, `${planet}內查無此地區 **${args[0]}**\n地區列表 -\n${content}`);
        return;
      }
      user.area = user.planet + res[args[0]].UUID;

      let m = await msg.reply({
        content: `轉移中...`,
        allowedMentions: config.allowedMentions
      });

      user.save();
      await wait(5000);

      m.edit({
        content: `轉移至 ${args[0]}`,
        allowedMentions: config.allowedMentions
      });

    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}