const { MessageEmbed } = require("discord.js");
const { embedColor } = require("./../../config/setting.json");
// 使用紅色警告色
module.exports = (channel, author, type, content) => {
    channel.send({
        embeds: [
            new MessageEmbed()
                .setAuthor({
                    name: type ? type : "系統錯誤",
                })
                .setColor(embedColor.error)
                .setDescription(content)
                .setFooter({
                    text: author.tag
                })
                .setTimestamp()
        ]
    });
}