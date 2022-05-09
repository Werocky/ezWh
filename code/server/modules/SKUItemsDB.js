'use strict';

const SKUItem = require('./SKUItem');

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
}

module.exports = SKUItemsDB;