const Discord = require('discord.js');
require('discord-inline-reply');
const config = require('./data/config.json');
const User = require('./model/User.js');
const checkRequire = require('./database/checkRequire.js');
const loadUser = require('./database/loadUser.js');
const express = require('express');
const fs = require('fs');
var mongoose = null;

const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('link start!'));
app.listen(port, () => console.log(`連接至http://localhost:${port}`));

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

// 指令註冊
let commandList = [];
let commandFolders = fs.readdirSync('./commands');
for (let folder of commandFolders) {
  let commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (let file of commandFiles) {
    let command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.num, command);
    commandList.push(`${command.num}. ${command.name[0]}`);
  }
}

client.on('ready', async () => {
  console.clear();
  console.log(config.console_prefix +"core 啟動中");
  console.time(config.system_time);
  await client.user.setPresence({
    status: "online"
  });
  await client.user.setActivity("系統上線", {
    type: "PLAYING"
  });

  console.log(config.console_prefix +"連結至雲端資料庫");
  mongoose = await require('./database/connect.js')();

  console.log(config.console_prefix + "檢查指令");
  commandList = commandList.sort((a, b) => {
    return Number(a.split('.')[0]) - Number(b.split('.')[0]);
  }).join('\n');
  console.log(commandList);
  
  fs.writeFile('./command.txt', commandList, function(err){
    if(err) console.log(err);
  });

  console.log(config.console_prefix +"core 系統 all green");
  console.timeLog(config.system_time);
});


client.on('message', async msg => {
  if (!msg.content.startsWith(config.prefix)) return;
  let { member, content, guild } = msg;
  let str = msg.content.slice(config.prefix.length).trim().split(/ +/);
  let commandName = str.shift().toLowerCase();
  let args = content.split(/[ ]+/);
  args.shift();
  let cmd =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.name && cmd.name.includes(commandName)
    );

  if (!cmd) return;

  if (args.length < cmd.minArgs || (cmd.maxArgs !== null && args.length > cmd.maxArgs)) {
    msg.lineReply(`**參數錯誤**\n需求 :**<command> ${cmd.expectedArgs}**`)
    return;
  }

  let { cooldowns } = client;

  if (!cooldowns.has(cmd.num)) {
    cooldowns.set(cmd.num, new Discord.Collection());
  }

  let now = Date.now();
  let timestamps = cooldowns.get(cmd.num);

  let cooldownAmount = (cmd.cooldown || 3) * 1000;

  if (timestamps.has(msg.author.id)) {
    let expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

    if (now < expirationTime) {
      let timeLeft = (expirationTime - now) / 1000;
      return msg.lineReply(`指令冷卻中，請於**${timeLeft.toFixed(1)}**秒後再次嘗試`);
    }
  }
  timestamps.set(msg.author.id, now);
  setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

  try {
    let user = await loadUser(msg.author.id, User);
    if (!user) {
      user = null;
      if (cmd.requireObject.length > 0 || (cmd.level && cmd.level > 1)) {
        if (cmd.level > 1 && user.level < cmd.level) {
          msg.lineReply(`等級需求：**${cmd.level}　級**`);
          return;
        }
        if (cmd.requireObject.length > 0) {
          let have = await checkRequire(msg, user, cmd.requireObject);
          if (!have) return;
        }
      }
    } else {
      if (cmd.requireObject.length > 0 || (cmd.level && cmd.level > 1)) {
        if (cmd.level > 1 && user.level < cmd.level) {
          msg.lineReply(`等級需求：**${cmd.level}　級**`);
          return;
        }
        if (cmd.requireObject.length > 0) {
          let have = await checkRequire(msg, user, cmd.requireObject);
          if (!have) return;
        }
      }
    }
    cmd.execute(msg, args, user, User);
  } catch (error) {
    console.error(error);
    msg.lineReply(config.error_str);
  }

});

client.login(process.env.token).catch((err) => {
  console.log(err);
})