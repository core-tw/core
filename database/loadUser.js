const { Users } = require('./../_models_.js')
module.exports = async id => {
  const user = await Users.findOne({
    userId: id,
  });
  if(user) return user;
  else {
    return null;
  }
}