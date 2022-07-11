const {
    database: { loadUser },
    functions: { errorEmbed, log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");
/* 給予
*/
module.exports = {
    num: 3,
    name: ["給予", "give", "g"],
    type: "rpg",
    expectedArgs: "<@user> <amount>",
    description: `轉移您身上一部份的${setting.coinName}給其他人`,
    minArgs: 2,
    maxArgs: 2,
    level: 1,
    cooldown: 0,
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

            const mention_user = msg.mentions.users.first();
            if (mention_user) {
                const to_user = await loadUser(mention_user.id)
                if (!to_user) {
                    errorEmbed(channel, author, null, setting.error.notFindUser);
                    return;
                }
                if (!isNaN(Number(args[1]))) {
                    if (
                        user.coin < Number(args[1]) ||
                        Number(args[1]) < 1 ||
                        args[1].toString().includes(".")
                    ) {
                        if (Number(args[1]) < 1 || args[1].toString().includes(".")) {
                            errorEmbed(channel, author, null, `您輸入的數字好像怪怪的喔`);
                            return;
                        } else {
                            errorEmbed(channel, author, null, `您沒有那麼多${setting.coinName}喔`);
                            return;
                        }
                    }
                    if (user.userId != to_user.userId) {
                        user.coin -= Number(args[1]);
                        to_user.coin += Number(args[1]);

                        await user.save();
                        await to_user.save();
                    }
                    msg.react("✅");
                } else {
                    errorEmbed(channel, author, null, `請輸入正確的數字`);
                    return;
                }
            } else {
                const to_user = await loadUser(args[0])
                if (!to_user) {
                    errorEmbed(channel, author, null, config.error.notFindUser);
                    return;
                }
                if (!isNaN(Number(args[1]))) {
                    if (
                        user.coin < Number(args[1]) ||
                        Number(args[1]) < 1 ||
                        args[1].toString().includes(".")
                    ) {
                        if (Number(args[1]) < 1 || args[1].toString().includes(".")) {
                            errorEmbed(channel, author, null, `您輸入的數字好像怪怪的喔`);
                            return;
                        } else {
                            errorEmbed(channel, author, null, `您沒有那麼多${setting.coinName}喔`);
                            return;
                        }
                    }
                    if (user.userId != to_user.userId) {
                        user.coin -= Number(args[1]);
                        to_user.coin += Number(args[1]);

                        await user.save();
                        await to_user.save();
                    }
                    msg.react("✅");
                } else {
                    errorEmbed(channel, author, null, `請輸入正確的數字`);
                    return;
                }
            }
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}