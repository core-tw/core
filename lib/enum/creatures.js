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
				maxFall: 3
			},
			"幾丁質甲殼": {
				rate: 50,
        data: items.data["幾丁質甲殼"],
				maxFall: 1
			}
    },
    descrition: "體長五公尺左右，前顎強而有力，能釋放體內儲存的電力來電死敵人，身上帶有堅固的甲殼"
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
				maxFall: 3
			},
			"幾丁質甲殼": {
				rate: 10,
        data: items.data["幾丁質甲殼"],
				maxFall: 1
			}
    },
    descrition: "體長四公尺左右，前顎強而有力，能引動大氣間的雷霆來擊斃敵人"
	}
}