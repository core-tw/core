const config = require('./../data/config.json');
module.exports = (msg, user, Bank) => {
  try {
    if (!user) {
      msg.lineReply(config.error_str);
      return false;
    }
    Bank.findOne({
    owmer: user._id,
  }, async (err, user) => {
    if(bank) {
      return bank;
    } else {
      msg.lineReply(config.error_str);
      return false;
    }
  });
  } catch (err) {
    console.log(err)
    msg.lineReply(config.error_str);
    return false;
  }
}