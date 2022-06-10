'use strict';

const Item = require('./Item');

class ItemDB{

    sqlite = require('sqlite3');

    constructor(dbName) {
        this.db = new this.sqlite.Database(dbName, (err) => {
            if (err)
                throw err;
        });
       //this.db.run("PRAGMA foreign_keys = ON;");

    }

    createItemTable(){
        return new Promise((resolve,reject)=>{
            const sql = 'CREATE TABLE IF NOT EXISTS ITEMS(id INTEGER, description VARCHAR(50), price FLOAT, SKUId INTEGER, supplierId INTEGER,PRIMARY KEY(id,supplierId), CHECK(price >= 0));';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    resolve(this.lastID);
                }
            });
        })
    }

    getItems(){
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM ITEMS;';
            this.db.all(sql,(err,rows)=>{
                if (err) {
                    reject(err);
                    return;
                }
                if (!rows)
                    resolve([]);
                else {
                    let items = [];
                    rows.forEach(row => {
                        items.push(new Item(row.id, row.description, row.price, row.SKUId, row.supplierId));
                    });
                    resolve(items);
                }
            })
        })
    }

    getItemById(id){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM ITEMS WHERE id=?";
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row)
                    resolve(null);
                else {
                    const item = new Item(row.id, row.description, row.price, row.SKUId, row.supplierId);
                    resolve(item);
                }
            });
        });
    }

    createItem(id,description,price,SKUId,supplierId){
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO ITEMS(id,description,price,SKUId,supplierId) VALUES(?,?,?,?,?);";
            this.db.run(sql, [id,description,price,SKUId,supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    modifyItem(id,newDescription,newPrice,newSKUId,newSupplierId,oldId){
        return new Promise((resolve,reject)=>{
            const sql = 'UPDATE ITEMS SET id=?,description=?,price=?,SKUId=?,supplierId=? WHERE id=?;';
            this.db.run(sql,[id,newDescription,newPrice,newSKUId,newSupplierId,oldId],(err)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        })
    }

    deleteItem(id){
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM ITEMS WHERE ID=?";
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteAllItems(){
        return new Promise((resolve,reject)=>{
            this.db.run('DROP TABLE IF EXISTS ITEMS',(err)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve();
            });
        })
    }

    alreadySells(supplierId,id,SKUId){
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM ITEMS WHERE supplierId=? AND (id=? OR SKUId=?);';
            this.db.get(sql,[supplierId,id,SKUId],(err,row)=>{
                if(err){
                    reject(err);
                    return;
                }
                if(!row)
                    resolve(false);
                else
                    resolve(true);
            })
        })
    }
}
module.exports=ItemDB;