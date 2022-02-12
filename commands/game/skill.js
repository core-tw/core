const { config, Skill, findName } = require('./../../_data_.js');
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
    if (!skill) {
      let name = findName(Skill, args[0].toLowerCase());
      if(!name) return msg.lineReply(config.notFindSkill);
      skill = Skill[name];
    }
    let check = cd(msg.author.id, skill['ID'], skill['冷卻']);
    if (check) return msg.lineReply(`技能尚在冷卻中 剩餘 ${check[0] + check[1] - Date.now()} 毫秒`);
    if (!skill['作用對象']) {
      let ans = use(msg, skill, user, null);
      console.log(ans)
      return;
    }
    let to_user;
    if (args[1]) {
      to_user = await loadUser(args[1]);
    }
    if (!to_user) {
      if (args[1]) {
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
    if(user.userId === to_user.userId) return msg.lineReply(`技能施放無效，無法對自身使用此技能`);
    let ans = use(msg, skill, user, to_user);
    console.log(ans);
    let res = "";
    switch (ans) {
      case "正常":
        res = "技能發動成功！";
        break;
      case "閃避":
        res = "技能無效，攻擊miss！";
        break;
      case "無敵":
        res = "技能無效，對方正處於無敵狀態！";
      case "機率":
        res = "技能發動失敗！";
      default:
        res = "技能發動成功！";
    }
    msg.lineReply(res);
  }
}