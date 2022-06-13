const {
	functions: { log }
} = require("./../../lib/index.js");

module.exports = {
  num: 16,
  name: ["播放歌曲", "播放", "play"],
  type: "music",
  expectedArgs: "<歌曲關鍵字 / 連結>",
  description: "播放歌曲",
  minArgs: 1,
  maxArgs: null,
  level: null,
  cooldown: 10,
  requireItems: [],
  requireBotPermissions: ["SPEAK"],
  async execute(msg, args, client, user) {
    try {
			await client.music.play(msg, args.join(" "));
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}