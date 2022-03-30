const Discord = require('discord.js');
const { Users } = require('./../../_models_.js');
const { log } = require('./../../_functions_.js');
const {
	Maps,
	Player,
	GameInfo,
	UUID_PREFIX
} = require('./../../_enum_.js');
const config = require('./../../config.json');

// 為遊戲註冊帳號
module.exports = {
	num: 0,
	name: ['遊戲開始', '開始遊戲', 'start', 's'],
	type: "start",
	expectedArgs: '',
	description: '開始冒險吧～',
	minArgs: 0,
	maxArgs: 0,
	level: null,
	cooldown: 60000,
	requireItems: [],
	requireBotPermissions: ["MANAGE_MESSAGES"],
	async execute(msg, args, client, user) {
	    try {
			msg.react('✅');			
			if(user) {
				msg.reply({
					content: `您已經擁有帳戶了喔`,
					allowedMentions: config.allowedMentions
				});
				return;
			}
			// 順序：名子 -> 性別 -> 機型
			let player = {
				name: null,
				male: true,
				type: 0
			};
			let embed = new Discord.MessageEmbed()
		      	.setTitle(`╠══╬══ Creating player ══╬══╣`)
				.setColor(config.embedColor.normal)
				.setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
		     	.setThumbnail(msg.author.displayAvatarURL())
				.setDescription(`請直接輸入你的暱稱：`)
		      	.setFooter({
					text: "此訊息將在2分鐘後失效"					
				})
	      		.setTimestamp();
			
			let m = await msg.channel.send({
				embeds: [embed]
			});

			// 姓名
			let filter = (m) => {
				if(m.author.id === msg.author.id) {
					player['name'] = m.content;
					m.delete();
					return true;
				}
				return false;
			}
			await msg.channel.awaitMessages({
				filter: filter,
				max: 1,
				time: 120000,
				errors: ['time']
			}).catch(err=>{});

			// 性別
			filter = (reaction, user) => {
				if(user.id === msg.author.id) {
					if (reaction.emoji.name == "♂️") {
				        player['male'] = true;
				        return true;
				    } else if (reaction.emoji.name == "♀️") {
				        player['male'] = false;
				        return true;
				    }
				}
				return false;
			}
			embed
				.setDescription(
					`暱稱 - **${player['name']}**\n` +
					`請反應下的表情符號決定性別 ♂️／♀️`)
        		.setTimestamp();
			await m.react('♂️');
      		await m.react('♀️');
			await m.edit({
				embeds: [embed]
			});
			await m.awaitReactions({ 
				filter: filter,
				max: 1,
				time: 120000,
				errors: ['time']
			}).catch(err=>{});

			// 機型
			filter = (reaction, user) => {
				if(user.id === msg.author.id) {
					let cases = {
						'1️⃣': 0,
				        '2️⃣': 1,
				        '3️⃣': 2,
				        '4️⃣': 3,
				        '5️⃣': 4
					}
					if(cases[reaction.emoji.name]) {
						player['type'] = cases[reaction.emoji.name];
						return true;
					}
				}
				return false;
			}
			let types = "";
			for(let t in Player.typesList) {
				types += `\n${Number(t)+1}. ${Player.typesList[t]}`;
			}
			embed
				.setDescription(
					`暱稱 - **${player['name']}**\n` +
					`性別 - **${player['male']? "男性" : "女性"}**\n` +
					`請反應下的表情符號決定機型` +
					types
				)
        		.setTimestamp();
			await m.reactions.removeAll();
			await m.react('1️⃣');
		    await m.react('2️⃣');
		    await m.react('3️⃣');
		    await m.react('4️⃣');
		    await m.react('5️⃣');
			await m.edit({
				embeds: [embed]
			});
			await m.awaitReactions({ 
				filter: filter,
				max: 1,
				time: 120000,
				errors: ['time']
			}).catch(err=>{});

			// 結束
			embed
		      	.setTitle(``)
				.setDescription(
					`暱稱 - **${player['name']}**\n` +
					`性別 - **${player['male']? "男性" : "女性"}**\n` +
					`機型 - **${Player.typesList[player.type]}**` +
					GameInfo.data
				)
		      	.setFooter({
					text: ""
				})
	      		.setTimestamp();
			await m.reactions.removeAll();
			await m.edit({
				embeds: [embed]
			});
			let newUser = new Users({
				userId: msg.author.id,
				name: player['name'] || msg.author.tag,
				male: player['male'],
				type: player['type'],
				planet: 
					UUID_PREFIX['Maps'] + 
					Maps['planet']['母星'].UUID,
				area:
					UUID_PREFIX['Maps'] +
					Maps['planet']['母星'].UUID +
					Maps['planet']['母星']['area']['韋瓦恩'].UUID,
			});
			//newUser.save();
		} catch (err) {
			console.log(err);
			log(client, err.toString());
		}
  	}
}