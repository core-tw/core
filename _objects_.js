const fs = require('fs');
const fl = "./objects/";
const getData = (folder) => {
  let items = {};
  let itemFiles = fs.readdirSync(fl + folder).filter(file => file.endsWith('.json'));
  for (let item of itemFiles) {
    let datas =  require(fl + `${folder}/${item}`);
		for (let i in datas) {
			items[i] = datas[i];
			items[i].type = item.replace(".json", "");
		}
  }
  return items;
}

const Enum = {
  items: {
		UUID: "ITEMS_",
		data: getData("items")
	}
};
// https://github.com/sizzlorox/Idle-RPG-Bot/tree/master/idle-rpg/bots
// 之後會有roles
module.exports = Enum;