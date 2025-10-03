const mysql = require('mysql2');
var config = require('../config.json');

// Create a connection pool
var connection;
function connectDatabase() {
    connection = mysql.createConnection({
        host: config.database.host.split(':')[0],
        port: config.database.host.split(':')[1] || 3306,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        supportBigNumbers: true,

    });

    connection.connect((error) => {
        if (error) {
            console.error('Error connecting to MySQL database:', error);
        } else {
            console.log('Connected to MySQL database!');
        }
    });
}

// Execute a query
function query(sql, params, callback) {
    connection.query(sql, params, (error, results) => {
        callback(error, results);
    });
}

// Close the connection
function closeConnection() {
    connection.end((error) => {
        if (error) {
            console.error('Error closing MySQL connection:', error);
        } else {
            console.log('MySQL connection closed!');
        }
    });
}

module.exports = {
    query,
    connectDatabase,
    closeConnection
};