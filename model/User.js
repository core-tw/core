const mongoose = require('mongoose')

const Users = mongoose.Schema({
  userId: {type: String, required: true},
  name:{type: String, default:'player'},
  profession:{type: Number, default: 1},
  xp:{type: Number, default: 0},
  reqxp:{type: Number, default: 100},
  level:{type: Number, default: 1},
  hp:{type: Number, default: 100},
  thp:{type: Number, default: 100},
  mp:{type: Number, default: 20},
  tmp:{type: Number, default: 20},
  atk:{type: Number, default: 20},
  def:{type: Number, default: 15},
  coin:{type: Number, default: 100},
  bank:{type: Number,  default: 0},
  area:{type: Number,  default: 1},
  tarea:{type: Number,  default: 1},
  items:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User_item' }]
})

module.exports = mongoose.model('core_users', Users)