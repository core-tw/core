const log = require("./../functions/log.js");
const { items } = require("./../../objects/index.js");
const Items = require("./../models/Item.js");
// 透過名子來增加
module.exports = async (user, itemUUID, num) => {
  try {
		let item = await Items.findOne({
		  owner: user._id,
			itemId: itemUUID
		});
    if(item) {
			if(item.amount + num < 0) return false;
			item.amount += num;
			item.save();
			return true;
		}

		// 沒有item
    item = new Items({
      owner: user._id,
      itemId: itemUUID,
    });
		
    if(item.amount + num < 0) return false;
		
		item.amount += num;
		item.save();
		user.items.push(item._id);
	
		return true;
  } catch (err) {
		console.log(err)
  }
}