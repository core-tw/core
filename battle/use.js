const { Weapons, config } = require('./../_data_.js');
module.exports = (msg, skill, user, to_user) => {
  // 這裡是普通技能的讀取
  if (user.level < skill['等級需求']) return "level";
  if (user.mp < skill['MP消耗']) return "mp";
  user.mp -= skill['MP消耗'];
  if (ran() >= skill['發動機率']) {
    user.save().catch(err => console.log(err));
    return "rate";
  }
  if (!to_user) {
    // 做用在自身
    if (skill['效果']['血量回復']) {
      user.hp += user.thp * skill['效果']['血量回復'];
    }
    if (skill['效果']['MP傳輸'][0]) {
      loop(user.userId, skill['效果']['MP傳輸'][1], "mp", skill['效果']['MP傳輸'][0]);
    }
    if (skill['效果']['攻擊力上升'][0]) {
      loop(user.userId, skill['效果']['攻擊力上升'][1], "atk", skill['效果']['攻擊力上升'][0]);
    }
    if (skill['效果']['防禦力上升'][0]) {
      loop(user.userId, skill['效果']['防禦力上升'][1], "def", skill['效果']['防禦力上升'][0]);
    }
    if (skill['效果']['速度上升'][0]) {
      loop(user.userId, skill['效果']['速度上升'][1], "speed", skill['效果']['速度上升'][0]);
    }
    if (skill['效果']['功速上升'][0]) {
      loop(user.userId, skill['效果']['功速上升'][1], "atkSpeed", skill['效果']['功速上升'][0]);
    }
    // 燒傷、凍傷、中毒、麻痺 暫不處理
  } else {
    // 無敵
    if(to_user.status == "無敵") {
      user.save().catch(err => console.log(err));
      return "無敵";
    }
    
    // 閃避
    let sp = to_user.speed - user.speed;
    if(sp >= config.speed_delta && (ran()+sp) > ran() ) {
      user.save().catch(err => console.log(err));
      return "閃避";
    }
    
    to_user.hp -= Math.round((user.atk + user.atk * Weapons[user.weapon]['攻擊加成']) * skill['傷害加成'])
  }
  to_user.save().catch(err => console.log(err));
  user.save().catch(err => console.log(err));
  return "正常";
}
// const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
/** 發動步驟
 * 1. 檢查等級
 * 2. 檢查MP
 * 3. 發動機率
 * 4. 武裝加成
 */

function ran() {
  return Math.floor(Math.random() * 100)
}
function loop(id, times, p, add) {
  let t = 0;
  let n = setInterval(async () => {
    console.log(p, t);
    let u = await loadUser(id)
    u[p] += add;
    await user.save().catch(err => console.log(err));
    if (t == times) {
      clearInterval(n);
    }
  }, 2000);
}
async function log(message, id, client) {
  let embed = new Discord.MessageEmbed()
    .setDescription(`${message.author.tag} 對 ID ${id} 使用了 ${data['技能名稱']}\n總傷害 ${data['傷害'] + data['效果傷害']}`)
  let ch = await client.channels.fetch("917040196959223878");
  ch.send(embed);
}
