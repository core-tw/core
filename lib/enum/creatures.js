const { items } = require("./../../objects/index.js");

// 各種生物
module.exports = {
    "電晶蟻": {
        hp: 5,
        atk: 1,
        def: 1,
        dodge: 1,
        lvLimit: [1, 10],
        UUID: "電晶蟻_",
        falls: {
            "電晶體": {
                rate: 10,
                data: items.data["電晶體"],
                maxFall: 3
            }
        },
        descrition: "體長兩公尺左右，前顎強而有力，能釋放體內儲存的電力來電死敵人"
    },
    "裝甲電晶蟻": {
        hp: 5.6,
        atk: 1,
        def: 1.3,
        dodge: 1.1,
        lvLimit: [11, 30],
        UUID: "裝甲電晶蟻_",
        falls: {
            "電晶體": {
                rate: 20,
                data: items.data["電晶體"],
                maxFall: 5
            },
            "幾丁質甲殼": {
                rate: 50,
                data: items.data["幾丁質甲殼"],
                maxFall: 1
            }
        },
        descrition: "體長五公尺左右，前顎強而有力，能釋放體內儲存的電力來電死敵人，身上帶有堅固的甲殼。"
    },
    "雷霆嗜殺蟻": {
        hp: 6,
        atk: 2.2,
        def: 1.25,
        dodge: 1.3,
        lvLimit: [30, 60],
        UUID: "雷霆嗜殺蟻_",
        falls: {
            "電晶體": {
                rate: 60,
                data: items.data["電晶體"],
                maxFall: 15
            },
            "幾丁質甲殼": {
                rate: 10,
                data: items.data["幾丁質甲殼"],
                maxFall: 1
            }
        },
        descrition: "體長四公尺左右，前顎強而有力，能引動大氣間的雷霆來擊斃敵人。"
    },
    "夢蟲": {
        hp: 5.2,
        atk: 1.5,
        def: 0.75,
        dodge: 2,
        lvLimit: [1, 60],
        UUID: "夢蟲_",
        falls: null,
        descrition: "精神層面的寄生蟲，外殼的關節處會釋放出至癮的氣體興奮劑，會使吸入的生物下降判斷事物的能力。帝國已立法此生物不可在密閉空間出現，但仍有部分業者違法將此生物放置於通風處"
    },
    "蝕礦蟲": {
        hp: 5,
        atk: 1,
        def: 1.5,
        dodge: 0.5,
        lvLimit: [1, 60],
        UUID: "蝕礦蟲_",
        falls: {
            "炎針": {
                rate: 100,
                data: items.data["炎針"],
                maxFall: 20
            }
        },
        descrition: "渾身布滿銀色金屬尖刺，外型酷似海膽，以金屬維生"
    },
    "洞穴冰蛛": {
        hp: 5.5,
        atk: 1.2,
        def: 0.8,
        dodge: 1.2,
        lvLimit: [1, 60],
        UUID: "洞穴冰蛛_",
        falls: {
            "冰源能晶": {
                rate: 50,
                data: items.data["冰源能晶"],
                maxFall: 5
            }
        },
        descrition: "體型巨大，渾身散發寒冷之氣的半透明冰晶蜘蛛。"
    }
}