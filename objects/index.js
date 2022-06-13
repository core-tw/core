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

// 之後會有roles
objects.items = {
	UUID: "ITEMS_",
	data: getObjectsData("items")
}

module.exports = objects;


// 因為會衝突，所以延遲載入
const objUse = require("./use.js");

for(let i in objects.items.data) {
	if(objUse[i]) {
		objects.items.data[i].use = objUse[i];
	} else {
		objects.items.data[i].use = null;
	}
}
module.exports = objects;


/* 檢查所有物品

const { log, errorEmbed } = require('./_functions_.js');
const { Users, Items, Banks } = require('./_models_.js');
const { Player, UUID_PREFIX, Maps, Reactions } = require('./_enum_.js');
const { loadUser } = require('./_database_.js');
const { floor, random, round, pow } = Math;

let itemList = [];
let itemFiles = fs.readdirSync('./objects/items').filter(file => file.endsWith('.json'));
for (let file of itemFiles) {
  let f = JSON.parse(
    fs.readFileSync(`./objects/items/${file}`, 'utf-8')
  )
  for (let w in f) {
    itemList.push(
      `${f[w]['id']}. ${w} | ${f[w]["type"]} | ${f[w]["volume"]}`
    );
  }
}
*/


