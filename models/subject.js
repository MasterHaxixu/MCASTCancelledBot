const database = require('../db/mysql.js');

function createSubject(name) {
    return new Promise((resolve, reject) => {
        database.query(
            'INSERT INTO subject (subject) VALUES (?)',
            [name],
            (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            }
        );
    });
}

function createCancelledSubject(subjectId, className) {
    return new Promise((resolve, reject) => {
        database.query(
            'INSERT INTO cancelledSubject (subjectId, class) VALUES (?, ?)',
            [subjectId, className],
            (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            }
        );
    });
}

function getSubjectByName(name) {
    return new Promise((resolve, reject) => {
        database.query(
            'SELECT * FROM subject WHERE subject = ?',
            [name],
            (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            }
        );
    });
}

function getSubjectById(id) {
    return new Promise((resolve, reject) => {
        database.query(
            'SELECT * FROM subject WHERE id = ?',
            [id],
            (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            }
        );
    });
}

function getCancelledBySubjectIdAndDate(subjectId) {
    return new Promise((resolve, reject) => {
        database.query(
            'SELECT * FROM cancelledSubject WHERE subjectId = ? AND DATE(createdAt) = CURDATE()',
            [subjectId],
            (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
            }
        );
    });
}

module.exports = {
    createSubject,
    createCancelledSubject,
    getSubjectByName,
    getCancelledBySubjectIdAndDate,
    getSubjectById
};