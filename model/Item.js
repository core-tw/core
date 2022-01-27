const mongoose = require('mongoose')

const Item = mongoose.Schema({
  owmer:{ type: mongoose.Schema.Types.ObjectId, ref: 'core_users' },
  itemId:{type: String, required: true},
  amount:{type: Number, default: 0},
})

module.exports = mongoose.model('core_user_items', Item)