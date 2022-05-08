'use strict'

const Position = require('./Position');
const sqlite = require('sqlite3');

class PositionDB {

  constructor(dbName) {
      this.db = new sqlite.Database(dbName, (err) => {
          if(err) throw err;
      });
  }

  createPositionTable() {
    return new Promise((resolve, reject)  => {
        const sql = 'CREATE TABLE IF NOT EXISTS POSITIONS(positionID VARCHAR ,aisleID VARCHAR, row VARCHAR, col VARCHAR, maxWeight INTEGER, maxVolume INTEGER, occupiedWeight INTEGER, occupiedVolume INTEGER)';
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
        const sql = 'SELECT positionID as positionID, aisleID as aisleID, row as row, col as col, maxWeight as maxWeight, maxVolume as maxVolume, occupiedWeight as occupiedWeight FROM POSITIONS';
        this.db.all(sql, (err, rows) => {
            if (err) {
            reject(err);
            return;
            }
            if (rows) {
                resolve(rows);
            }
        });
    });
  }

  createPosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
    let position = new Position(positionID, aisleID, row, col, maxWeight, maxVolume)
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO POSITIONS(positionID, aisleID, row, col, maxWeight, maxVolume) VALUES(?, ?, ?, ?, ?, ?)';
        this.db.run(sql, [positionID, aisleID, row, col, maxWeight, maxVolume], (err) => {
            if (err) {
            reject(err);
            return;
            }
            resolve(this.lastID);
        });
    });
  }

  changePosition(positionID, aisleID, row, col, maxWeight, maxVolume) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE POSITIONS SET aisleID=?, row=?, col=?, maxWeight=?, maxVolume=? WHERE positionID=?';
        this.db.run(sql, [aisleID, row, col, maxWeight, maxVolume, positionID], (err) => {
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
        const sql = 'UPDATE POSITIONS SET positionID=? WHERE positionID=?';
        this.db.run(sql, [newPositionID, positionID], (err) => {
            if (err) {
            reject(err);
            return;
            }
            resolve(this.lastID);
        });
    });
  }

  deletePosition(positionID) {
    return new Promise((resolve, reject) => {
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
