const fl = "./function/";
module.exports = {
  area: require(fl + 'area.js'),
  errorEmbed: require(fl + "errorEmbed.js"),
  generate: require(fl + 'generate.js'),
	getUpgNeed: require(fl + 'getUpgNeed.js'),
	log: require(fl + 'log.js'),
	random: require(fl + 'random.js'),
	wait: require(fl + 'wait.js')
}