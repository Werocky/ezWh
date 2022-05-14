'use strict';

module.exports = class TestResultDB{
    sqlite = require('sqlite3');

    constructor(dbName){
        this.db = new this.sqlite.Database(dbName, (err) =>{
            if(err) throw err;
        });
    }

    createTestResultTable(){
        return new Promise((resolve, reject) => {
            const query = 'CREATE TABLE IF NOT EXISTS TESTRESULT(ID INTEGER PRIMARY KEY AUTOINCREMENT, idTestDescriptor INTEGER, date VARCHAR, result BOOLEAN';
            this.db.run(query, (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTestResult(idTestDescriptor, date, result){
        return new Promise((resolve, reject) =>{
            const query = 'INSERT INTO TESTRESULT(idTestDescriptor, date, result) VALUES(?, ?, ?)';
            this.db.run(query, [idTestDescriptor, date, result], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getTestResults(){
        return new Promise((resolve, reject) =>{
            const query = 'SELECT id as id, idTestDescriptor as idTestDescriptor, date as date, result as result FROM TESTRESULT';
            this.db.all(query, (err, rows) =>{
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    resolve(null);
                }else{
                    resolve(JSON.parse(JSON.stringify(rows)));
                }
            });
        });
    }

    getTestResultsByRfid(rfid){
        return new Promise((resolve, reject) =>{
            const query = 'SELECT id as id, idTestDescriptor as idTestDescriptor, date as date, result as result FROM TESTRESULT WHERE rfid = ?';
            this.db.all(query, [rfid], (err, rows) =>{
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    resolve(null);
                }else{
                    resolve(JSON.parse(JSON.stringify(rows)));
                }
            });
        });
    }

    getTestResultsByIdAndRfid(id, rfid){
        return new Promise((resolve, reject) =>{
            const query = 'SELECT id as id, idTestDescriptor as idTestDescriptor, date as date, result as result FROM TESTRESULT WHERE id = ? AND rfid = ?';
            this.db.all(query, [id, rfid], (err, rows) =>{
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    resolve(null);
                }else{
                    resolve(JSON.parse(JSON.stringify(rows)));
                }
            });
        });
    }

    changeTestResult(id, testDescriptor, date, result){
        return new Promise((resolve, reject) =>{
            const query = 'UPDATE TESTRESULT SET testDescriptor = ?, date = ?, result = ? WHERE id = ?';
            this.db.run(query, [testDescriptor, date, result, id], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteTestResult(id, rfid){
        return new Promise((resolve, reject) =>{
            const query = 'DELETE FROM TESTRESULT WHERE id = ? AND rfid = ?';
            this.db.run(query, [id, rfid], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }
}