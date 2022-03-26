const { MessageEmbed } = require('discord.js');
const { Users } = require('./../../_models_.js');
const {
	area,
	errorEmbed,
	log,
} = require('./../../_functions_.js');
const {
	loadUser
} = require('./../../_database_.js');
const config = require('./../../config.json');

// 為遊戲註冊帳號
module.exports = {
	num: 2,
	name: ['面板', 'profile', 'p'],
	type: "normal",
	expectedArgs: '<@user (可無)>',
	description: '個人面板',
	minArgs: 0,
	maxArgs: 1,
	level: 1,
	cooldown: 0,//15,
	requireItems: [],
	requireBotPermissions: ["MANAGE_MESSAGES"],
	async execute(msg, args, client, user) {
	    try {
			await msg.react('✅');			
			if(!user) {
				msg.reply({
					content: `您還沒有帳戶喔`,
					allowedMentions: config.allowedMentions
				});
				return;
			}
			const {
				author,
				channel
			} = msg;
			const createEmbed = (user, icon) => {
				let a = area.getArea(user.area);
				if(!a) {
					errorEmbed(channel, author, null, config.error.no);
					return;
				}
			    let info = 
				    `**所在區域 -\\ ${a[0]} ${a[1]} \\ **
				    等級 － ${user.level}
				    經驗 － ${user.xp} / ${user.reqxp}`;
			
			    let body = `
					⨢血⨢ - ${user.hp} / ${user.thp}
			      	⨢靈⨢ - ${user.ep} / ${user.tep}
			      	⨢勢⨢ - ${user.stat.STR}
			      	⨢體⨢ - ${user.stat.VIT}
			      	⨢睿⨢ - ${user.stat.INT}
					⨢迅⨢ - ${user.stat.VEL}
			
			      	**${config.coinName}** - ${user.coin}`;
			      let embed = new MessageEmbed()
			        .setColor(config.embedColor.normal)
					.setAuthor({
						name: user.name,
						iconURL: icon
					})
			        .setDescription(info)
			        //.setThumbnail(icon)
			        .addFields([
			          	{
			            	name: "狀態欄",
			            	value: body,
			            	inline: true
			          	},
			          	{
			            	name: "裝備欄",
			            	value: `
			            	武裝 - ${user.armor==="null"?"無":user.armor}
			           		武器 - ${user.weapon==="null"?"無":user.weapon}
			            	`,
			            	inline: true
			          	}
			        ])
			        .setTimestamp();
			      return embed;
			}
			const wait = (ms) => {
				return new Promise(resolve => setTimeout(resolve, 5000));
			}
			const mention_user = msg.mentions.users.first();
		    if (mention_user) {
		      	const another_user = await loadUser(mention_user.id);
		      	if (!another_user) {
					msg.reply({
						content: config.error.notFindUser,
						allowedMentions: config.allowedMentions
					});
			 	 }
		      	let icon = mention_user.displayAvatarURL();
				msg.reply({
					embeds: [
						createEmbed(another_user, icon)
					],
					allowedMentions: config.allowedMentions
				});
		    } else {
		      	if (args[0]) {
		        	const another_user = await loadUser(args[0]);
		        	if (!another_user) {
						msg.reply({
							content: config.error.notFindUser,
							allowedMentions: config.allowedMentions
						});
						return;
					}
		        	let icon = mention_user.displayAvatarURL();
		        	msg.reply({
						embeds: [
							createEmbed(another_user, icon)
						],
						allowedMentions: config.allowedMentions
					});
		     	} else if (user) {
		        	let icon = author.displayAvatarURL();
			        msg.reply({
						embeds: [
							createEmbed(user, icon)
						],
						allowedMentions: config.allowedMentions
					});
		        	return;
		      	} else {
		        	msg.reply({
						content: config.error.notFindUser,
						allowedMentions: config.allowedMentions
					});
		      	}
		    }
		} catch (err) {
			console.log(err);
			log(client, err.toString());
		}
  	}
}