'use strict';

const SKU = require('./SKU');

class SKUDB {
    sqlite = require('sqlite 3');

    constructor(dbName){
        this.db = new this.sqlite.Database((dbName,err) => {
            if(err)
                throw err;
        });
    }

    createSKUTable() {
        return new Promise((resolve,reject) =>{
            const sql = "CREATE TABLE IF NOT EXISTS SKUS(ID INTEGER PRIMARY KEY AUTOINCREMENT, description VARCHAR(50), weight FLOAT, volume FLOAT, notes VARCHAR(100), positionId VARCHAR(20), quantity INTEGER, price FLOAT, testDescriptors VARCHAR(30));";
            this.db.run(sql,(err)=> {
                if(err){
                    reject(err);
                return;
            }
            resolve(this.lastID);
            });
        });
    }

    getSKUs(){
        return new Promise((resolve,reject) => {
            const sql ="SELECT * FROM SKUS;"
            this.db.all(sql,(err,rows)=> {
                if(err){
                    reject(err);
                return;
                }
                if(!rows)
                    resolve(null);
                else
                    resolve(JSON.parse(JSON.stringify(rows)));
            });
        });
    }

    getSKUById(id){
        return new Promise((resolve,reject) => {
            const sql = "SELECT * from SKUS WHERE ID=?";
            this.db.all(sql,[id],(err,row)=>{
                if(err){
                    reject(err);
                    return;
                }
                if(!row)
                    resolve(null);
                else{
                    const sku = new SKU(row.description,row.weight,row.volume,row.notes,row.quantity,row.price,JSON.parse(row.testDescriptors),row.positionId,row.ID);
                    resolve(sku);
                }
            });
        });
    }

    createSKU(sku){
        return new Promise((resolve,reject) => {
            const sql = "INSERT INTO SKUS(description,weight,volume,notes,positionId,price,quantity,testDescriptors) VALUES(?,?,?,?,?,?,?);";
            this.db.run(sql,[sku.getDescription(),sku.getWeight(), sku.getVolume(), sku.getNotes(),"", sku.getPrice(), sku.getAvailableQuantity(), json_encode([]) ],(err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    modifySKU(sku){
        return new Promise((resolve,reject) => {
            const sql = "UPDATE SKUS SET(description=?,weight=?,volume=?,notes=?,price=?,quantity=?,testDescriptors=?) WHERE ID=?";
            this.db.run(sql,[sku.getDescription(),sku.getWeight(),sku.getVolume(),sku.getNotes(),sku.getPrice(), sku.getAvailableQuantity(),json_encode(sku.getTestDescriptors())],(err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    setSKUPosition(id,positionId){
        return new Promise((resolve,reject) => {
            const sql = "UPDATE SKUS SET(positionId=?) WHERE ID=?";
            this.db.run(sql,[positionId,id],(err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteSKU(id){
        return new Promise((resolve,reject)=> {
            const sql = "DELETE FROM SKUS WHERE ID=?";
            this.db.run(sql,[id],(err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }
    occupiedByOthers(positionId,ID){
        return new Promise((resolve,reject) => {
            const sql ="SELECT positionId FROM SKUS WHERE ID<>? AND positionId=?";
            this.db.run(sql,[ID,positionId],(err,rows)=>{
                if(err){
                    reject(err);
                    return;
                }
                if(!rows)
                    resolve(null);
                else
                    resolve(true);
            })
        })
    }
}
module.exports = SKUDB;