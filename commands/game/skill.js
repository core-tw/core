const { config, Skill } = require('./../../_data_.js');
const { loadUser } = require('./../../_database_.js');
const { cd, use } = require('./../../_skill_.js');
module.exports = {
  num: 10,
  name: ["技能", "skill", "sk"],
  type: "game",
  expectedArgs: '<技能名 or 技能ID>',
  description: `使用普通技能`,
  minArgs: 1,
  maxArgs: 2,
  level: null,
  cooldown: null,
  requireObject: [],
  requirePermission: [],
  async execute(msg, args, user) {
    msg.react('✅');
    if (!user) return msg.lineReply(config.notFindUser);
    let skill = Skill[args[0]];
    if (!skill) return msg.lineReply(config.notFindSkill);
    let check = cd(msg.author.id, Skill[args[0]]['ID'], Skill[args[0]]['冷卻']);
    if (check) return msg.lineReply(`技能尚在冷卻中 剩餘 ${check[0] + check[1] - Date.now()} 毫秒`);
    if(!skill['作用對象']) {
      let ans = use(msg, skill, user, null);
      console.log(ans)
      return;
    }
    let to_user;
    if (args[0]) {
      to_user = await loadUser(args[0]);
    }
    if (!to_user) {
      if(args[1]) {
        let id = args[1].replace("<@").replace("!").replace(">");
        if (id.length > 0) {
          to_user = await loadUser(id);
        }
      }
      if (!to_user) {
        const mention_user = msg.mentions.users.first();
        if (mention_user) {
          to_user = await loadUser(mention_user.id);
        }
      }
    }
    if (!to_user) return msg.lineReply(config.notFindUser);
    let ans = use(msg, skill, user, to_user);
    console.log(ans);
  }
}