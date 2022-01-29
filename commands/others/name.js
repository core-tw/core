const { config } = require('./../../_data_.js');
const { loadUser } = require('./../../_database_.js');
const {  } = require('./../../_model_.js');
module.exports = {
  num: 7,
  name: ["改名", "名字", "名子", "changename", "name", "cn"],
  type: "others",
  expectedArgs: '<你的名字>',
  description: '更改您的用戶名稱',
  minArgs: 1,
  maxArgs: null,
  level: null,
  cooldown: 60,
  requireObject: [],
  requirePermission: [],
  async execute(msg, args, user) {
    msg.react('✅');
		if (!user) return msg.lineReply(config.notFindUser);
    user.name = args.join(' ');
    user.save().catch(err=>console.log(err));
    msg.channel.send(config.change_name.replace("name", user.name));
  }
}