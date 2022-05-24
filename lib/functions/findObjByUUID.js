const objs = require('./../../objects/index.js');

module.exports = (UUID) => {
    UUID = UUID.split('_')[1] + "_";
    for(let i in objs) {
        for(let j in objs[i].data) {
            if(objs[i].data[j].UUID == UUID) {
                return j;
            }
        }
    }
    return null;
}