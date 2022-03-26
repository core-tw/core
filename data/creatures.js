// 各種生物，使用星球、地圖來分類，採用模板
// 等級預設為1，每一等就增加固定的數據
/*
	hp: 
	atk: 
	def: 
	rate:
	lvLimit: 10,
	descrition: 
*/
module.exports = {
	"母星": {
		"韋瓦恩": {
			"電晶蟻": {
				hp: 5,
				atk: 1,
				def: 1,
				rate: 90,
				lvLimit: [1, 10],
				descrition: "體長兩公尺以上，前顎強而有力，並能釋放體內儲存的電力來電死敵人"
			}
		}
	}
}