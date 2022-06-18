const {
	functions: { log }
} = require("./../../lib/index.js");

module.exports = {
  num: 18,
  name: ["恢復播放", "恢復", "resume"],
  type: "music",
  expectedArgs: "",
  description: "繼續播放歌曲",
  minArgs: 0,
  maxArgs: 0,
  level: null,
  cooldown: 5,
  requireItems: [],
  requireBotPermissions: [],
  async execute(msg, args, client, user) {
    try {
			await client.music.resume(msg);
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}