const { MessageEmbed } = require("discord.js");
const {
	database: { addItems },
	Enum: { Creatures, Maps },
	functions: { errorEmbed, log, random, wait, generate, getAreaByUUID },
	models: { Users }
} = require("./../../lib/index.js");
const { items: { UUID : itemUUID } } = require("./../../objects/index.js");
const setting = require("./../../config/setting.json");
const chance = new require("chance")();

/* 冒險指令
	找到獵物=>延遲3秒
	找不到=>5秒後回應
*/
module.exports = {
  num: 1,
  name: ["冒險", "adventure", "adv"],
  type: "rpg",
  expectedArgs: "",
  description: "探索所在區域！",
  minArgs: 0,
  maxArgs: 0,
  level: 1,
  cooldown: 120,
  requireItems: [],
  requireBotPermissions: [],
  async execute(msg, args, client, user) {
    try {
      await msg.react("✅");
      if (!user) {
        msg.reply({
          content: `您還沒有帳戶喔`,
          allowedMentions: setting.allowedMentions
        });
        return;
      }
      const { author, channel } = msg;
      const createEmbed = (title, content = "") => {
        let embed = new MessageEmbed()
          .setTitle(title)
          .setColor(setting.embedColor.normal)
          .setDescription(content)
          .setFooter({
            text: author.tag
          })
          .setTimestamp();
        return embed;
      }

      // 先取得玩家位置
      let a = getAreaByUUID(user.area);
      if (!a) {
        errorEmbed(channel, author, null, setting.error.no);
        return;
      }

			let creatures = Maps["planet"][a[0]]["area"][a[1]]["creatures"];

      // 無生物
      if (!creatures) {
        msg.reply({
          embeds: [
            createEmbed(`${a[1]}似乎沒有任何生物呢......`)
          ],
          allowedMentions: setting.allowedMentions
        });
        return;
      }

      // 有機率找不到生物
      let rateToAppear = Maps["planet"][a[0]]["area"][a[1]]["creatureRate"] || 0;
      if (!chance.bool({ likelihood: rateToAppear })) {
        await wait(5000);
        msg.reply({
          embeds: [
            createEmbed(`沒有發現到任何東西呢......`)
          ],
          allowedMentions: setting.allowedMentions
        });
        return;
      }

      // 隨機生物
      let monsters = Object.keys(creatures);
			
			// 選之前要先過濾等級過高的
      let monsterName = monsters[random(monsters.length)];
      let monster = creatures[monsterName];

      // 生物有機會直接逃跑
      if (!chance.bool({ likelihood: monster["rate"] })) {
        await wait(5000);
        msg.reply({
          embeds: [
            createEmbed(`沒有發現到任何東西呢......`)
          ],
          allowedMentions: setting.allowedMentions
        });
        return;
      }

      let _monster = generate.monster(monster.data, user.level);

      let pa = (user.stat.STR * 6 / 8) + (user.stat.VIT / 8) + (user.stat.INT / 8);
      pa = (pa * 2 / 3) + ((user.stat.HEA / user.stat.tHEA) / 3);
      let ma = (user.stat.SOR / 2) + (user.stat.INT / 2);
      let pd = (user.stat.STR / 8) + (user.stat.VIT * 6 / 8) + (user.stat.INT / 8);
      pd = (pd * 2 / 3) + ((user.stat.HEA / user.stat.tHEA) / 3);
      let md = (user.stat.SOR / 3) + (user.stat.INT * 2 / 3);

      let _player = {
        hp: user.stat.HEA,
        atk: Math.max(pa, ma),
        def: Math.max(pd, md),
        dodge: user.stat.VEL,
        damage: null
      };

      _player.damage = Math.max((_player.atk - _monster.def), 2);
      _monster.damage = Math.max((_monster.atk - _player.def), 1);

      if ((_monster.hp / _player.damage) < (_player.hp / _monster.damage)) {
        // 玩家勝利，但可能死亡
        for (let i = 0; i < Math.round(_monster.hp / _player.damage); i++) {
          // 分次計算閃避
          if (chance.bool({ likelihood: (_player.dodge / (_player.dodge + _monster.dodge)) * 100 * setting.dodgeLikelihood })) {
            if (!chance.bool({ likelihood: setting.allDodgeLikelihood * 100 })) {
              // 減傷
              user.stat.HEA -= Math.floor(_monster.damage * (_player.dodge / (_player.dodge + _monster.dodge)));
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

      if (user.stat.HEA <= 0) {
				await wait(4000);
				msg.reply({
          embeds: [
            createEmbed(`您遇到一隻${monsterName}，但輸掉了這場戰鬥`)
          ],
          allowedMentions: setting.allowedMentions
        });
				user.save();
        return;
      }
      
			await wait(3000);

			// 戰利品處理
      let items = [];
      for (let i in monster.data.falls) {
        if (chance.bool({ likelihood: monster.data.falls[i].rate })) {
					let num = Math.round(Math.random() * (monster.data.falls[i].maxFall - 1)) + 1;
					items.push({
						name: i,
						amount: num
					});
					// 預存UUID
					let UUID = itemUUID + monster.data.falls[i].data.UUID;
					await addItems(user, UUID, num);
        }
      }

			let finalEmbed = createEmbed(
				monsterName,
				`等級 － ${_monster.lv}\n` +
				`生命 － ${_monster.hp}\n` +
				`攻擊 － ${_monster.atk}\n` +
				`防禦 － ${_monster.def}\n` +
				`閃避 － ${_monster.dodge}`
			);
			let itemEmbed = null
			if(items.length > 0) {
				itemEmbed = createEmbed("戰利品");
				for(let i in items) {
					itemEmbed.addField(items[i].name, `數量 － ${items[i].amount}`)
				}
			}

			await msg.reply({
        embeds: [finalEmbed],
        allowedMentions: setting.allowedMentions
			});
			if(itemEmbed) {
				await msg.channel.send({
	        embeds: [itemEmbed]
				});
			}
			
			user.save();
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}