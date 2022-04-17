const fl = "./database/"
module.exports = {
	addItems: require(fl + 'addItems.js'),
  connect: require(fl + 'connect.js'),
  loadUser: require(fl + 'loadUser.js'),
	upgrade: require(fl + 'upgrade.js')
}