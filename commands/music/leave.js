const {
	functions: { log }
} = require("./../../lib/index.js");

module.exports = {
  num: 14,
  name: ["離開", "leave"],
  type: "music",
  expectedArgs: "",
  description: "離開所在語音頻道",
  minArgs: 0,
  maxArgs: 0,
  level: null,
  cooldown: 5,
  requireItems: [],
  requireBotPermissions: ["CONNECT"],
  async execute(msg, args, client, user) {
    try {
			await client.music.leave(msg);
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}