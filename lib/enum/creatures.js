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
			},
			"幾丁質甲殼": {
				rate: 50,
        data: items.data["幾丁質甲殼"],
				maxFall: 1
			}
    },
    descrition: "體長兩公尺以上，前顎強而有力，能釋放體內儲存的電力來電死敵人"
  }
}