const { config, Objects, Weapons } = require('./../_data_.js');
const { Item } = require('./../_model_.js');
module.exports = async (msg, user, reqs) => {
  try {
    if (!user) {
      return false;
    }
    let list = [];
    for(let r in reqs) {
      let item = await Item.findOne({
        owmer: user._id,
        itemId: Objects[reqs[r]]['ID'] || Weapons[reqs[r]]['ID'],
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