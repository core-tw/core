const Weapons = require('./weapon.js');
const Objects = require('./object.js');
const Store = {};
for(let w in Weapons) {
  Store[w] = Weapons[w];
}
for(let ob in Objects) {
  Store[ob] = Objects[ob];
}
module.exports = Store;