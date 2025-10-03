const { SlashCommandBuilder } = require("discord.js");
const { createNotificationChannel, getNotificationChannelById, deleteNotificationById } = require("../models/notificationChannel");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("set_channel")
        .setDescription("Set the notification channel for cancelled lectures")
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The channel to send notifications to")
                .setRequired(true)),
    adminOnly: true,
    async execute(interaction, client, discord, server) {
        const channel = interaction.options.getChannel("channel");
        if (!channel || channel.type !== discord.ChannelType.GuildText) {
            return interaction.reply({ content: "Please select a valid text channel.", ephemeral: true });
        }
        try {
            const existingChannel = await getNotificationChannelById(server.id);
            if (existingChannel.length > 0) {
                await deleteNotificationById(existingChannel[0].id);
            }
            await createNotificationChannel(server.id, channel.id);
            return interaction.reply({ content: `Notification channel set to ${channel}.`, ephemeral: true });
        } catch (error) {
            console.error("Error setting notification channel:", error);
            return interaction.reply({ content: "There was an error setting the notification channel. Please try again later.", ephemeral: true });
        }
    }
}