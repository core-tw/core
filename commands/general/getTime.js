const { MessageEmbed } = require('discord.js');
const { functions: { log } } = require('./../../lib/index.js');
const setting = require('./../../config/setting.json');

// 延遲
module.exports = {
    num: 27,
    name: ['gettime'],
    type: "general",
    expectedArgs: '',
    description: '取得訊息時間',
    minArgs: 1,
    maxArgs: 1,
    level: null,
    cooldown: null,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
        try {
            msg.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Message Time:")
                        .setColor(setting.embedColor.normal)
                        .setDescription(
							new Date(Number(BigInt(args[0]) >> 22n) + 1420070400000).toLocaleString('zh-TW'))
                ],
                allowedMentions: setting.allowedMentions
            }).then(() => {
                msg.react('✅');
            });
        } catch (err) {
            console.log(err);
            log(client, err.toString());
        }
    }
}