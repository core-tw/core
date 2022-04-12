const mongoose = require('mongoose');
const { attribute } = require('./../_enum_.js').Player;
const Users = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, default: 'an anonymous player' },

  // 稱號
  titles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'core_titles' }],

  // true = 男
  male: { type: Boolean },

  // 機型
  type: { type: Number, default: 0 },

  // 狀態
  status: [{
    name: { type: String, default: "null" }
  }],

  // 等級
  level: { type: Number, default: 1 },

  // 經驗
  xp: { type: Number, default: 0 },
  reqxp: { type: Number, default: 100 },

  // 屬性統計
  stat: {
    HEA: { type: Number, default: attribute.HEA.initial },
    tHEA: { type: Number, default: attribute.HEA.initial },

    SOR: { type: Number, default: attribute.SOR.initial },
    tSOR: { type: Number, default: attribute.SOR.initial },

    STR: { type: Number, default: attribute.STR.initial },
    tSTR: { type: Number, default: attribute.STR.initial },

    VIT: { type: Number, default: attribute.VIT.initial },
    tVIT: { type: Number, default: attribute.VIT.initial },

    INT: { type: Number, default: attribute.INT.initial },
    tINT: { type: Number, default: attribute.INT.initial },

    VEL: { type: Number, default: attribute.VEL.initial },
    tVEL: { type: Number, default: attribute.VEL.initial },
  },

  // 晶玉數量
  coin: { type: Number, default: 0 },
  bank: { type: mongoose.Schema.Types.ObjectId, ref: 'core_banks' },

  // 所在地區
  planet: { type: String, default: "null" },
  area: { type: String, default: "null" },

  // 武裝
  armor: { type: String, default: "null" },
  weapon: { type: String, default: "null" },

  itemsLimit: { type: Number, default: 0 },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'core_items' }]
});

module.exports = mongoose.model('core_users', Users);