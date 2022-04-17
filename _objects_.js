const fs = require('fs');
const fl = "./objects/";
const getData = (folder) => {
  let items = {};
  let itemFiles = fs.readdirSync(fl + folder).filter(file => file.endsWith('.json'));
  for (let item of itemFiles) {
    items[item.replace(".json", "")] = JSON.parse(fs.readFileSync(fl + `${folder}/${item}`, `utf-8`));
		for (let i in items[item]) {
			items[item][i].type = item.replace(".json", "");
		}
  }
  return items;
}

const Enum = {
  items: {
		UIID: "ITEMS_",
		data: getData("items")
	}
};
// https://github.com/sizzlorox/Idle-RPG-Bot/tree/master/idle-rpg/bots
module.exports = Enum;