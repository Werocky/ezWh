'use strict';

module.exports = class InternalOrderDB{
    sqlite = require('sqlite3');

    constructor(dbName){
        this.db = new this.sqlite.Database(dbName, (err) =>{
            if(err) throw err;
        });
    }

    createInternalTable(){
        return new Promise((resolve, reject) =>{
            const query = 'CREATE TABLE IF NOT EXISTS INTERNALORDERS(id INTEGER PRIMARY KEY AUTOINCREMENT, issueDate VARCHAR, state VARCHAR, products VARCHAR, customerId INTEGER)';
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
            const query = 'INSERT INTO INTERNALORDERS(issueDate, state, products, customerId) VALUES(?, ?, ?, ?)';
            this.db.run(query, [issueDate, state, products, customerId], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    };

    getInternalOrders(){
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
                    resolve(JSON.parse(JSON.stringify(rows)));
                }
            });
        });
    }

    getInternalOrders(id){
        return new Promise((resolve, reject) =>{
            const query = 'SELECT id as id, issueDate as issueDate, state as state, products as products, customerId as customerId FROM INTERNALORDERS WHERE id=?';
            this.db.all(query, [id], (err, rows) => {
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

    changeState(id, newState, products){
        return new Promise((resolve, reject) =>{
            const query = 'UPDATE INTERNALORDERS SET state=? WHERE id=?';
            this.db.run(query, [newState, id], (err) =>{
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
            this.db.run(sql, [id], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }
}