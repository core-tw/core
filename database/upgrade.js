const { xpIncreaseRate } = require('./../setting.json');
const { Player } = require('./../_enum_.js');
module.exports = (user) => {
	user.level += 1;
	user.xp = 0;
	user.reqxp = Math.round(user.reqxp * xpIncreaseRate);
						
	let L = user.level / 10;
	let fL = Math.floor(L);
	let a = (L - fL);
							
	user.stat.tHEA = Math.round((user.level <= 10) ? (100 + user.level) : (0.5 * fL * ((20 * pow(a, 2)) + 10 * fL + user.level)) + 100);
						
	let upg = Player.types[Player.typesList[user.type]].upgrade;
						
	user.stat.tSOR += upg.SOR;
	user.stat.tSTR += upg.STR;
	user.stat.tVIT += upg.VIT;
	user.stat.tINT += upg.INT;
	user.stat.tVEL += upg.VEL;
						
	user.stat.SOR += upg.SOR;
	user.stat.STR += upg.STR;
	user.stat.VIT += upg.VIT;
	user.stat.INT += upg.INT;
	user.stat.VEL += upg.VEL;
}