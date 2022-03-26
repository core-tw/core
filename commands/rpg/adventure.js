const { MessageEmbed } = require('discord.js');
const { Users } = require('./../../_models_.js');
const {
	area,
	errorEmbed,
	log,
	random
} = require('./../../_functions_.js');
const {
	Maps,
	Creatures,
} = require('./../../_enum_.js');
const config = require('./../../config.json');

// 為遊戲註冊帳號
module.exports = {
	num: 1,
	name: ['冒險', 'adventure', 'adv'],
	type: "normal",
	expectedArgs: '',
	description: '探索所在區域！',
	minArgs: 0,
	maxArgs: 0,
	level: 1,
	cooldown: 0,//15,
	requireItems: [],
	requireBotPermissions: [],
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
			const createEmbed = (title, content) => {
				let embed = new MessageEmbed()
					.setTitle(title)
					.setColor(config.embedColor.normal)
					.setDescription(content)
					.setFooter({
						text: author.tag
					})
					.setTimestamp();
				return embed;
			}
			const wait = (ms) => {
				return new Promise(resolve => setTimeout(resolve, 5000));
			}
			
			// 先取得玩家位置
			let a = area.getArea(user.area);
			if(!a) {
				errorEmbed(channel, author, null, config.error.no);
				return;
			}
			
			// 無生物
			let noCreatureName = null;
			if(!Creatures[a[0]]) noCreatureName = a[0];
			if(Creatures[a[0]] && !Creatures[a[0]][a[1]]) noCreatureName = a[1];

			if(noCreatureName) {
				msg.reply({
					embeds: [
						createEmbed(
							`${noCreatureName}似乎沒有任何生物呢......`,
							""
						)
					],
					allowedMentions: config.allowedMentions
				});
				return;
			}

			// 有機率找不到生物
			let rateToAppear = Maps['planet'][a[0]]['area'][a[1]]['rate'] || 0;
			if(random(100) >= rateToAppear) {
				await wait(5000);
				msg.reply({
					embeds: [
						createEmbed(
							`沒有發現到任何東西呢......`,
							""
						)
					],
					allowedMentions: config.allowedMentions
				});
				return;
			}
			
			// 隨機生物
			let monsters = Object.keys(Creatures[a[0]][a[1]]);
			let monsterName = monsters[random(monsters.length)];
			let monster = Creatures[a[0]][a[1]][monsterName];

			// 生物有機會直接逃跑
			if(random(100) >= monster['rate']) {
				await wait(5000);
				msg.reply({
					embeds: [
						createEmbed(
							`沒有發現到任何東西呢......`,
							""
						)
					],
					allowedMentions: config.allowedMentions
				});
				return;
			}

			// 生成生物數據
			/*
			小怪的數據要隨著使用者的等級變化
			有5種 弱 中下 中 中上 強
			*/
			let lv = random(5) - 2
			let {
				hp,
				atk,
				def,
				lvLimit
			} = monster;
			let m_lv = null;
			if(user.level < lvLimit[0]) {
				m_lv = lvLimit[0];
			} else if(user.level > lvLimit[1]) {
				m_lv = lvLimit[1];
			}
			m_lv += lv;
			m_lv = m_lv > 0 ? m_lv : 1;
			hp = Math.round(100 + hp * m_lv + random(user.level * 5));
			atk = Math.round(10 + atk * m_lv + random(user.level * 5));
			def = Math.round(10 + def * m_lv + random(user.level * 5));
			await channel.send(
				`${monsterName}\n` +
				`hp - ${hp}\n` +
				`atk - ${atk}\n` + 
				`def - ${def}\n`
			);
		} catch (err) {
			console.log(err);
			log(client, err.toString());
		}
  	}
}