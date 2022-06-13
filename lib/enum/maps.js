/*
	怪物方面會引用自./creatures.js
*/
const Creatures = require('./creatures.js');
const Objects = require('./../../objects/items/material.json');

const biomes = {
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
}

module.exports = {
  biomes: biomes,
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
        "除了韋瓦恩之外，其餘皆是王族人的專屬領域，玩家們闖入就會被王都守衛軍擊殺\n" +
        "但若有任務掉落，極其稀有的王族通行證，則可安全進入",
      area: {
        "韋瓦恩": {
          UUID: "0001_",
          description: "帝國母星的行政中樞",
          creatureRate: 0,
					mineralRate: 0,
          biomes: biomes['plains'],
          creatures: null,
					minerals: null
        },
        "王族居住地": {
          UUID: "0002_",
          description: "帝國王族的居住地",
          creatureRate: 0,
					mineralRate: 0,
          biomes: biomes['plains'],
          creatures: null,
					minerals: null
        }
      }
		},
		"蓋耶諾恩": {
			UUID: "0002_",
      description: "帝國的第一個殖民星，現為全宇宙最繁華的星球\n在這裡，公民們可以盡情的狂歡，且賭博的收穫在這裡會有加成",
      area: {
				"密爾斯": {
          UUID: "0001_",
          description: "蓋耶諾恩的首都",
          creatureRate: 0,
					mineralRate: 0,
          biomes: biomes['plains'],
          creatures: {
						"夢蟲": {
							rate: 95,
							data: Creatures["夢蟲"]
						}
					},
					minerals: null
        }
			}
		},
		"凡格爾礦星": {
			UUID: "0003_",
      description: "出產各種稀有礦物",
      area: {
				"赤晶礦場": {
          UUID: "0001_",
          description: "出產赤晶體",
          creatureRate: 80,
					mineralRate: 80,
          biomes: biomes['caves'],
          creatures: null,
					minerals: {
						"赤晶體":{
							rate: 70,
							data: Objects["赤晶體"]
						}
					}
        },
				"冰源礦場": {
          UUID: "0002_",
          description: "出產冰源能晶",
          creatureRate: 80,
					mineralRate: 80,
          biomes: biomes['caves'],
          creatures: null,
					minerals: {
						"冰源礦":{
							rate: 70,
							data: Objects["冰源能晶"]
						}
					}
        },
				"墨鋼礦場": {
          UUID: "0003_",
          description: "出產墨鋼",
          creatureRate: 80,
					mineralRate: 80,
          biomes: biomes['caves'],
          creatures: {
						"電晶蟻": {
							rate: 90,
							data: Creatures["電晶蟻"]
						},
						"裝甲電晶蟻": {
							rate: 95,
							data: Creatures["裝甲電晶蟻"]
						},
						"雷霆嗜殺蟻": {
							rate: 99,
							data: Creatures["雷霆嗜殺蟻"]
						}
					},
					minerals: {
						"墨鋼礦":{
							rate: 70,
							data: Objects["墨鋼"]
						}
					}
        }
			}
		},
		"卡美洛": {
			UUID: "0004_",
      description: "",
      area: {
				
			}
		},
		"奧林帕斯": {
			UUID: "0005_",
      description: "",
      area: {
				
			}
		},
		"尤格多拉希爾": {
			UUID: "0006_",
      description: "",
      area: {
				
			}
		},
		"瑪阿特": {
			UUID: "0007_",
      description: "",
      area: {
				
			}
		},
		"迦南": {
			UUID: "0008_",
      description: "",
      area: {
				
			}
		},
		"葦原中地": {
			UUID: "0009_",
      description: "",
      area: {
				
			}
		},
		"烏魯克": {
			UUID: "00010_",
      description: "",
      area: {
				
			}
		},
		"波波爾烏": {
			UUID: "00011_",
      description: "",
      area: {
				
			}
		},
		"納塔羅闇": {
			UUID: "00012_",
      description: "",
      area: {
				
			}
		},
		"阿卡姆": {
			UUID: "00013_",
      description: "",
      area: {
				
			}
		},
  }
};