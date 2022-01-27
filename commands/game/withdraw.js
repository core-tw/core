const loadUser = require('./../../database/loadUser.js');
const loadBank = require('./../../database/loadBank.js');
const Bank = require('./../../model/Bank.js');
module.exports = {
  num: 1,
  name: ['領錢', 'withdraw', 'w'],
  type: 'game',
  expectedArgs: '<數量>',
  description: '從星際銀行領出您的存款',
  minArgs: 1,
  maxArgs: 1,
  level: 1,
  cooldown: 10,
  requireObject: ["銀行卡"],
  async execute(msg, args, user, User) {
    let bank = await loadBank(msg, user, Bank);
    if (msg.content.search("all") != -1) {
      user.coin += user.bank;
      bank.coin = 0
      user.save().catch(err => console.log(err));
      msg.react('✅');
      return
    }
    if (msg.content.search("half") != -1) {
      user.coin += Math.floor((user.bank) / 2);
      bank.coin -= Math.floor((user.bank) / 2)
      user.save().catch(err => console.log(err));
      msg.react('✅');
      return
    }
    if (!isNaN(Number(args[1]))) {
      if (user.bank < Number(args[0]) || Number(args[0]) < 1) return msg.lineReply(`您沒有那麼多錢喔`);
      bank.coin -= Number(args[0]);
      user.coin += Number(args[0]);
      user.save().catch(err => console.log(err));
      msg.react('✅');
      return
    }
  }
}