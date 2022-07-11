const { items } = require("./../../objects/index.js");

// 玩家相關
const attribute = {
    HEA: {
        name: "血",
        description: "",
    },
    STR: {
        name: "勢",
        description: "",
    },
    SOR: {
        name: "靈",
        description: "",
    },
    VIT: {
        name: "體",
        description: "",
    },
    INT: {
        name: "睿",
        description: "",
    },
    VEL: {
        name: "迅",
        description: "",
    },
    LUK: {
        name: "運",
        description: "",
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
        },
        "領航者": {
            description: "可御駛星艦",
        },
        "傀儡師": {
            description: "擁有操控類技能",
        },
        "暗殺者": {
            description: "擁有潛行類技能",
        },
        "刻印師": {
            description: "擁有製造類技能",
        },
        "控能師": {
            description: "擁有能量控制類技能",
        },
        "藥劑師": {
            description: "擁有修補、治癒類技能",
        },
        "槍砲師": {
            description: "擁有槍砲類技能 ",
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