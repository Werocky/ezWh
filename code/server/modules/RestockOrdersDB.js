'use strict'

const RestockOrder = require('./RestockOrder');
const SKUItemsDB = require('./SKUItemsDB');
const SKUDB = require('./SKUsDB');
const ItemDB = require('./ItemDB');
const Item = require('./Item');

class RestockOrdersDB {
    sqlite = require('sqlite3');

    constructor(dbName) {
        this.db = new this.sqlite.Database(dbName, (err) => {
            if (err) throw err;
        });
    }

    createRestockTable() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS RESTOCKORDERS(ID INTEGER PRIMARY KEY,issueDate VARCHAR, state VARCHAR, products VARCHAR, supplierId INTEGER, transportNote VARCHAR, skuItems VARCHAR)';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    async getRestockOrders() {
        const rows = await this.getRawRestockOrders();

        let restockOrders = [];
        for (let i = 0; i < rows.length; i++) {
            let restockOrder = new RestockOrder(rows[i].issueDate, rows[i].state, rows[i].products, rows[i].supplierId, rows[i].transportNote, rows[i].skuItems, rows[i].id)
            restockOrder = await this.parseRestockOrder(restockOrder);
            restockOrders.push(restockOrder);
        }

        return restockOrders;
    }

    getRawRestockOrders() {
        return new Promise(async (resolve, reject) => {
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
                    resolve(rows);
                }
            });
        });
    }

    async getRestockOrder(id) {
        let restockOrder = await new Promise((resolve, reject) => {
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
                    let restockOrder = new RestockOrder(row.issueDate, row.state, row.products, row.supplierId, row.transportNote, row.skuItems, id)
                    resolve(restockOrder);
                }
            });
        });

        if (restockOrder) {
            return await this.parseRestockOrder(restockOrder);

        }
        return null;
    }

    async parseRestockOrder(restockOrder) {
        let items = new ItemDB('WarehouseDB');
        await items.createItemTable();
        let productsID = JSON.parse(restockOrder.products);
        let products = [];
        for (let i = 0; i < productsID.length; i++) {
            let item = await items.getItemById(productsID.itemId,restockOrder.supplierId);
            if (item) {
                let product = {};
                product['SKUId'] = item.getSKUId();
                product['itemId'] = item.getId();
                product['description'] = item.getDescription();
                product['price'] = item.getPrice();
                product['qty'] = productsID[i].qty;
                products.push(product);
            }
        }

        restockOrder.products = products;

        if (!(restockOrder.skuItems) || restockOrder.skuItems === '[]' || restockOrder.state !== 'DELIVERED') {
            return restockOrder;
        }
        //return restockOrder;

        let skuItemsDB = new SKUItemsDB('WarehouseDB');
        await skuItemsDB.createSKUItemsTable();
        let skuItems = [];
        const rfids = JSON.parse(restockOrder.skuItems);
        for (let i = 0; i < rfids.length; i++) {
            let skuItemInfo = await skuItemsDB.getSKUItemByRFID(rfids[i]);
            if (skuItemInfo) {
                let item = await items.getItemBySKUIdAndSupplier(skuItemInfo.SKUId,restockOrder.supplierId);
                console.log(skuItemInfo);
                let skuItem = {};
                skuItem['SKUId'] = skuItemInfo.SKUId;
                skuItem['itemId'] = item.getId();
                skuItem['rfid'] = skuItemInfo.RFID;
                skuItems.push(skuItem);
            }
        }
        restockOrder.skuItems = skuItems;

        return restockOrder;
    }

    createRestockOrder(issueDate, products, supplierId) {

        let productsID = JSON.stringify(products.map(product => {
            let productsID = {};
            productsID['SKUId'] = product.SKUId;
            productsID['itemId'] = product.itemId;
            productsID['qty'] = product.qty;
            return productsID;
        }));

        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO RESTOCKORDERS(issueDate, products, supplierId, state, skuItems) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [issueDate, productsID, supplierId, 'ISSUED', '[]'], (err) => {
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

            skuItems = skuItems.map(skuItem => skuItem.rfid);

            if (restockOrder.skuItems && restockOrder.skuItems !== '[]') {
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

    deleteAllRestockOrders() {
        return new Promise((resolve, reject) => {
            this.db.run('DROP TABLE IF EXISTS RESTOCKORDERS', (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        })
    }
}

module.exports = RestockOrdersDB;