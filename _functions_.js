const fl = "./function/";
module.exports = {
  errorEmbed: require(fl + "errorEmbed.js"),
	findAreaByUUID: require(fl + "findAreaByUUID.js"),
	findObjByUUID: require(fl + "findObjByUUID.js"),
  generate: require(fl + 'generate.js'),
	getAreaByUUID: require(fl + "getAreaByUUID.js"),
	getShop: require(fl + 'getShop.js'),
	getUpgNeed: require(fl + 'getUpgNeed.js'),
	log: require(fl + 'log.js'),
	random: require(fl + 'random.js'),
	wait: require(fl + 'wait.js')
}