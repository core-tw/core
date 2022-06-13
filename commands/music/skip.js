const {
	functions: { log }
} = require("./../../lib/index.js");

module.exports = {
  num: 19,
  name: ["跳過歌曲", "跳過", "skip"],
  type: "music",
  expectedArgs: "",
  description: "跳過正在播放的歌曲",
  minArgs: 0,
  maxArgs: 0,
  level: null,
  cooldown: 10,
  requireItems: [],
  requireBotPermissions: [],
  async execute(msg, args, client, user) {
    try {
			await client.music.skip(msg);
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}