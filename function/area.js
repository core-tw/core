const { Maps, UUID_PREFIX } = require('./../_enum_.js');

// 透過UUID查找物品
module.exports.getArea = (UUID) => {
  let PREFIX = UUID.split("_")[0] + "_";
  let MID = UUID.split("_")[1] + "_";
  let END = UUID.split("_")[2] + "_";
  if (UUID_PREFIX.Maps != PREFIX) return false;
  for (let i in Maps.planet) {
    if (Maps.planet[i].UUID == MID) {
      for (let j in Maps.planet[i].area) {
        if (Maps.planet[i].area[j].UUID == END) {
          return [i, j];
        }
      }
    }
  }
  return false;
}　