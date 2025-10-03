const config = require("../config.json")
const fs = require('node:fs');
const path = require('node:path');
const discord = require("discord.js")
const processCancelled = require("../processCancelled.js")
const commands = [];
module.exports = {
  name: "clientReady",
  async execute(message, client) {
    const { REST, Routes } = discord;
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    if (config.maintenanceMode === true) {
      client.user.setActivity("Maintenance Mode ⚠️", {
        type: discord.ActivityType.Playing,
      });
    } else {
      client.user.setActivity("you...", {
        type: discord.ActivityType.Watching,
      });
    }
    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      commands.push(command.data.toJSON());
    }
    const rest = new REST({ version: '10' }).setToken(config.token);

    (async () => {
      try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
          Routes.applicationCommands(config.clientId),
          { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
      } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
      }
    })();
    console.log(`Logged In As ${client.user.tag}`)
    console.log('ready')
    
    setInterval(() => {
      processCancelled(client);
    }, 10 * 60 * 1000); // 10 minutes interval

  }
}