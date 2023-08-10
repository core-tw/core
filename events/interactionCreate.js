const config = require("./../config.js");
const { Collection } = require("discord.js");
const { database: { connect, Database }, Music } = require("./../lib/index.js");

module.exports = {
    name: 'interactionCreate',
    once: true,
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'ping') {
          await interaction.reply('Pong!');
        }
    }
}