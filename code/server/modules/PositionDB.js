'use strict'

const sqlite = require('sqlite3');
const Position = require('./Position');
const SKUsDB = require('./SKUsDB');

class PositionDB {

  constructor(dbName) {
      this.db = new sqlite.Database(dbName, (err) => {
          if(err) throw err;
      });
  }

  createPositionTable() {
    return new Promise((resolve, reject)  => {
        const sql = 'CREATE TABLE IF NOT EXISTS POSITIONS(positionID VARCHAR ,aisleID VARCHAR, row VARCHAR, col VARCHAR, maxWeight INTEGER, maxVolume INTEGER, occupiedWeight INTEGER, occupiedVolume INTEGER, CHECK(maxWeight >= occupiedWeight AND maxVolume >= occupiedVolume));';
        this.db.run(sql, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
  }

  getPositions() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM POSITIONS';
        this.db.all(sql, (err, rows) => {
            if (err) {
            reject(err);
            return;
            }
            if (!rows) {
                resolve(null);
            }
            let positions = [];
            rows.forEach(row => {
                positions.push(new Position(row.positionID, row.aisleID, row.row, row.col, row.maxWeight, row.maxVolume, row.occupiedWeight, row.occupiedVolume))
            });
            resolve(positions);
        });
    });
  }

  getPosition(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT positionID as positionID, aisleID as aisleID, row as row, col as col, maxWeight as maxWeight, maxVolume as maxVolume, occupiedWeight as occupiedWeight, occupiedVolume as occupiedVolume FROM POSITIONS WHERE positionID=?';
        this.db.get(sql, [id], (err, row) => {
            if (err) {
            reject(err);
            return;
            }
            if (!row) {
                resolve(null);
            }
            const position = new Position(row.positionID, row.aisleID, row.row, row.col, row.maxWeight, row.maxVolume, row.occupiedWeight, row.occupiedVolume);
            resolve(position);
        });
    });
  }

  createPosition(aisleID, row, col, maxWeight, maxVolume) {
    return new Promise((resolve, reject) => {
        let positionID = aisleID.concat(row, col);
        const sql = 'INSERT INTO POSITIONS(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        this.db.run(sql, [positionID, aisleID, row, col, maxWeight, maxVolume, 0, 0], (err) => {
            if (err) {
            reject(err);
            return;
            }
            resolve(this.lastID);
        });
    });
  }

  changePosition(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) {
    return new Promise((resolve, reject) => {
        let newPositionID = aisleID.concat(row, col);
        const sql = 'UPDATE POSITIONS SET positionID=?, aisleID=?, row=?, col=?, maxWeight=?, maxVolume=?, occupiedWeight=?, occupiedVolume=? WHERE positionID=?';
        this.db.run(sql, [newPositionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, positionID], (err) => {
            if (err) {
            reject(err);
            return;
            }
            resolve(this.lastID);
        });
    });
  }

  changePositionID(positionID, newPositionID) {
    return new Promise((resolve, reject) => {
        let skus = new SKUsDB('WarehouseDB');
        skus.createSKUTable();
        skus = skus.getSKUs();
        let i = 0;
        while (i < skus.length) {
            if (skus[i].positionID === positionID) {
                skus.setSKUPosition(skus[i].id,newPositionID);
            }
            i++;
        }
        const aisleID = newPositionID.substring(0,4);
        const row = newPositionID.substring(4,8);
        const col = newPositionID.substring(8,12);
        const sql = 'UPDATE POSITIONS SET positionID=?, aisleID=?, row=?, col=? WHERE positionID=?';
        this.db.run(sql, [newPositionID, aisleID, row, col, positionID], (err) => {
            if (err) {
            reject(err);
            return;
            }
            resolve(this.lastID);
        });
    });
  }

  async modifyPosition(position) {
    return changePosition(position.positionID, position.aisleID, position.row, position.col, position.maxWeight, position.maxVolume, position.occupiedWeight, position.occupiedVolume);
  }

  deletePosition(positionID) {
    return new Promise((resolve, reject) => {
        let skus = new SKUsDB('WarehouseDB');
        skus.createSKUTable();
        skus = skus.getSKUs();
        let emptyPos = true;
        let i = 0;
        while (emptyPos === true && i < skus.length) {
            if (skus[i].positionID === positionID) {
                emptyPos = false;
                break;
            }
            i++;
        }
        if (emptyPos === false) {
            reject(err);
        }
        const sql = 'DELETE FROM POSITIONS WHERE positionID=?';
        this.db.run(sql, [positionID], (err) => {
            if (err) {
                reject(err);
            } else{
                resolve(this.lastID);
            }
        });
    });
  }
  
}

module.exports = PositionDB;
