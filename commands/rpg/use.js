const {
    database: { addItems, getItems },
    functions: { errorEmbed, log }
} = require("./../../lib/index.js");
const { items: { data, UUID: itemUUID } } = require("./../../objects/index.js");
const setting = require("./../../config/setting.json");

/* 雲端商店
*/
module.exports = {
    num: 11,
    name: ['使用', 'use', 'u'],
    type: "rpg",
    expectedArgs: "",
    description: "使用物品",
    minArgs: 1,
    maxArgs: 2,
    level: 1,
    cooldown: 3,
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
            let list = await getItems(user);
            let item = null;
            for (let i in list) {
                if (list[i].name == args[0]) {
                    item = list[i];
                }
            }
            if (!item) {
                errorEmbed(channel, author, null, `查無 ${args[0]}，請您檢查是否打錯字`);
                return;
            }
            if (item.amount < 1) {
                errorEmbed(channel, author, null, `您沒有那麼多${args[0]}喔`);
                return;
            }
            if (data[args[0]].use) {
                await data[args[0]].use(msg, args, user);
                let add = await addItems(user, item.UUID, -1);
                user.save().catch(err => console.log(err));
            }
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}