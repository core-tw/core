const mongoose = require('mongoose')

const Bank = mongoose.Schema({
  owmer:{ type: mongoose.Schema.Types.ObjectId, ref: 'core_users' },
  coin:{type: Number, default: 0},
})

module.exports = mongoose.model('core_bank', Bank);