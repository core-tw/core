// 玩家相關
const attribute = {
	HEA: {
	    name: "血",
		description: "",
		initial: 100
	},
	STR: {
	    name: "勢",
		description: "",
		initial: 40
	},
	SOR: {
		name: "靈",
		description: "",
		initial: 20
	},
	VIT: {
	    name: "體",
		description: "",
		initial: 10
	},
	INT: {
	    name: "睿",
		description: "",
		initial: 5
	},
	VEL: {
	    name: "迅",
		description: "",
		initial: 10
	}
}

module.exports = {
	typesList: [
		"基本型",
		"強襲型",
		"潛伏型",
		"指揮型",
		"裝甲型"
	],
	types: {
		"基本型": {
			upgrade: {
				// 血量都一樣
				// 會等差的是公差
				// 這裡是等差的公差
				HEA: 0,
				STR: 2,
				SOR: 2,
				VIT: 2,
				INT: 2,
				VEL: 2
			}
		},
		"強襲型": {
			upgrade: {
				HEA: 0,
				STR: 4,
				SOR: 1,
				VIT: 1,
				INT: 1,
				VEL: 3
			}
		},
		"潛伏型": {
			upgrade: {
				HEA: 0,
				STR: 1,
				SOR: 3,
				VIT: 1,
				INT: 1,
				VEL: 4
			}
		},
		"指揮型": {
			upgrade: {
				HEA: 0,
				STR: 1,
				SOR: 3,
				VIT: 1,
				INT: 4,
				VEL: 1
			}
		},
		"裝甲型": {
			upgrade: {
				HEA: 0,
				STR: 3,
				SOR: 1,
				VIT: 4,
				INT: 1,
				VEL: 1
			}
		},
	},
	attribute: attribute
};