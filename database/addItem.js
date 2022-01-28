const Item = require('./../model/Item.js');
module.exports = async (msg, user, ob_id) => {
  try {
    if (!user) {
      msg.lineReply(config.error_str);
      return "error";
    }
    if(ob_id.startsWith('w')) {
      var item = await Item.findOne({
        owmer: user._id,
        itemId: ob_id,
      });
      if(item && item.amount > 0) {
        return "already";
      }
      item = new Item({
        owmer: user._id,
        itemId: ob_id,
      });
      item.amount += 1;
      item.save().catch(err => console.log(err));
      return;
    }
    var item = await Item.findOne({
      owmer: user._id,
      itemId: ob_id,
    });
    if (!item) {
      item = new Item({
        owmer: user._id,
        itemId: ob_id,
      });
    }
    item.amount += 1;
    item.save().catch(err => console.log(err));
  } catch (err) {
    msg.lineReply(config.error_str);
    return "error";
  }
}