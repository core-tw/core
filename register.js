const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require("./config.js");
const commands = [{
  name: 'ping',
  description: 'Replies with Pong!'
}];

const rest = new REST({ version: '9' }).setToken(config["token"]);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands('935475907941003316', '855817825822179329'),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();