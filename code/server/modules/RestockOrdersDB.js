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

    getRestockOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id as id, issueDate as issueDate, state as state, products as products, supplierId as supplierId, transportNote as transportNote, skuItems as skuItems FROM RESTOCKORDERS';
            this.db.all(sql, (err, rows) => {
                if (err) {
                reject(err);
                return;
                }
                if (!rows) {
                    resolve(null);
                }
                else {
                    let restockOrders = [];
                    rows.forEach(row => {
                        restockOrders.push(new RestockOrder(row.issueDate, row.state, row.products, row.supplierId, row.transportNote, row.skuItems, row.id));
                    });
                    resolve(restockOrders);
                }
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
                    const restockOrder = new RestockOrder(row.issueDate, row.state, row.products, row.supplierId, row.transportNote, row.skuItems, id);
                    resolve(restockOrder);
                }
            });
        });
    }
    
    createRestockOrder(issueDate, products, supplierId) {
        //Encrypt password creating a user
        let restockOrder = new RestockOrder(issueDate, products, supplierId);
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCKORDERS(issueDate, products, supplierId, state) VALUES(?, ?, ?, ?)';
            this.db.run(sql, [issueDate, products, supplierId, 'ISSUED'], (err) => {
                if (err) {
                reject(err);
                return;
                }
                resolve(this.lastID);
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

    addSKUItems(id, skuItems, restockOrder) {
        return new Promise((resolve, reject) => {
            
            if (restockOrder.skuItems) {
                skuItems = skuItems.concat(JSON.parse(restockOrder.skuItems));
            }
            
            skuItems = JSON.stringify(skuItems);
            const sql = 'UPDATE RESTOCKORDERS SET skuItems=? WHERE id=?';
            this.db.run(sql, [skuItems, id], (err) => {
                if (err) {
                reject(err);
                return;
                }
                resolve(this.lastID);
            });
        });
    }

    addTransportNote(id, transportNote) {
        return new Promise((resolve, reject) => {
            transportNote = JSON.stringify(transportNote);
            const sql = 'UPDATE RESTOCKORDERS SET transportNote=? WHERE id=?';
            this.db.run(sql, [transportNote, id], (err) => {
                if (err) {
                reject(err);
                return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteRestockOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RESTOCKORDERS WHERE id=?';
            this.db.run(sql, [id], (err) => {
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