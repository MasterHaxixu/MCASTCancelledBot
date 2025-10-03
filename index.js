const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
let database = require('./db/mysql.js');

database.connectDatabase();

var client = new Discord.Client({
    intents: [32767]
});

client.commands = new Discord.Collection();

try {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        try {
            const event = require(`./events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => {
                    try {
                        event.execute(...args, client, Discord);
                    } catch (error) {
                        console.log(error)
                    }
                });
            } else {
                client.on(event.name, (...args) => {
                    try {
                        event.execute(...args, client, Discord);
                    } catch (error) {
                        console.log(error)
                    }
                });
            }
            console.log(`Loaded event: ${event.name}`, { file: file });
        } catch (error) {
            console.log(`Failed to load event file: ${file}`, error);
        }
    }
} catch (error) {
    console.log(error)
}

client.login(config.token)
    .then(() => {
        console.log('Bot logged in successfully');
    })
    .catch((error) => {
        console.log('Failed to login to Discord', error);
        process.exit(1);
    });