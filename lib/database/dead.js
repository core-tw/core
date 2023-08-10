// const Maps = require("./../enum/maps.js");
const Reactions = require("./../enum/reaction.js");
const UUID_PREFIX = require("./../enum/UUID_PREFIX.js");
const setting = require("./../../config/setting.json");

// 角色死亡
module.exports = (msg, user) => {
    let r_coin = setting.coinToDetain * user.level;
    let byBank = false;
    let byXp = false;

    user.stat.HEA = user.stat.tHEA;
    user.planet = UUID_PREFIX["Maps"] + Maps["planet"]["母星"].UUID;
    user.area = user.planet + Maps["planet"]["母星"]["area"]["韋瓦恩"].UUID;

    if (user.coin >= r_coin) {
        user.coin -= r_coin;
    } else {
        if (user.bank && user.bank.coin >= r_coin) {
            byBank = true;
            user.bank.coin -= r_coin;
        } else {
            byXp = true;
            user.xp -= r_coin * 100;
            user.xp = user.xp < 0 ? 0 : user.xp;
        }
    }

    // 生成句子
    let str = Reactions.sentences[
        Math.floor(Math.random() * Reactions.sentences.length)
    ];
    console.log(str)
    console.log(Reactions.tags.name, user.name)
    console.log(Reactions.tags.gender, user.male ? "男子" : "女子")
    str.replace(Reactions.tags.name, user.name)
        .replace(Reactions.tags.gender, user.male ? "男子" : "女子");

    msg.channel.send(str);
}