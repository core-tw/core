const {  Bank } = require('./../_model_.js')
module.exports = user => {
  try {
    if (!user) {
      return false;
    }
    Bank.findOne({
    owmer: user._id,
  }, async (err, bank) => {
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