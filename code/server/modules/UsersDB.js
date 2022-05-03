'use strict'

const User = require('./User');

class UsersDB {
    sqlite = require('sqlite3');

    constructor(dbName) {
        this.db = new this.sqlite.Database(dbName, (err) => {
            if(err) throw err;
        });
    }

    createUserTable() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS USERS(ID INTEGER PRIMARY KEY AUTOINCREMENT,NAME VARCHAR, SURNAME VARCHAR, EMAIL VARCHAR, PASSWORD VARCHAR, TYPE VARCHAR)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    async alreadyExists(username, type) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS count FROM USERS WHERE email=? AND type=?';
            this.db.all(sql, [username, type], (err, rows) => {
                if(err) {
                    reject(err);
                    return;
                } 
                resolve(rows[0].count > 0);
            });
        });
    }
    
    createUser(username, name, surname, password, type) {
        //Encrypt password creating a user
        let user = new User(username, name, surname, password, type);
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO USERS(NAME, SURNAME, EMAIL, PASSWORD, TYPE) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [user.name, user.surname, user.email, user.password, user.type], (err) => {
                if (err) {
                reject(err);
                return;
                }
                resolve(this.lastID);
            });
        });
    }

    login(username, password) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id as id, email as email, name as name, surname as surname, type as type FROM USERS WHERE EMAIL=? AND PASSWORD=?';
            this.db.all(sql, [username, User.encrypt(password)], (err, rows) => {
                if (err) {
                reject(err);
                return;
                }
                if (rows.length === 0) {
                    resolve(null);
                }
                const row = rows[0];
                const user = new User(row.email, row.name, row.surname, row.password, row.type, row.id);
                resolve(user);
            });
        });
    }
}

module.exports = UsersDB;