const fs = require("fs");

const path = require("path");
const objects = {};
const getObjectsData = (folder) => {
  let items = {};
  let itemFiles = fs.readdirSync(path.join(__dirname, folder)).filter(file => file.endsWith(".json"));
  for (let item of itemFiles) {
    let datas =  require(path.join(__dirname, folder, item));
		for (let i in datas) {
			items[i] = datas[i];
			items[i].type = item.replace(".json", "");
		}
  }
  return items;
}
objects.items = {
	UUID: "ITEMS_",
	data: getObjectsData("items")
}// 之後會有roles

module.exports = objects;