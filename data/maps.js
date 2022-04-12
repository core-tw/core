/*
	怪物方面會引用自./creatures.js
*/
const creatures = require("./creatures.js");

module.exports = {
  biomes: {
    plains: "平原",
    grassland: "草原",
    lavaplain: "熔岩平原",
    coast: "海岸",
    forest: "森林",
    mountains: "高山",
    plateau: "高原",
    swamp: "沼澤",
    caves: "洞穴",
    desert: "沙漠",
    ocean: "大海",
    sky: "天空",
    polar: "極地",
    volcano: "火山",
    remains: "遺跡"
  },
  type: {
    sacred: "神聖",
    evil: "邪惡",
    haunted: "鬧鬼"
  },
  planet: {
    "母星": {
      UUID: "0001_",
      description:
        "帝國的母星，初始之地。唯一一個從概念上杜絕死亡的星球\n" +
        "除了韋瓦恩之外，其餘皆是皇族人的專屬領域，玩家們闖入就會被皇都守衛軍擊殺\n" +
        "但若有任務掉落，極其稀有的皇族通行證，則可安全進入",
      area: {
        "韋瓦恩": {
          UUID: "0001_",
          description: "帝國母星的行政中樞",
          rate: 80,
          creatures: creatures["母星"]["韋瓦恩"]
        }
      }
    }
  }
};