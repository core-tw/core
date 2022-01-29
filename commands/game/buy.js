const { Store, config } = require('./../../_data_.js');
const { addItem } = require('./../../_database_.js');
module.exports = {
  num: 5,
  name: ['購買', 'buy', 'b'],
  type: 'game',
  expectedArgs: '<物品名稱> <數量 (默認為1)>',
  description: '在各個星球當地的道具店購買物品',
  minArgs: 1,
  maxArgs: 2,
  level: 1,
  cooldown: 5,
  requireObject: ['公民證'],
  requirePermission: [],
  async execute(msg, args, user) {
    msg.react('✅');
    if(!user) return msg.lineReply(config.notFindUser);
    if(!Store[args[0]]) return msg.lineReply(`查無 ${args[0]}，請您檢查是否打錯字`);
    if(user.coin >= Store[args[0]].cost) {
      let add = await addItem(msg, user, Store[args[0]]['ID']);
      if (add === "error") return;
      if (add === "already") return msg.lineReply(`您已經有該武裝了喔`);
      user.coin -= Store[args[0]].cost;
      user.save().catch(err => console.log(err));
      msg.channel.send(config.additem.replace("item", args[0]));
    } else {
      msg.lineReply(`您沒有那麼多${config.money}喔`);
    }
  }
}