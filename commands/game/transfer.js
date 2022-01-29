const { config, checkPlant } = require('./../../_data_.js');
const { checkRequire } = require('./../../_database_.js');
module.exports = {
  num: 9,
  name: ['傳送', '轉移', 'transfer', 'tr'],
  type: "game",
  expectedArgs: '<地名>',
  description: `使用帝國傳送陣來進行星球間的移動，會收取一定額度的${config.money}`,
  minArgs: 1,
  maxArgs: 1,
  level: null,
  cooldown: 60,
  requireObject: [],
  requirePermission: [],
  async execute(msg, args, user) {
    msg.react('✅');
    if (!user) return msg.lineReply(config.notFindUser);
    let plant = checkPlant(args[0]);
    if(!plant[0]) return msg.lineReply(`查無 ${args[0]}，請您檢查是否打錯字`);

    let have = await checkRequire(msg, user, [`${args[0]}通行證`]);
    if(!have) return;

    if(user.coin < config.transfer_cost) return msg.lineReply(`您沒有那麼多${config.money}喔`);

    msg.lineReply(`是否花費${config.transfer_cost}${config.money}傳送至${args[0]}？`).then(async (m) => {
      m.react('✅');
      await m.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).catch(err => { });
      user.coin -= config.transfer_cost;
      user.area = plant[1];
      user.save().catch(err => console.log(err));
      await m.edit(`傳送成功！`);
    });
      
    let filter = (reaction, user) => {
      if (user.id != msg.author.id) return;
      if (reaction.emoji.name == "✅") {
        return true;
      }
    }
  }
}