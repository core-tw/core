/* 更改頭像
*/
module.exports = {
    num: 12,
    name: ['頭像', 'setAvatar', 'seta'],
    type: "admin",
    expectedArgs: "<link>",
    description: "更改頭像",
    minArgs: 1,
    maxArgs: 1,
    level: null,
    cooldown: 60,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
            await client.user.setAvatar(args[0]);
            await msg.react("✅");
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}