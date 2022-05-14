'use strict'

const RestockOrder = require('./RestockOrder');
const SKUItemsDB = require('./SKUItemsDB');
const SKUDB = require('./SKUsDB');

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

    async getRestockOrders() {
        const rows = await this.getRawRestockOrders();
        
        let restockOrders = [];
        for (let i = 0; i < rows.length; i++) {
            let restockOrder = new RestockOrder(rows[i].issueDate, rows[i].state, rows[i].products, rows[i].supplierId, rows[i].transportNote, rows[i].skuItems, rows[i].id)
            restockOrder = await this.parseRestockOrder(restockOrder);
            restockOrders.push(restockOrder);
        }

        return restockOrders;
        /*
        rows.forEach(row => {
            let restockOrder = new RestockOrder(row.issueDate, row.state, row.products, row.supplierId, row.transportNote, row.skuItems, row.id)
            restockOrder = await this.parseRestockOrder(restockOrder);
            restockOrders.push(restockOrder);
        });
        */
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
                    let restockOrder = new RestockOrder(row.issueDate, row.state, row.products, row.supplierId, row.transportNote, row.skuItems, id)
                    resolve(this.parseRestockOrder(restockOrder));
                }
            });
        });
    }

    async parseRestockOrder(restockOrder) {
        let skus = new SKUDB('WarehouseDB');
        await skus.createSKUTable();
        let productsID = JSON.parse(restockOrder.products);
        let products = [];
        for (let i = 0; i < productsID.length; i++) {
            let sku = await skus.getSKUById(productsID[i].SKUId);
            let product = {};
            product['SKUId'] = sku.id;
            product['description'] = sku.description;
            product['price'] = sku.price;
            product['qty'] = productsID[i].qty;
            products.push(product);
        }
            
        restockOrder.products = products;

        if (!(restockOrder.skuItems) || restockOrder.skuItems === '[]') {
            return restockOrder;
        }

        let skuItemsDB = new SKUItemsDB('WarehouseDB');
        await skuItemsDB.createSKUItemsTable();
        let skuItems = [];
        rfids = JSON.parse(restockOrder.skuItems);
        for (let i = 0; i < rfids.length; i++) {
            let skuItemInfo = await skuItemsDB.getSKUItemByRFID(rfids[i]);
            let skuItem = {};
            skuItem['SKUId'] = skuItemInfo.SKUId;
            skuItem['rfid'] = skuItemInfo.RFID;
            skuItems.push(skuItem);
        }          
        restockOrder.skuItems = skuItems;
        
        return restockOrder;
    }
    
    createRestockOrder(issueDate, products, supplierId) {
        
        let productsID = JSON.stringify(products.map(product => {
            let productsID = {};
            productsID['SKUId'] = product.SKUId;
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
}

module.exports = RestockOrdersDB;