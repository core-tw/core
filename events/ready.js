const config = require("./../config.js");
const { Collection } = require("discord.js");
const { database: { connect }} = require("./../lib/index.js");

module.exports = {
	name: 'ready',
	once: true,
  async execute(client) {
		//console.clear();
	  console.log(config.console_prefix + "core 啟動中");
	  console.time(config.system_time);
	  await client.user.setPresence({
	    status: "online"
	  });
	  await client.user.setActivity("RPG", {
	    type: "PLAYING"
	  });
	
	  console.log(config.console_prefix + "連結至雲端資料庫");
	  await connect();
	
		console.log(config.console_prefix + "正在載入指令");
		// 將指令添加進Collection
		client.commands = await require("./../commands/index.js")();
		console.log(config.console_prefix + "指令生成完畢，已輸入至 ./log/commands.txt");

		console.log(config.console_prefix + "重置指令冷卻");
		client.cooldowns = new Collection();
		// 指令冷卻的Collection
	}
}