'use strict'

const ReturnOrder = require('./ReturnOrder');
const RestockOrdersDB = require('./RestockOrdersDB');
const ItemDB = require('./ItemDB');


class ReturnOrdersDB {
    sqlite = require('sqlite3');

    constructor(dbName) {
        this.db = new this.sqlite.Database(dbName, (err) => {
            if (err) throw err;
        });
    }

    createReturnOrdersTable() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS RETURNORDERS(ID INTEGER PRIMARY KEY,returnDate VARCHAR, products VARCHAR, restockOrderId INTEGER)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    async getReturnOrders() {
        const rows = await this.getRawReturnOrders();

        let returnOrders = [];
        for (let i = 0; i < rows.length; i++) {
            let returnOrder = new ReturnOrder(rows[i].returnDate, rows[i].products, rows[i].restockOrderId, rows[i].id)
            returnOrder = await this.parseReturnOrder(returnOrder);
            returnOrders.push(returnOrder);
        }

        return returnOrders;
    }

    getRawReturnOrders() {
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
                    resolve(rows);
                }
            });
        });
    }

    async getReturnOrder(id) {

        let returnOrder = await new Promise((resolve, reject) => {
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

        if (returnOrder) {
            return await this.parseReturnOrder(returnOrder);

        }
        return null;
    }

    async parseReturnOrder(returnOrder) {
        let items = new ItemDB('WarehouseDB');
        const RestockOrder = new RestockOrdersDB('WarehouseDB');
        await items.createItemTable();
        await RestockOrder.createRestockTable();
        let productsID = JSON.parse(returnOrder.products);
        const restockOrder = await RestockOrder.getRestockOrder(returnOrder.restockOrderId)
        let products = [];
        for (let i = 0; i < productsID.length; i++) {
            let item = await items.getItemById(productsID[i].itemId, restockOrder.supplierId);
            if (item) {
                let product = {};
                product['SKUId'] = item.getSKUId();
                product['itemId'] = item.getId();
                product['description'] = item.getDescription();
                product['price'] = item.getPrice();
                product['RFID'] = JSON.parse(returnOrder.products)[i].RFID;
                products.push(product);
            }
        }

        returnOrder.products = products;

        return returnOrder;
    }

    createReturnOrder(returnDate, products, restockOrderId) {
        return new Promise((resolve, reject) => {

            let productsID = JSON.stringify(products.map(product => {
                let productsID = {};
                productsID['SKUId'] = product.SKUId;
                productsID['itemId'] = product.itemId;
                productsID['RFID'] = product.RFID;
                return productsID;
            }));

            const sql = 'INSERT INTO RETURNORDERS(returnDate, products, restockOrderId) VALUES(?, ?, ?)';
            this.db.run(sql, [returnDate, productsID, parseInt(restockOrderId)], (err) => {
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

    deleteAllReturnOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS RETURNORDERS';
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

module.exports = ReturnOrdersDB;