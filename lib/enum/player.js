const { items } = require("./../../objects/index.js");

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
    initial: 10
  },
  SOR: {
    name: "靈",
    description: "",
    initial: 10
  },
  VIT: {
    name: "體",
    description: "",
    initial: 10
  },
  INT: {
    name: "睿",
    description: "",
    initial: 10
  },
  VEL: {
    name: "迅",
    description: "",
    initial: 10
  }
};

const classes = {
	list: [
	  "學徒級",
	  "騎士級",
	  "夜空級",
	  "微光級",
	  "星光級",
	  "星屑級",
	  "皓月級",
	  "炎陽級",
	  "域主級",
	  "宙王級",
	  "不朽",
	],
	need: {
		"學徒級": null,
		"騎士級": {
			"母星通行證": {
				amount: 1,
				data: items.data["母星通行證"]
			}
		}
	}
};

module.exports = {
  typesList: [
		"駭客",
		"領航者",
		"傀儡師",
		"暗殺者",
		"刻印師",
		"控能師",
		"藥劑師",
		"槍砲師"
  ],
  types: {
    "駭客": {
			description: "可破解星艦或電子設備的防火牆，較高級者甚至能搶奪其掌控權",
      upgrade: {
        HEA: 0,
        STR: 0,
        SOR: 0,
        VIT: 0,
        INT: 0,
        VEL: 0
      }
    },
		"領航者": {
			description: "可御駛星艦",
      upgrade: {
        HEA: 0,
        STR: 0,
        SOR: 0,
        VIT: 0,
        INT: 0,
        VEL: 0
      }
    },
		"傀儡師": {
			description: "擁有操控類技能",
      upgrade: {
        HEA: 0,
        STR: 0,
        SOR: 0,
        VIT: 0,
        INT: 0,
        VEL: 0
      }
    },
		"暗殺者": {
			description: "擁有潛行類技能",
      upgrade: {
        HEA: 0,
        STR: 0,
        SOR: 0,
        VIT: 0,
        INT: 0,
        VEL: 0
      }
    },
		"刻印師": {
			description: "擁有製造類技能",
      upgrade: {
        HEA: 0,
        STR: 0,
        SOR: 0,
        VIT: 0,
        INT: 0,
        VEL: 0
      }
    },
		"控能師": {
			description: "擁有能量控制類技能",
      upgrade: {
        HEA: 0,
        STR: 0,
        SOR: 0,
        VIT: 0,
        INT: 0,
        VEL: 0
      }
    },
		"藥劑師": {
			description: "擁有修補、治癒類技能",
      upgrade: {
        HEA: 0,
        STR: 0,
        SOR: 0,
        VIT: 0,
        INT: 0,
        VEL: 0
      }
    },
		"槍砲師": {
			description: "擁有槍砲類技能 ",
      upgrade: {
        HEA: 0,
        STR: 0,
        SOR: 0,
        VIT: 0,
        INT: 0,
        VEL: 0
      }
    }
  },
  attribute: attribute,
	classes: classes,
  status: {
    "BURN_": {
      name: "燒傷",
    }
  }
};