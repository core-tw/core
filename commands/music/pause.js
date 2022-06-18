const {
	functions: { log }
} = require("./../../lib/index.js");

module.exports = {
  num: 15,
  name: ["暫停播放", "暫停", "pause"],
  type: "music",
  expectedArgs: "",
  description: "暫停播放",
  minArgs: 0,
  maxArgs: 0,
  level: null,
  cooldown: 5,
  requireItems: [],
  requireBotPermissions: [],
  async execute(msg, args, client, user) {
    try {
			await client.music.pause(msg);
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}