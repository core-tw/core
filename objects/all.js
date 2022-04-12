const fs = require('fs');
const getData = (folder) => {
  let items = {};
  let itemFiles = fs.readdirSync(`./${folder}`).filter(file => file.endsWith('.json'));
  for (let item of itemFiles) {
    items[item] = JSON.parse(fs.readFileSync(`./${folder}/${file}`, `utf-8`));
  }
  return items;
}

const Enum = {
  items: getData("items"),
};
// https://github.com/sizzlorox/Idle-RPG-Bot/tree/master/idle-rpg/bots
module.exports = Enum;