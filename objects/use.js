var obj = {};/*
const Maps = require("./../lib/enum/maps.js");
const UUID_PREFIX = require("./../lib/enum/UUID_PREFIX.js");
const errorEmbed = require("./../lib/functions/errorEmbed.js");
const log = require("./../lib/functions/log.js");
const wait = require("./../lib/functions/wait.js");
const setting = require("./../config/setting.json");

obj["傳送水晶"] = async (msg, args, user) => {
	const { author, channel } = msg;
	if(!args[1]) {
		errorEmbed(channel, author, null, `未輸入目標星球名`);
    return;
	}
  if (!Maps.planet[args[1]]) {
   	errorEmbed(channel, author, null, `查無此星球 **${args[1]}**`);
    return;
  }
	let m = await msg.reply({
    content: `傳送中...`,
    allowedMentions: setting.allowedMentions
  });
	await wait(3000);
	user.planet = UUID_PREFIX["Maps"] + Maps.planet[args[1]].UUID;
	let area = Object.keys(Maps.planet[args[1]].area)[0]
  user.area = user.planet + Maps.planet[args[1]].area[area].UUID;
	m.edit({
    content: `已抵達 ${args[1]} ${area}`,
    allowedMentions: setting.allowedMentions
  })
}*/

module.exports = obj;