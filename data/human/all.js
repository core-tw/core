var Data = {};
const fs = require('fs');
let Folders = fs.readdirSync('./data/human/skills');
for (let folder of Folders) {
  let data = require(`./skills/${folder}/index.json`);
  for(let i in data) {
    Data[i] = data[i];
  }
}
module.exports = Data;