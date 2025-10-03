const { EmbedBuilder } = require("discord.js");
const { getNotificationChannelById } = require("./models/notificationChannel");
const { getAllServers } = require("./models/server");
const { getSubjectByName, createSubject, getCancelledBySubjectIdAndDate, createCancelledSubject } = require("./models/subject");

const refresh = async (client) => {
    let data = await fetch('https://cancelled-lectures.haxixu.xyz/api/cancelled-lectures').then(res => res.json());
    for (const lecture of data.lectures) {
        let subject = await getSubjectByName(lecture.subject);
        if (subject.length === 0) {
            await createSubject(lecture.subject);
        }
        subject = await getSubjectByName(lecture.subject);
        let cancelled = await getCancelledBySubjectIdAndDate(subject[0].id);
        if (cancelled.length === 0) {
            let classes = lecture.group.split(", ");
            for (const className of classes) {
                await createCancelledSubject(subject[0].id, className);
            }
        }
    }

    let servers = await getAllServers();
    console.log(`Total servers to notify: ${servers.length}`);
    for (const server of servers) {
        let notification_channel = await getNotificationChannelById(server.id);
        if (notification_channel.length === 0) {
            console.log(`No notification channel set for server ID: ${server.serverId}, skipping...`);
            continue;
        }
        // Fetch the channel directly using the client
        const channel = await client.channels.fetch(notification_channel[0].channelId).catch(() => null);
        if (!channel) {
            console.log(`Channel not found for server ID: ${server.serverId}`);
            continue;
        }

        const messages = await channel.messages.fetch({ limit: 10 });
        const botMessage = messages.find(msg => msg.author.id === client.user.id);

        if (botMessage) {
            botMessage.edit({ embeds: [embedDefault(data)] });
        } else {
            channel.send({ embeds: [embedDefault(data)] });
            console.log(`Sent initial embed to channel ID: ${channel.id}`);
        }
    }
}

const embedDefault = (data) => {
    let embed = new EmbedBuilder()
        .setTitle(data.title || "Cancelled Lectures")
        .setColor(0xFF6B6B) // Red color for cancelled lectures
        .setTimestamp();

    if (data.lectures && data.lectures.length > 0) {

        data.lectures.forEach((lecture, index) => {
            embed.addFields({
                name: `${index + 1}. ${lecture.subject}`,
                value: lecture.group ? `Classes: ${lecture.group}` : "No class info",
                inline: false
            });
        });
    } else {
        embed.setDescription("No cancelled lectures today! 🎉");
        embed.setColor(0x00FF00); // Green color when no cancellations
    }

    // if (data.note) {
    //     embed.addFields({
    //         name: "📝 Additional Note",
    //         value: data.note,
    //         inline: false
    //     });
    // }

    embed.setFooter({
        text: "Last updated"
    });

    return embed;
}

module.exports = refresh;