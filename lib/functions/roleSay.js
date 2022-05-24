const { MessageEmbed } = require("discord.js");
const { embedColor } = require("./../../config/setting.json");

module.exports = (channel, name, content) => {
  channel.send({
    embeds: [
      new MessageEmbed()
        .setAuthor({
          name: name
        })
        .setColor(embedColor.normal)
        .setDescription(content)
        .setTimestamp()
    ]
  });
}