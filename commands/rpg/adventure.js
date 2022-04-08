const { MessageEmbed } = require('discord.js');
const { Users } = require('./../../_models_.js');
const { area, errorEmbed, log, random } = require('./../../_functions_.js');
const { Creatures, Maps, Player } = require('./../../_enum_.js');
const config = require('./../../config.json');
const { dodgeLikelihood, allDodgeLikelihood } = require('./../../setting.json');
const chance =  new require('chance')();

/* 冒險指令
	找到獵物=>延遲3秒
	找不到=>5秒後回應
*/
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
			const { author, channel } = msg;
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

			/* 生成生物數據
			小怪的數據要隨著使用者的等級變化
			有5種 弱 中下 中 中上 強
			*/
			const { attribute } = Player;
			let lv = random(5) - 2;
			let {
				hp,
				atk,
				def,
				dodge,
				lvLimit
			} = monster;
			let m_lv = null;
			if(user.level < lvLimit[0]) {
				m_lv = lvLimit[0];
			} else if(user.level > lvLimit[1]) {
				m_lv = lvLimit[1];
			}
			m_lv = (m_lv + lv) > 0 ? (m_lv + lv) : 1;
			
			let _monster = {
				hp: Math.round(95 + hp * m_lv + random(user.level * 5)),
				atk: Math.round(5 + atk * m_lv + random(user.level * 5)),
				def: Math.round(5 + def * m_lv + random(user.level * 5)),
				dodge: Math.round(5 + dodge * m_lv + random(user.level * 5)),
				damage: null
			};

			let pa = (user.stat.STR * 6 / 8) + (user.stat.VIT / 8) + (user.stat.INT / 8);
			pa = (pa * 2 / 3) + ((user.stat.HEA/user.stat.tHEA) / 3);
			let ma = (user.stat.SOR / 2) + (user.stat.INT / 2);
			let pd = (user.stat.STR / 8) + (user.stat.VIT * 6 / 8) + (user.stat.INT / 8);
			pd = (pd * 2 / 3) + ((user.stat.HEA/user.stat.tHEA) / 3);
			let md = (user.stat.SOR / 3) + (user.stat.INT * 2 / 3);
			
			let _player = {
				hp: user.stat.HEA,
				atk: Math.max(pa,ma),
				def: Math.max(pd,md),
				dodge: user.stat.VEL,
				damage: null
			};
				
			_player.damage = Math.max((_player.atk - _monster.def), 2);
			_monster.damage = Math.max((_monster.atk - _player.def), 1);

			if((_monster.hp / _player.damage) < (_player.hp / _monster.damage)) {
				// 玩家勝利，但可能死亡
				for(let i = 0 ; i < Math.round(_monster.hp / _player.damage); i++ ) {
					// 分次計算閃避
					if(chance.bool({ likelihood: (_player.dodge/(_player.dodge + _monster.dodge)) * 100 * dodgeLikelihood })) {
						if(!chance.bool({ likelihood: allDodgeLikelihood * 100 })) {
							// 減傷
							user.stat.HEA -= Math.floor(_monster.damage * (_player.dodge/(_player.dodge + _monster.dodge)));
						}
						// 全閃避不用寫出來
					} else {
						user.stat.HEA -= Math.floor(_monster.damage);
					}
				}
			} else {
				// 玩家失敗
				user.stat.HEA = 0;
			}

			// await wait(3000);
			channel.send(
				`${monsterName}\n` +
				`lv - ${m_lv}\n` +
				`hp - ${_monster.hp}\n` +
				`atk - ${_monster.atk}\n` +
				`def - ${_monster.def}\n` +
				`dodge-${_monster.dodge}\n==========\n我方\n` +
				`hp - ${user.stat.HEA} / ${user.stat.tHEA}\n` +
				`atk - ${_player.atk}\n` +
				`def - ${_player.def}\n` +
				`dodge-${_player.dodge}`
			);

			// 戰利品處理

			
			if(user.stat.HEA <= 0) {
				channel.send(`<死亡>`);
				return;
			}
			
			
			
			
		} catch (err) {
			console.log(err);
			log(client, err.toString());
		}
  	}
}