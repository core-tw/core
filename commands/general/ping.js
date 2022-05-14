const { MessageEmbed } = require('discord.js');
const { functions: { log } } = require('./../../lib/index.js');
const config = require('./../../config/setting.json');

// 延遲
module.exports = {
  num: 4,
  name: ['ping'],
  type: "general",
  expectedArgs: '',
  description: '延遲毫秒數',
  minArgs: 0,
  maxArgs: 0,
  level: null,
  cooldown: null,
  requireItems: [],
  requireBotPermissions: [],
  async execute(msg, args, client, user) {
		try {
			msg.reply({
        embeds: [
          new MessageEmbed()
			      .setTitle("Pong !")
			      .setColor(config.embedColor.normal)
			      .setDescription(`API Latency: ${Math.round(client.ws.ping)} ms\nLatency: ${Date.now() - msg.createdTimestamp} ms`)
			      .setTimestamp()
        ],
        allowedMentions: config.allowedMentions
      }).then(() => {
				msg.react('✅');
			})
		} catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}