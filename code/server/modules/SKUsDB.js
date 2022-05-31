'use strict';

const SKU = require('./SKU');

class SKUDB {
    sqlite = require('sqlite3');

    constructor(dbName) {
        this.db = new this.sqlite.Database(dbName, (err) => {
            if (err)
                throw err;
        });
       this.db.run("PRAGMA foreign_keys = ON;");

    }


    async createSKUTable() {
        return new Promise((resolve, reject) => {
            //Update and delete policy: changes to positionId are propagated but a position can't be deleted as long as an SKU is stored in it
            const sql = "CREATE TABLE IF NOT EXISTS SKUS(ID INTEGER PRIMARY KEY, description VARCHAR(50), weight FLOAT, volume FLOAT, notes VARCHAR(100), positionId VARCHAR(12), quantity INTEGER, price FLOAT, testDescriptors VARCHAR(30), CHECK(quantity >= 0), FOREIGN KEY (positionId) REFERENCES POSITIONS (positionID) ON UPDATE CASCADE ON DELETE RESTRICT);";
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    async getSKUs() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM SKUS;"
            this.db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!rows)
                    resolve([]);
                else {
                    let skus = [];
                    rows.forEach(row => {
                        skus.push(new SKU(row.description, row.weight, row.volume, row.notes, row.quantity, row.price, JSON.parse(row.testDescriptors), row.positionId, row.ID));
                    });
                    resolve(skus);
                }

            });
        });
    }

    getSKUById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM SKUS WHERE ID=?";
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row)
                    resolve(null);
                else {
                    const sku = new SKU(row.description, row.weight, row.volume, row.notes, row.quantity, row.price, JSON.parse(row.testDescriptors), row.positionId, row.ID);
                    resolve(sku);
                }
            });
        });
    }

    async createSKU(description, weight, volume, notes, price, availableQuantity) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO SKUS(description,weight,volume,notes,price,quantity,testDescriptors, positionId) VALUES(?,?,?,?,?,?,?,?);";
            this.db.run(sql, [description, weight, volume, notes,price, availableQuantity, '[]', null], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    modifySKU(sku) {
        return new Promise(async (resolve, reject) => {
            const sql = "UPDATE SKUS SET description=?,weight=?,volume=?,notes=?,price=?,quantity=?,testDescriptors=? WHERE ID=?;";
                this.db.run(sql, [sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(), sku.getPrice(), sku.getAvailableQuantity(), JSON.stringify(sku.getTestDescriptors()), sku.getId()], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });
        });
    }

    async setSKUPosition(id, positionId) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE SKUS SET positionId=? WHERE ID=?;";
            this.db.run(sql, [positionId, id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    async deleteSKU(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM SKUS WHERE ID=?";
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }
    
    async occupiedByOthers(positionId, ID) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT positionId FROM SKUS WHERE ID<>? AND positionId=?";
            this.db.run(sql, [ID, positionId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!rows)
                    resolve(false);
                else
                    resolve(true);
            })
        })
    }

    deleteAllSKUs(){
        return new Promise((resolve,reject)=>{
            this.db.run('DROP TABLE IF EXISTS SKUS',(err)=>{
                if(err){
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        })
    }
}
module.exports = SKUDB;