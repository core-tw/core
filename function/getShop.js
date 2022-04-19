const { items: { data } } = require('./../_objects_.js');

/* 返回商店物件
*/
module.exports = () => {
	let shop = {};
	for(let i in data) {
		if(typeof data[i].forSale !== "object" && !isNaN(data[i].forSale)) {
			if(!shop[data[i].type]) shop[data[i].type] = {};
			shop[data[i].type][i] = data[i];
		}
	}
	return shop;
}