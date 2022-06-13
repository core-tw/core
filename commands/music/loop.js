const {
	functions: { errorEmbed, log }
} = require("./../../lib/index.js");

module.exports = {
  num: 20,
  name: ["切換循環", "循環", "loop"],
  type: "music",
  expectedArgs: "<off / track / queue / autoplay>",
  description: "跳過正在播放的歌曲",
  minArgs: 0,
  maxArgs: 1,
  level: null,
  cooldown: 10,
  requireItems: [],
  requireBotPermissions: [],
  async execute(msg, args, client, user) {
    try {
			let { author, channel } = msg;
			let mode = (args[0] || "OFF").toUpperCase();
			if(!["OFF", "TRACK", "QUEUE", "AUTOPLAY"].includes(mode)) {
				errorEmbed(channel, author, "參數錯誤", "只接受以下4種參數: `off / track / queue / autoplay`");
				return;
			}
			await client.music.loop(msg, mode);
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}