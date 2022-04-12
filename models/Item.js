const mongoose = require('mongoose');

const Items = mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'core_users' },

  itemId: { type: String, required: true },
  // 數量
  amount: { type: Number, default: 0 },
});

module.exports = mongoose.model('core_items', Items);