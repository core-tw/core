const { config } = require('./../../_data_.js');
const { loadUser } = require('./../../_database_.js');
module.exports = {
  num: 2,
  name: ['給予', 'give', 'g'],
  type: 'game',
  expectedArgs: '<@對象 or id> <數量>',
  description: `轉移您身上一部份的${config.money}給其他人`,
  minArgs: 2,
  maxArgs: 2,
  level: null,
  cooldown: 5,
  requireObject: [],
  requirePermission: [],
  async execute(msg, args, user) {
    const mention_user = msg.mentions.users.first();
    if (mention_user) {
      const to_user = await loadUser(mention_user.id)
      if (!to_user) return msg.lineReply(config.notFindUser);
      if (!isNaN(Number(args[1]))) {
        if (user.coin < Number(args[1]) || Number(args[1]) < 1) {
          if(Number(args[1]) < 1) {
            return msg.lineReply(`您輸入的數字好像怪怪的喔`);
          } else {
            return msg.lineReply(`您沒有那麼多${config.money}喔`);
          }
        }
        user.coin -= Number(args[1]);
        to_user.coin += Number(args[1]);

        user.save().catch(err => console.log(err));
        to_user.save().catch(err => console.log(err));
        msg.react('✅');
      } else {
        msg.lineReply(`請輸入正確的數字`);
      }
    } else {
      const to_user = await loadUser(args[0])
      if (!to_user) return msg.lineReply(config.notFindUser);
      if (!isNaN(Number(args[1]))) {
        if (user.coin < Number(args[1]) || Number(args[1]) < 1) {
          if(Number(args[1]) < 1) {
            return msg.lineReply(`您輸入的數字好像怪怪的喔`);
          } else {
            return msg.lineReply(`您沒有那麼多${config.money}喔`);
          }
        }
        user.coin -= Number(args[1]);
        to_user.coin += Number(args[1]);

        user.save().catch(err => console.log(err));
        to_user.save().catch(err => console.log(err));
        msg.react('✅');
      } else {
        msg.lineReply(`請輸入正確的數字`);
      }
    }
  }
}