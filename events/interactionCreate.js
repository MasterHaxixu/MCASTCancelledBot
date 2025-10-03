const fs = require("node:fs");
const path = require("node:path");
const slashcommandsPath = path.join(__dirname, "../commands");
const slashcommandFiles = fs.readdirSync(slashcommandsPath).filter((file) => file.endsWith(".js"));
const config = require("../config.json");
const {
    getServerByDiscordId,
    createServer,
} = require("../models/server");
const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client, discord) {
        var server = await getServerByDiscordId(interaction.guild.id);
        if (server.length === 0) {
            await createServer(interaction.guild.id);
            server = await getServerByDiscordId(interaction.guild.id);
        }

        for (const file of slashcommandFiles) {
            const filePath = path.join(slashcommandsPath, file);
            const command = require(filePath);
            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }

        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        if (command.devOnly === true) {
            if (interaction.user.id !== config.devid)
                return interaction.reply({ content: "Dev Only Command", ephemeral: true });
        }

        if (command.adminOnly === true) {
            var isAdmin = false;
            if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) isAdmin = true;
            if (interaction.user.id === config.devid) isAdmin = true;
            if (!isAdmin) return interaction.reply({ content: "Admin Only Command", ephemeral: true });
        }

        try {
            await command.execute(interaction, client, discord, server[0]);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }

        //ticket
    },
};