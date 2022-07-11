// 獲取升級所需的經驗值
module.exports = (level) => {
    let L = level / 10;
    let fL = Math.floor(L);
    let a = (L - fL);

    return Math.round((level <= 10) ? (100 + level) : (0.5 * fL * ((20 * pow(a, 2)) + 10 * fL + level)) + 100);
}