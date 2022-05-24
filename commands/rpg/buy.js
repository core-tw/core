const { MessageEmbed } = require("discord.js");
const {
	database: { addItems },
	functions: { errorEmbed, getShop, log }
} = require("./../../lib/index.js");
const { items: { UUID : itemUUID } } = require("./../../objects/index.js");
const setting = require("./../../config/setting.json");

/* 雲端商店
*/
module.exports = {
  num: 10,
  name: ['購買', 'buy', 'b'],
  type: "rpg",
  expectedArgs: "",
  description: "購買物品",
  minArgs: 1,
  maxArgs: 1,
  level: 1,
  cooldown: 5,
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
			const shopData = getShop();
			let item = null;

			for(let c in shopData) {
				for(let i in shopData[c]) {
					if(i == args[0]) {
						item = shopData[c][i];
						break;
					}
				}
			}
			if(!item) {
				errorEmbed(channel, author, null, `查無 ${args[0]}，請您檢查是否打錯字`);
				return;
			}
	    if(user.coin < item.forSale) {
				errorEmbed(channel, author, null, `您沒有那麼多${setting.coinName}喔`);
				return;
			}
	    await addItems(user, itemUUID + item['UUID'], 1);
			
	    user.coin -= item.forSale;
	    user.save().catch(err => console.log(err));
	    msg.channel.send(`**< 已獲得 ${args[0]} >**`);
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}