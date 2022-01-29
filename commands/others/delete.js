const { config } = require('./../../_data_.js');
const { User } = require('./../../_model_.js');
module.exports = {
  num: 8,
  name: ['刪除帳號', 'deleteaccount'],
  type: "others",
  expectedArgs: '',
  description: '將您的存在從概念層面抹去',
  minArgs: 0,
  maxArgs: 0,
  level: null,
  cooldown: null,
  requireObject: [],
  requirePermission: [],
  async execute(msg, args, user) {
    if (!user) return msg.lineReply(config.notFindUser);
    msg.lineReply(`是否刪除您的資料？`).then(async (m) => {
      m.react('✅');
      await m.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).catch(err => { });
      User.deleteOne({ userId: msg.author.id, }, function(err) {
        if (err) {
          console.log(err)
          msg.lineReply(config.error_str);
          return
        }
      });
      await m.edit(`刪除成功！`);
    });
    let filter = (reaction, user) => {
      if (user.id != msg.author.id) return;
      if (reaction.emoji.name == "✅") {
        return true;
      }
    }
  }
}