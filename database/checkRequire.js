const config = require('./../data/config.json');
const weapon = require('./../data/weapon.js');
const object = require('./../data/object.js');
const Item = require('./../model/Item.js');
module.exports = async (msg, user, reqs) => {
  try {
    if (!user) {
      return false;
    }
    let list = [];
    for(let r in reqs) {
      let item = await Item.findOne({
        owmer: user._id,
        itemId: object[reqs[r]]['ID'] || weapon[reqs[r]]['ID'],
      });
      if (!item || item.amount < 1) {
        list.push(reqs[r]);
      }
    }
    if(list.length > 0) {
      msg.lineReply(`您還沒有這些物品喔 [ **${list.join("** | **")}** ]`);
      return false;
    }
    return true;
  } catch (err) {
    console.log(err)
    msg.lineReply(config.error_str);
    return false;
  }
}