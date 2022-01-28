const config = require('./../data/config.json');
module.exports = (msg, user, Bank) => {
  try {
    if (!user) {
      return false;
    }
    Bank.findOne({
    owmer: user._id,
  }, async (err, user) => {
    if(bank) {
      return bank;
    } else {
      return false;
    }
  });
  } catch (err) {
    console.log(err);
    return false;
  }
}