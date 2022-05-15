'use strict';

const PositionDB = require('./PositionDB');
const Position = require('./Position');
const SKU = require('./SKU');

class SKUDB {
    sqlite = require('sqlite3');

    constructor(dbName) {
        this.db = new this.sqlite.Database(dbName, (err) => {
            if (err)
                throw err;
        });
    }

    async createSKUTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS SKUS(ID INTEGER PRIMARY KEY AUTOINCREMENT, description VARCHAR(50), weight FLOAT, volume FLOAT, notes VARCHAR(100), positionId VARCHAR(20), quantity INTEGER, price FLOAT, testDescriptors VARCHAR(30), CHECK(quantity >= 0));";
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
            const sql = "INSERT INTO SKUS(description,weight,volume,notes,positionId,price,quantity,testDescriptors) VALUES(?,?,?,?,?,?,?,?);";
            this.db.run(sql, [description, weight, volume, notes, "", price, availableQuantity, '[]'], (err) => {
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
            try {
                const positions = new PositionDB('WarehouseDB');
                await positions.createPositionTable();
                const oldSku = await this.getSKUById(sku.getId());
                if (sku.getPositionId()) {
                    const position = await positions.getPosition(sku.getPositionId());
                    if (oldSku.getAvailableQuantity() !== sku.getAvailableQuantity() || oldSku.getWeight() != sku.getWeight() || oldSku.getVolume() != sku.getVolume()) {
                        if (position.fits(sku.getTotalWeight(), sku.getTotalVolume())) {

                            await positions.changePosition(position.aisleID, position.row, position.col, position.maxWeight, position.maxVolume, sku.getTotalWeight(), sku.getTotalVolume());
                        }
                        else {
                            console.log(position.fits(sku.getTotalWeight(), sku.getTotalVolume()));
                            //console.log("Not fit");  //Still to be tested
                            reject("Does not fit");
                            return;
                        }
                    }
                }
                this.db.run(sql, [sku.getDescription(), sku.getWeight(), sku.getVolume(), sku.getNotes(), sku.getPrice(), sku.getAvailableQuantity(), JSON.stringify(sku.getTestDescriptors()), sku.getId()], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                });
            }
            catch (err) {
                reject(err);
                return;
            }
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
}
module.exports = SKUDB;