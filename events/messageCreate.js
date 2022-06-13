const config = require("./../config.js");
const setting = require("./../config/setting.json");
const {
	functions: {
		errorEmbed,
		log
	},
	database: {
		dead,
		loadUser
	}
} = require("./../lib/index.js");
const { Collection } = require("discord.js");

module.exports = {
	name: 'messageCreate',
	once: false,
  async execute(msg, client) {
		try {
			let { author, channel, content, guild } = msg;

			if (author === client.user) return;
			
			if(!client.servers[guild.id]) {
				// 新的伺服器
				client.servers[guild.id] = {
					enableNlp: false
				}

				client.db.set("servers", client.servers).then(() => {
					log(client, "已將伺服器 `" + guild.name + "` 加入設定檔");
				});
			}
		
			if(client.servers[guild.id].enableNlp) {
				// Nlp系統
				
				return;
			}
		
	    if (!content.startsWith(setting.prefix)) return;
	    
	
	    let args = content.slice(setting.prefix.length).trim().split(/ +/);
	    let commandName = args.shift().toLowerCase();
	    let cmd =
	      client.commands.get(commandName) ||
	      client.commands.find((cmd) => cmd.name && cmd.name.includes(commandName));
	
	    if (!cmd) return;
			if(
				cmd.type == "admin" && 
				!config.admin_id.includes(author.id)
			) return;
	
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

			if(cmd.cooldown) {
				let now = Date.now();
		    let timestamps = cooldowns.get(cmd.num);
		
		    let cooldownAmount = cmd.cooldown * 1000;
		
		    if (timestamps.has(author.id)) {
		      let expirationTime = timestamps.get(author.id) + cooldownAmount;
		
		      if (now < expirationTime) {
		        let timeLeft = (expirationTime - now) / 1000;
		        msg.reply({
		          content: `指令冷卻中，請於 **${timeLeft.toFixed(1)}** 秒後再次嘗試`,
		          allowedMentions: setting.allowedMentions
		        });
		        return;
		      }
		    }
		    timestamps.set(author.id, now);
		    setTimeout(() => timestamps.delete(author.id), cooldownAmount);
			}
	    
	
	    const user = await loadUser(author.id);
	    if (user) {
				// 偵測死亡
				if (user.stat.HEA <= 0) {
					dead(msg, user);
					user.save();
					return
				}
	      // 偵測物件
	    }
	    await cmd.execute(msg, args, client, user);
	  } catch (err) {
			console.log(err)
	    log(client, err.toString());
	  } finally {
	
	  }
	}
}