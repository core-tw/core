const map = require('./map.js');
module.exports = (name) => {
  for(let i in map){
    if(name == map[i]['名稱']) {
      return [true, i];
    }
  }
  return [false];
}