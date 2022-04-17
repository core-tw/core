const { Items } = require('./../_models_.js');
const { log } = require('./../_functions_.js');
const { items } = require('./../_objects_.js');

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
			return true;
		}

		// 沒有item
    item = new Item({
      owmer: user._id,
      itemId: itemUUID,
    });
		
    if(item.amount + num < 0) return false;
		
		item.amount += num;
		item.save();
		user.items.push(item._id);
		return true;
    
		return true;
  } catch (err) {
		console.log(err)
  }
}