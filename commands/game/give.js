const config = require('./../../data/config.json');
module.exports = {
  num: 2,
  name: ['給予', 'give', 'g'],
  type: 'game',
  expectedArgs: '<@對象 or id> <數量>',
  description: '轉移您身上一部份的錢給其他人',
  minArgs: 2,
  maxArgs: 2,
  level: null,
  cooldown: 5,
  requireObject: [],
  async execute(msg, args, user, User) {
    const mention_user = msg.mentions.users.first();
    if (mention_user) {
      const to_user = await User.findOne({
        userId: mention_user.id,
      });
      if (!to_user) return msg.lineReply(config.notFindUser);
      if (!isNaN(Number(args[1]))) {
        if (user.coin < Number(args[1]) || Number(args[1]) < 1) {
          if(Number(args[1]) < 1) {
            return msg.lineReply(`您輸入的數字好像怪怪的喔`);
          } else {
            return msg.lineReply(`您沒有那麼多錢喔`);
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
      const to_user = await User.findOne({
        userId: args[0],
      });
      if (!to_user) return msg.lineReply(config.notFindUser);
      if (!isNaN(Number(args[1]))) {
        if (user.coin < Number(args[1]) || Number(args[1]) < 1) {
          if(Number(args[1]) < 1) {
            return msg.lineReply(`您輸入的數字好像怪怪的喔`);
          } else {
            return msg.lineReply(`您沒有那麼多錢喔`);
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