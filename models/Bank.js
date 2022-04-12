const mongoose = require('mongoose');

const Banks = mongoose.Schema({
  owmer: { type: mongoose.Schema.Types.ObjectId, ref: 'core_users' },

  // 晶玉數量
  coin: { type: Number, default: 0 },
});

module.exports = mongoose.model('core_banks', Banks);