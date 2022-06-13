const fs = require('fs');
const express = require('express');
const { Client, Intents, Collection } = require('discord.js');

const config = require("./config.js");

const { database: { connect }} = require("./lib/index.js");

(async () => {
	const client = new Client({
	  intents: [
	    Intents.FLAGS.GUILDS,
	    Intents.FLAGS.GUILD_MESSAGES,
	    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			Intents.FLAGS.GUILD_VOICE_STATES
	  ]
	});
	
	client.login(process.env.token);
	
	// 事件監聽
	console.log(config["console_prefix"] + "載入事件監聽");
	require("./events/index.js")(client);

	const app = express();
	app.get('/', (req, res) => {
		res.send('link start!');
	});
	
	app.listen(config['port'], () => {
		console.log(config["console_prefix"] + `連接至 https://core.coretw.repl.co:${config['port']}`)
	});
	
	module.exports = client;
})();
