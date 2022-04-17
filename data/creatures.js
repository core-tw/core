const { items } = require("./../_objects_.js");

// 各種生物，使用星球、地圖來分類，採用模板
module.exports = {
  "母星": {
    "韋瓦恩": {
      "電晶蟻": {
        hp: 5,
        atk: 1,
        def: 1,
        dodge: 1,
        rate: 90,
        lvLimit: [1, 10],
        UUID: "電晶蟻_",
        falls: {
          "電晶體": {
            rate: 10,
            data: items.data["電晶體"]
          }
        },
        descrition: "體長兩公尺以上，前顎強而有力，能釋放體內儲存的電力來電死敵人"
      }
    }
  }
}