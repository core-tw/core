const fs = require('fs');
const express = require('express');
const config = require('./config.json');
const setting = require('./setting.json');// 重要常數設定

const { log, errorEmbed } = require('./_functions_.js');
const { Users, Items, Banks } = require('./_models_.js');
const { Player, UUID_PREFIX, Maps, Reactions } = require('./_enum_.js');
const { loadUser } = require('./_database_.js');
const { Client, Intents, Collection } = require('discord.js');
const { floor, random, round, pow } = Math;

const app = express();
const port = process.env.port || 3000;
app.get('/', (req, res) => res.send('link start!'));
app.listen(port, () => console.log(`連接至http://localhost:${port}`));

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ]
});

client.commands = new Collection();
client.cooldowns = new Collection();

// 將指令添加進Collection
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

// 檢查所有物品
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

client.on('ready', async () => {
  console.clear();
  console.log(config.console_prefix + "core 啟動中");
  console.time(config.system_time);
  await client.user.setPresence({
    status: "online"
  });
  await client.user.setActivity("RPG", {
    type: "PLAYING"
  });

  console.log(config.console_prefix + "連結至雲端資料庫");
  mongoose = await require('./_database_.js').connect();

	console.log(config.console_prefix + "檢查指令");
  commandList = commandList.sort((a, b) => {
    return Number(a.split('.')[0]) - Number(b.split('.')[0]);
  }).join('\n');
  fs.writeFile('./check/commands.txt', commandList, (err) => {
    if (err) console.log(err);
	});
});


client.on('messageCreate', async msg => {
  let {
    content,
    author,
    channel
  } = msg;

  try {
    if (!content.startsWith(config.prefix)) return;
    if (author === client.user) return;

    let args = content.slice(config.prefix.length).trim().split(/ +/);
    let commandName = args.shift().toLowerCase();
    let cmd =
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.name && cmd.name.includes(commandName));

    if (!cmd) return;

    for (let p in cmd.requireBotPermissions) {
      if (!msg.guild.me.permissions.has(cmd.requireBotPermissions[p])) {
        errorEmbed(channel, author, `權限錯誤`, `需求 :**${cmd.requireBotPermissions[p]}**`);
        return;
      }
    }

    if (args.length < cmd.minArgs || (cmd.maxArgs !== null && args.length > cmd.maxArgs)) {
      errorEmbed(channel, author, `參數錯誤`, `需求 :**<command> ${cmd.expectedArgs}**`)
      return;
    }

    let { cooldowns } = client;

    if (!cooldowns.has(cmd.num)) {
      cooldowns.set(cmd.num, new Collection());
    }

    let now = Date.now();
    let timestamps = cooldowns.get(cmd.num);

    let cooldownAmount = (cmd.cooldown || 3) * 1000;

    if (timestamps.has(author.id)) {
      let expirationTime = timestamps.get(author.id) + cooldownAmount;

      if (now < expirationTime) {
        let timeLeft = (expirationTime - now) / 1000;
        msg.reply({
          content: `指令冷卻中，請於 **${timeLeft.toFixed(1)}** 秒後再次嘗試`,
          allowedMentions: config.allowedMentions
        });
        return;
      }
    }
    timestamps.set(author.id, now);
    setTimeout(() => timestamps.delete(author.id), cooldownAmount);

    const user = await loadUser(author.id);

    if (user) {
			// 偵測死亡
			if (user.stat.HEA <= 0) {
				dead(user);
				user.save();
				return
			}
			
      // 偵測物件
    }
    await cmd.execute(msg, args, client, user);
  } catch (err) {
    log(client, err.toString());
  } finally {

  }
});


client.login(process.env.token);

module.exports = client;

const dead = (user) => {
	let r_coin = setting.coinToDetain * user.level;
  let byBank = false;
  let byXp = false;
	
  user.stat.HEA = user.stat.tHEA;
  user.planet = UUID_PREFIX['Maps'] + Maps['planet']['母星'].UUID;
  user.area = user.planet + Maps['planet']['母星']['area']['韋瓦恩'].UUID;

  if (user.coin >= r_coin) {
    user.coin -= r_coin;
  } else {
    if (user.bank && user.bank.coin >= r_coin) {
      byBank = true;
      user.bank.coin -= r_coin;
    } else {
      byXp = true;
      user.xp -= r_coin * 100;
    }
  }
	
	// 生成句子
  let str = Reactions.sentences[
    Math.floor(Math.random() * Reactions.sentence.length)
  ];
  str.replace(Reactions.tags.name, updateUser.name)
    .replace(Reactions.tags.gender, updateUser.male ? "男子" : "女子");

  msg.channel.send(str);
}