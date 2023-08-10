//const Maps = require('./../enum/maps.js');
const UUID_PREFIX = require("./../enum/UUID_PREFIX.js");
// 透過UUID查找
module.exports = (UUID) => {
    let PREFIX = UUID.split("_")[0] + "_";
    let PLANET = UUID.split("_")[1] + "_";
    if (UUID_PREFIX.Maps != PREFIX) return null;
    for (let i in Maps.planet) {
        if (Maps.planet[i].UUID == PLANET) {
            return Maps.planet[i].area;
        }
    }
    return null;
}