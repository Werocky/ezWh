'use strict'

const RestockOrder = require('./RestockOrder');

class RestockOrdersDB {
    sqlite = require('sqlite3');

    constructor(dbName) {
        this.db = new this.sqlite.Database(dbName, (err) => {
            if(err) throw err;
        });
    }

    createRestockTable() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS RESTOCKORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT,issueDate VARCHAR, state VARCHAR, products VARCHAR, supplierId INTEGER, transportNote VARCHAR, skuItems VARCHAR)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }
    
    createRestockOrder(issueDate, products, supplierId) {
        //Encrypt password creating a user
        let restockOrder = new RestockOrder(issueDate, products, supplierId);
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCKORDERS(issueDate, products, supplierId) VALUES(?, ?, ?)';
            this.db.run(sql, [issueDate, products, supplierId], (err) => {
                if (err) {
                reject(err);
                return;
                }
                resolve(this.lastID);
            });
        });
    }

    getRestockOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT issueDate as issueDate, state as state, products as products, supplierId as supplierId, transportNote as transportNote, skuItems as skuItems FROM RESTOCKORDERS WHERE id=?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                reject(err);
                return;
                }
                if (!row) {
                    resolve(null);
                }
                else {
                    const restockOrder = new RestockOrder(row.issueDate, row.state, row.products, row.supplierId, row.transportNote, row.skuItems);
                    resolve(restockOrder);
                }
            });
        });
    }

    changeState(id, newState) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE RESTOCKORDERS SET state=? WHERE id=?';
            this.db.run(sql, [newState, id], (err) => {
                if (err) {
                reject(err);
                return;
                }
                resolve(this.lastID);
            });
        });
    }
}

module.exports = RestockOrdersDB;