const database = require('../db/mysql.js');


function createServer(discordServerId) {
    return new Promise((resolve, reject) => {
        database.query(
            'INSERT INTO server (serverId) VALUES (?)',
            [discordServerId],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

function getServerByDiscordId(discordServerId) {
    return new Promise((resolve, reject) => {
        database.query(
            'SELECT * FROM server WHERE serverId = ?',
            [discordServerId],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

function getServerById(id) {
    return new Promise((resolve, reject) => {
        database.query(
            'SELECT * FROM server WHERE id = ?',
            [id],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

function markServerAsDeleted(id) {
    return new Promise((resolve, reject) => {
        database.query(
            'UPDATE server SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?',
            [id],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

function getAllServers() {
    return new Promise((resolve, reject) => {
        database.query(
            'SELECT * FROM server WHERE deletedAt IS NULL',
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

module.exports = {
    createServer,
    getServerByDiscordId,
    getAllServers,
    getServerById,
    markServerAsDeleted
};