const { User } = require('./../_model_.js')
module.exports = async id => {
  const user = await User.findOne({
    userId: id,
  });
  if(user) return user;
  else {
    return false;
  }
}