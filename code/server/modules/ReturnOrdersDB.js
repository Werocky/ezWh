'use strict'

const ReturnOrder = require('./ReturnOrder');
const RestockOrdersDB = require('./RestockOrdersDB');

class ReturnOrdersDB {
    sqlite = require('sqlite3');

    constructor(dbName) {
        this.db = new this.sqlite.Database(dbName, (err) => {
            if(err) throw err;
        });
    }

    createReturnOrdersTable() {
        return new Promise((resolve, reject)  => {
            const sql = 'CREATE TABLE IF NOT EXISTS RETURNORDERS(ID INTEGER PRIMARY KEY AUTOINCREMENT,returnDate VARCHAR, products VARCHAR, restockOrderId INTEGER)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getReturnOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id as id, returnDate as returnDate, products as products, restockOrderId as restockOrderId FROM RETURNORDERS';
            this.db.all(sql, (err, rows) => {
                if (err) {
                reject(err);
                return;
                }
                if (!rows) {
                    resolve(null);
                }
                else {
                    let returnOrders = [];
                    rows.forEach(row => {
                        returnOrders.push(new ReturnOrder(row.returnDate, row.products, row.restockOrderId, row.id));
                    });
                    resolve(returnOrders);
                }
            });
        });
    }

    getReturnOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id as id, returnDate as returnDate, products as products, restockOrderId as restockOrderId FROM RETURNORDERS WHERE id=?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                reject(err);
                return;
                }
                if (!row) {
                    resolve(null);
                }
                else {
                    const returnOrder = new ReturnOrder(row.returnDate, row.products, row.restockOrderId, row.id);
                    resolve(returnOrder);
                }
            });
        });
    }
    
    createReturnOrder(returnDate, products, restockOrderId) {
        return new Promise((resolve, reject) => {
            let returnOrder = new ReturnOrder(returnDate, products, restockOrderId);
            const sql = 'INSERT INTO RETURNORDERS(returnDate, products, restockOrderId) VALUES(?, ?, ?)';
            this.db.run(sql, [returnDate, products, parseInt(restockOrderId)], (err) => {
                if (err) {
                reject(err);
                return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteReturnOrder(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM RETURNORDERS WHERE id=?';
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

module.exports = ReturnOrdersDB;