'use strict';

const SKUItem = require('./SKUItem');
const dayjs = require('dayjs');

class SKUItemsDB{
    sqlite = require('sqlite3');
    constructor(dbName){
        this.db = new this.sqlite.Database(dbName,(err) =>{
            if(err) throw err;
        });
    }

    createSKUItemsTable(){
        return new Promise((resolve,reject)=>{
            const sql ='CREATE TABLE IF NOT EXISTS SKUITEMS(RFID VARCHAR(32) PRIMARY KEY, SKUId INTEGER, Available INTEGER, DateOfStock VARCHAR(20))';
            this.db.run(sql,(err)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getSKUItems(){
        return new Promise((resolve,reject) => {
            const sql = 'SELECT * FROM SKUITEMS';
            this.db.all(sql,(err,rows)=>{
                if(err){
                    reject(err);
                    return;
                }
                if(!rows)
                    resolve(null);
                else{
                        let SKUItems = [];
                        rows.Array.forEach(row => {
                            SKUItems.push(new SKUItem(row.RFID,row.SKUId,row.Available,row.DateOfStock));
                        });
                        resolve(SKUItems);
                }
            })
        })
    }

    getAvailableSKUItemsBySKUId(SKUId){
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM SKUITEMS WHERE Available=1 AND SKUId=?';
            this.db.all(sql,[SKUId],(err,rows)=>{
                if(err){
                    reject(err);
                    return;
                }
                if(!rows)
                    resolve(null);
                    else{
                        let SKUItems = [];
                        rows.Array.forEach(row => {
                            SKUItems.push(new SKUItem(row.RFID,row.SKUId,row.Available,row.DateOfStock));
                        });
                        resolve(SKUItems);
                    }
             });
        });
        }

    getSKUItemByRFID(rfid){
        return new Promise((resolve,reject)=>{
            const sql = 'SELECT * FROM SKUITEMS WHERE RFID=?';
            this.db.get(sql,[rfid],(err,row) =>{
                if(err){
                    reject(err);
                    return;
                }
                else{
                    if(!row)
                        resolve(null);
                    else{
                        const skuItem = new SKUItem(row.RFID,row.SKUId,row.Available,row.DateOfStock);
                        resolve(skuItem);
                    }
                }
            });
        });
    }

    createSKUItem(skuItem){
        return new Promise((resolve,reject)=>{
            const sql = 'INSERT INTO SKUITEMS(RFID,SKUId,Available,DateOfStock) VALUES (?,?,?,?);';
            this.db.run(sql,[skuItem.RFID,skuItem.SKUId,skuItem.Available,skuItem.DateOfStock],(err)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        })
    }

    deleteSKUItem(rfid){
        return new Promise((resolve,reject)=>{
            const sql= 'DELETE FROM SKUITEMS WHERE RFID =?;';
            this.db.run(sql,[rfid],(err)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        })
    }
}

module.exports = SKUItemsDB;