const random = require('./random.js');

/* 生成生物數據
    小怪的數據要隨著使用者的等級變化
    有5種 弱 中下 中 中上 強
*/
const gMonster = (monster, level) => {
    let lv = random(5) - 2;
    let { hp, atk, def, dodge, lvLimit, falls } = monster;
    let m_lv = null;

    if (level < lvLimit[0]) {
        m_lv = lvLimit[0];
    } else if (level > lvLimit[1]) {
        m_lv = lvLimit[1];
    }
    m_lv = (m_lv + lv) > 0 ? (m_lv + lv) : 1;

    return {
        lv: m_lv,
        hp: Math.round(95 + hp * m_lv + random(level * 5)),
        atk: Math.round(5 + atk * m_lv + random(level * 5)),
        def: Math.round(5 + def * m_lv + random(level * 5)),
        dodge: Math.round(5 + dodge * m_lv + random(level * 5)),
        damage: null
    }
}

module.exports = {
    monster: gMonster
}