const database = require('../db/mysql.js');


function createNotificationChannel(serverId, channelId) {
    return new Promise((resolve, reject) => {
        database.query(
            'INSERT INTO notificationChannel (serverId, channelId) VALUES (?, ?)',
            [serverId, channelId],
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

function getNotificationChannelById(serverId) {
    return new Promise((resolve, reject) => {
        database.query(
            'SELECT * FROM notificationChannel WHERE serverId = ? AND deletedAt IS NULL',
            [serverId],
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

function deleteNotificationById(id) {
    return new Promise((resolve, reject) => {
        database.query(
            'UPDATE notificationChannel SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?',
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

module.exports = {
    createNotificationChannel,
    getNotificationChannelById,
    deleteNotificationById
};