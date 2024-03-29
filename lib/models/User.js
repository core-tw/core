const mongoose = require('mongoose');

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

    // 屬性點
    statPoint: { type: Number, default: 0 },

    // 屬性
    stat: {
        HEA: { type: Number, default: 1 },
        SOR: { type: Number, default: 1 },
        STR: { type: Number, default: 1 },
        VIT: { type: Number, default: 1 },
        INT: { type: Number, default: 1 },
        VEL: { type: Number, default: 1 },
        LUK: { type: Number, default: 1 },
    },

    // 實際
    act: {
        HEA: { type: Number, default: 1 },
        SOR: { type: Number, default: 1 },
        STR: { type: Number, default: 1 },
        VIT: { type: Number, default: 1 },
        INT: { type: Number, default: 1 },
        VEL: { type: Number, default: 1 },
        LUK: { type: Number, default: 1 },
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