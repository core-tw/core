const mongoose = require('mongoose');

const Items = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'core_users' },

    // 儲存物品的UUID
    itemId: { type: String, required: true },

    // 數量
    amount: { type: Number, default: 0 },
});

module.exports = mongoose.model('core_items', Items);