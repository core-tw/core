const Maps = require("./../enum/maps.js");
const UUID_PREFIX = require("./../enum/UUID_PREFIX.js");
// 透過UUID查找地區名稱
module.exports = (UUID) => {
  let PREFIX = UUID.split("_")[0] + "_";
  let MID = UUID.split("_")[1] + "_";
  let END = UUID.split("_")[2] + "_";
  if (UUID_PREFIX.Maps != PREFIX) return null;
  for (let i in Maps.planet) {
    if (Maps.planet[i].UUID == MID) {
      for (let j in Maps.planet[i].area) {
        if (Maps.planet[i].area[j].UUID == END) {
          return [i, j];
        }
      }
    }
  }
  return null;
}