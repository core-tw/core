const {
	functions: { log }
} = require("./../../lib/index.js");

module.exports = {
  num: 17,
  name: ["播放隊伍", "播放隊列", "隊伍", "隊列", "queue", "now"],
  type: "music",
  expectedArgs: "",
  description: "現正播放的列表",
  minArgs: 0,
  maxArgs: 0,
  level: null,
  cooldown: 10,
  requireItems: [],
  requireBotPermissions: [],
  async execute(msg, args, client, user) {
    try {
			await client.music.queue(msg);
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}