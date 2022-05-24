const Items = require("./../models/Item.js");
const errorEmbed = require("./../functions/errorEmbed.js");
const findObjByUUID = require("./../functions/findObjByUUID.js");
const setting = require("./../../config/setting.json");
const mongoose  = require("mongoose");
module.exports = async (user) => {
	let list = [];
  for (let i in user.items) {
		let item = await Items.findOne({ _id: user.items[i] });
    if (!item) {
      return null;
    }
    if (item.amount > 0) {
      // 分解UUID
      let name = findObjByUUID(item.itemId);
      if (!name) {
        return null;
      }

      list.push({
        name: name,
        amount: item.amount,
				UUID: item.itemId
      });
		}
  }
	return list;
}
