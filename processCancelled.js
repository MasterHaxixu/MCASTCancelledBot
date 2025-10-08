const { EmbedBuilder } = require("discord.js");
const { getNotificationChannelById } = require("./models/notificationChannel");
const { getAllServers } = require("./models/server");
const { getSubjectByName, createSubject, getCancelledBySubjectIdAndDate, createCancelledSubject } = require("./models/subject");

const refresh = async (client) => {
    let data = await fetch('https://cancelled-lectures.haxixu.xyz/api/cancelled-lectures').then(res => res.json());
    
    // Process all lectures (daily and permanent cancellations combined)
    const allCancellations = [
        ...(data.dailyCancellations || []),
        ...(data.permanentCancellations || [])
    ];
    
    for (const lecture of allCancellations) {
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

    const hasDailyCancellations = data.dailyCancellations && data.dailyCancellations.length > 0;
    const hasPermanentCancellations = data.permanentCancellations && data.permanentCancellations.length > 0;

    if (!hasDailyCancellations && !hasPermanentCancellations) {
        embed.setDescription("No cancelled lectures today! 🎉");
        embed.setColor(0x00FF00); // Green color when no cancellations
    } else {
        // Add date information if available
        if (data.date && data.date.formatted) {
            embed.setDescription(`📅 **${data.date.formatted}**\n\n**Total Cancellations: ${data.totalCancellations || 0}**`);
        }

        // Add daily cancellations
        if (hasDailyCancellations) {
            // Split long lists into multiple fields to avoid Discord's 1024 character limit
            const dailyChunks = chunkLectures(data.dailyCancellations);
            dailyChunks.forEach((chunk, chunkIndex) => {
                const fieldName = chunkIndex === 0 ? "🔴 Daily Cancellations" : "🔴 Daily Cancellations (continued)";
                embed.addFields({
                    name: fieldName,
                    value: chunk.map((lecture, index) => {
                        const globalIndex = chunkIndex * 10 + index + 1;
                        return `**${globalIndex}.** ${lecture.subject}\n Classes: ${lecture.group || "No class info"}`;
                    }).join('\n'),
                    inline: false
                });
            });
        }

        // Add permanent cancellations
        if (hasPermanentCancellations) {
            // Split long lists into multiple fields to avoid Discord's 1024 character limit
            const permanentChunks = chunkLectures(data.permanentCancellations);
            permanentChunks.forEach((chunk, chunkIndex) => {
                const fieldName = chunkIndex === 0 ? "⛔ Permanent Cancellations" : "⛔ Permanent Cancellations (continued)";
                embed.addFields({
                    name: fieldName,
                    value: chunk.map((lecture, index) => {
                        const globalIndex = chunkIndex * 10 + index + 1;
                        return `**${globalIndex}.** ${lecture.subject}\n Classes: ${lecture.group || "No class info"}`;
                    }).join('\n'),
                    inline: false
                });
            });
        }
    }

    embed.setFooter({
        text: "Last updated"
    });

    return embed;
}

// Helper function to chunk lectures into smaller groups to avoid Discord's field character limit
const chunkLectures = (lectures, chunkSize = 5) => {
    const chunks = [];
    for (let i = 0; i < lectures.length; i += chunkSize) {
        chunks.push(lectures.slice(i, i + chunkSize));
    }
    return chunks;
}

module.exports = refresh;