const Discord = require('discord.js');
require('discord-inline-reply');
const config = require('./data/config.json');
const express = require('express');
const fs = require('fs');
var mongoose = undefined;

const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('link start!'));
app.listen(port, () => console.log(`連接至http://localhost:${port}`));

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

// 指令註冊
let commandFolders = fs.readdirSync('./commands');
for (let folder of commandFolders) {
  let commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (let file of commandFiles) {
    let command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.num, command);
  }
}

client.on('ready', async() => {
  console.clear();
  console.log("|- core 啟動中");
  console.time(config.system_time);
  await client.user.setPresence({
      status: "online"
  });
  await client.user.setActivity( "系統上線" , {
    type: "PLAYING"
  });

  console.log("|- 連結至雲端資料庫");
  mongoose = await require('./linkDatabase.js')();
  console.log("|- core 系統 all green");
  console.timeLog(config.system_time);
});


client.on('message', message => {
  if (!message.content.startsWith(config.prefix)) return;
  let { member, content, guild } = message;
  let args = message.content.slice(config.prefix.length).trim().split(/ +/);
  let commandName = args.shift().toLowerCase();
  let arguments = content.split(/[ ]+/);
  arguments.shift();
  let cmd =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.name && cmd.name.includes(commandName)
    );

  if (!cmd) return;

  let { cooldowns } = client;

  if (!cooldowns.has(cmd.num)) {
    cooldowns.set(cmd.num, new Discord.Collection());
  }

  let now = Date.now();
  let timestamps = cooldowns.get(cmd.num);

  let cooldownAmount = (cmd.cooldown || 3) * 1000;
  
  if (timestamps.has(message.author.id)) {
    let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      let timeLeft = (expirationTime - now) / 1000;
      return message.lineReply(`拜託了，請再等${timeLeft.toFixed(1)}秒吧！`);
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    switch(cmd.type) {
      case "game":
        cmd.execute(message);
        break;
      case "object":
        cmd.execute(message);
        break;
      case "others":
        cmd.execute(message);
        break;
    }
  } catch (error) {
    console.error(error);
    message.lineReply('系統錯誤，請洽系統管理員 櫻2#0915');
  }

});

client.login(process.env.token).catch((err)=>{
  console.log(err)
})