// 玩家相關
module.exports = {
	types: [
		"基本型",
		"強襲型",
		"潛伏型",
		"指揮型",
		"裝甲型",
	],
	attribute: {
		HEA: {
	        name: "血",
			mean: "生命值",
			description: "血量隨著等級或武器特效而升降，且不會自然恢復，需要食用藥水或進入安全屋"
		},
		STR: {
	        name: "勢",
			mean: "攻擊力",
			description: "空手攻擊時能造成的傷害"
	    },
		SOR: {
			name: "靈",
			mean: "能量量值、能量攻擊力",
			description: "隨職業而有所不同，當前靈量越高，魔法傷害也就越高"
		},
	    VIT: {
	        name: "體",
			mean: "防禦力、藥水功率",
			description: ""
	    },
	    INT: {
	        name: "睿",
			mean: "魔法防禦、幸運度",
			description: ""
	    },
	    VEL: {
	        name: "迅",
			mean: "閃避率",
			description: ""
	    },
	    append: {
	    }
	}
};