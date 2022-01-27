const config = require('./../data/config.json');
module.exports = async (msg, User) => {
  const user = await User.findOne({
    userId: msg.author.id,
  });
  if(user) return user;
  else {
    console.log(err)
    msg.lineReply(config.notFindUser);
    return false;
  }
}