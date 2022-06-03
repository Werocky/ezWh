'use strict'

const User = require('./User');

class UsersDB {
    sqlite = require('sqlite3');

    constructor(dbName) {
        this.db = new this.sqlite.Database(dbName, (err) => {
            if (err) throw err;
        //this.db.run('PRAGMA foreign_keys = ON;');
        });
    }

    async createUserTable() {
        await this.createTheUserTable();
        //username, name, surname, password, type
        //await this.createUser('user1@ezwh.com', 'John', 'Dick', 'testpassword', 'customer');
        //await this.createUser('qualityEmployee1@ezwh.com', 'John', 'Dick', 'testpassword', 'qualityEmployee');
        //await this.createUser('clerk1@ezwh.com', 'John', 'Dick', 'testpassword', 'clerk');
        //await this.createUser('deliveryEmployee1@ezwh.com', 'John', 'Dick', 'testpassword', 'deliveryEmployee');
        //await this.createUser('supplier1@ezwh.com', 'John', 'Dick', 'testpassword', 'supplier');
        //await this.createUser('manager1@ezwh.com', 'John', 'Dick', 'testpassword', 'manager');
    }

    createTheUserTable() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS USERS(id INTEGER PRIMARY KEY,name VARCHAR, surname VARCHAR, email VARCHAR, password VARCHAR, type VARCHAR)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    async alreadyExists(username, type) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USERS WHERE email=? AND type=?';
            this.db.get(sql, [username, type], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    resolve(row);
                }
            });
        });
    }

    getUsers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USERS WHERE type<>?';
            this.db.all(sql, ['managers'], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!rows) {
                    resolve([]);
                }
                else {
                    let users = [];
                    rows.forEach(row => {
                        users.push({id: row.id, name: row.name, surname: row.surname, email: row.email, type: row.type});
                    });
                    resolve(users);
                }
            });
        });
    }

    getSuppliers() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM USERS WHERE type=?';
            this.db.all(sql, ['supplier'], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!rows) {
                    resolve([]);
                }
                else {
                    let users = [];
                    rows.forEach(row => {
                        users.push({id: row.id, name: row.name, surname: row.surname, email: row.email});
                    });
                    resolve(users);
                }
            });
        });
    }

    createUser(username, name, surname, password, type) {
        //Encrypt password creating a user
        let user = new User(username, name, surname, password, type);
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO USERS(name, surname, email, password, type) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [user.name, user.surname, user.email, user.password, user.type], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    login(username, password, type) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id as id, email as email, name as name, surname as surname, type as type FROM USERS WHERE EMAIL=? AND PASSWORD=?';
            this.db.get(sql, [username, User.encrypt(password)], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row || row.type !== type) {
                    resolve(null);
                }
                else {
                    const user = new User(row.email, row.name, row.surname, row.password, row.type, row.id);
                    resolve(user);
                }
            });
        });
    }

    updateRight(username, newType) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE USERS SET type=? WHERE email=?';
            this.db.run(sql, [newType, username], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteUser(username, type) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM USERS WHERE email=? AND type=?';
            this.db.run(sql, [username, type], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteAllUsers() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS USERS';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }
}

module.exports = UsersDB;