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
	    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
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





/* 檢查所有物品

const { log, errorEmbed } = require('./_functions_.js');
const { Users, Items, Banks } = require('./_models_.js');
const { Player, UUID_PREFIX, Maps, Reactions } = require('./_enum_.js');
const { loadUser } = require('./_database_.js');
const { floor, random, round, pow } = Math;

let itemList = [];
let itemFiles = fs.readdirSync('./objects/items').filter(file => file.endsWith('.json'));
for (let file of itemFiles) {
  let f = JSON.parse(
    fs.readFileSync(`./objects/items/${file}`, 'utf-8')
  )
  for (let w in f) {
    itemList.push(
      `${f[w]['id']}. ${w} | ${f[w]["type"]} | ${f[w]["volume"]}`
    );
  }
}
*/



