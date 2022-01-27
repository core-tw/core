const mongoose = require('mongoose')

const Users = mongoose.Schema({
  userId: {type: String, required: true},
  name:{type: String, default:'a player'},

  gender:{type: String, required: true},

  level:{type: Number, default: 1},
  xp:{type: Number, default: 0},
  reqxp:{type: Number, default: 100},
  
  hp:{type: Number, default: 100},
  thp:{type: Number, default: 100},

  mp:{type: Number, default: 20},
  tmp:{type: Number, default: 20},

  atk:{type: Number, default: 20},
  def:{type: Number, default: 15},

  coin:{type: Number, default: 100},
  area:{type: Number,  default: 0},
  items:[{ type: mongoose.Schema.Types.ObjectId, ref: 'core_user_items' }]
})

module.exports = mongoose.model('core_users', Users)