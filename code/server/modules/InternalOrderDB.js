'use strict';

const InternalOrder = require('./InternalOrder');
const SKUDB = require('./SKUsDB');

module.exports = class InternalOrderDB{
    sqlite = require('sqlite3');

    constructor(dbName){
        this.db = new this.sqlite.Database(dbName, (err) =>{
            if(err) throw err;
        });
    }

    createInternalTable(){
        return new Promise((resolve, reject) =>{
            const query = 'CREATE TABLE IF NOT EXISTS INTERNALORDERS(id INTEGER PRIMARY KEY, issueDate VARCHAR, state VARCHAR, products VARCHAR, customerId INTEGER)';
            this.db.run(query, (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createInternalOrder(issueDate, products, customerId, state){
        return new Promise((resolve, reject) =>{

            let productsID = JSON.stringify(products.map(product => {
                let productsID = {};
                productsID['SKUId'] = product.SKUId;
                productsID['qty'] = product.qty;
                return productsID;
            }));

            const query = 'INSERT INTO INTERNALORDERS(issueDate, state, products, customerId) VALUES(?, ?, ?, ?)';
            this.db.run(query, [issueDate, state, productsID, customerId], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    };

    async getInternalOrders(){
        const rows = await this.getRawInternalOrders();
        let internalOrders = [];
        for (let i = 0; i < rows.length; i++) {
            let internalOrder = new InternalOrder(rows[i].id, rows[i].issueDate, rows[i].state, rows[i].products, rows[i].customerId);
            internalOrder = await this.parseInternalOrder(internalOrder);
            internalOrders.push(internalOrder);
        }
        return internalOrders;
    }

    getRawInternalOrders () {
        return new Promise((resolve, reject) =>{
            const query = 'SELECT id as id, issueDate as issueDate, state as state, products as products, customerId as customerId FROM INTERNALORDERS';
            this.db.all(query, (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    resolve(null);
                }else{
                    let result = [];
                    rows.map(e =>{
                        let element = new InternalOrder(e.id, e.issueDate, e.state, e.products, e.customerId);
                        result.push(element);
                    })
                    resolve(result);
                }
            });
        });
    }

    getInternalOrder(id){
        return new Promise((resolve, reject) =>{
            const query = 'SELECT id as id, issueDate as issueDate, state as state, products as products, customerId as customerId FROM INTERNALORDERS WHERE id=?';
            this.db.get(query, [id], async (err, row) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!row){
                    resolve(null);
                }else{
                    const internalOrder = new InternalOrder(row.id, row.issueDate, row.state, row.products, row.customerId);
                    resolve(this.parseInternalOrder(internalOrder));
                }
            });
        });
    }

    async parseInternalOrder(internalOrder) {
        let skus = new SKUDB('WarehouseDB');
        await skus.createSKUTable();
        let productsID = JSON.parse(internalOrder.products);
        let products = [];
        for (let i = 0; i < productsID.length; i++) {
            let sku = await skus.getSKUById(productsID[i].SKUId);
            let product = {};
            product['SKUId'] = sku.id;
            product['description'] = sku.description;
            product['price'] = sku.price;
            if (internalOrder.state === 'COMPLETED') {
                product['RFID'] = productsID[i].RFID;
            }else {
                product['qty'] = productsID[i].qty;
            }
            products.push(product);
        }
            
        internalOrder.products = products;
        return internalOrder;
    }

    changeState(id, newState, products = undefined){
        return new Promise((resolve, reject) =>{
            let query = '';
            let params = [];

            if (/*products === undefined && */newState !== 'COMPLETED') {
                query = 'UPDATE INTERNALORDERS SET state=? WHERE id=?'
                params = [newState, id];
            }
            else {
                
                let productsID = JSON.stringify(products.map(product => {
                    let productsID = {};
                    productsID['SKUId'] = product.SkuID;
                    productsID['RFID'] = product.RFID;
                    return productsID;
                }));                

                query = 'UPDATE INTERNALORDERS SET state=?, products=? WHERE id=?'
                params = [newState, productsID, id];
            }

            this.db.run(query, params, (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteInternalOrder(id){
        return new Promise((resolve, reject) =>{
            const query = 'DELETE FROM INTERNALORDERS WHERE id = ?'
            this.db.run(query, [id], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteAllInternalOrders(){
        return new Promise((resolve,reject) =>{
            this.db.run('DROP TABLE IF EXISTS INTERNALORDERS',(err)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve();
            })
        })
    }
}