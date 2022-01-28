const config = require('./../data/config.json');
module.exports = async (id, User) => {
  const user = await User.findOne({
    userId: id,
  });
  if(user) return user;
  else {
    return false;
  }
}