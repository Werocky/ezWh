'use strict';

module.exports = class TestDescriptorDB{
    sqlite = require('sqlite3');

    constructor(dbName){
        this.db = new this.sqlite.Database(dbName, (err) =>{
            if(err) throw err;
        });
    }

    createTestDescriptorTable(){
        return new Promise((resolve, reject) =>{
            const query = 'CREATE TABLE IF NOT EXISTS TESTDESCRIPTOR(ID INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, procedureDescription VARCHAR, idSKU INTEGER';
            this.db.run(query, (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    createTestDescriptor(name, procedureDescription, idSKU){
        return new Promise((resolve, reject) =>{
            const query = 'INSERT INTO TESTDESCRIPTOR(name, procedureDescription, idSKU) VALUES(?, ?, ?)';
            this.db.run(query, [name, procedureDescription, idSKU], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    updateTestDescriptor(descriptor){
        return new Promise((resolve, reject) =>{
            const query = 'UPDATE TESTDESCRIPTOR SET name = ?, procedureDescription = ?, idSKU = ? WHERE id = ?';
            this.db.run(query, [descriptor.getName(), descriptor.getProcedureDescription(), descriptor.getIdSku(), descriptor.getId()], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getTestDescriptors(){
        return new Promise((resolve, reject) =>{
            const query = 'SELECT id as id, name as name, procedureDescription as procedureDescription, idSKU as idSKU FROM TESTDESCRIPTOR';
            this.db.all(query, (err,rows) =>{
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    resolve(null);
                }else{
                    resolve(new InternalOrder(rows.id, rows.name, rows.procedureDescription, rows.idSKU));
                }
            });
        });
    }

    getTestDescriptor(id){
        return new Promise((resolve, reject) =>{
            const query = 'SELECT id as id, name as name, procedureDescription as procedureDescription, idSKU as idSKU FROM TESTDESCRIPTOR WHERE id = ?';
            this.db.get(query, [id], (err,row) =>{
                if(err){
                    reject(err);
                    return;
                }
                if(!row){
                    resolve(null);
                }else{
                    resolve(new InternalOrder(rows.id, rows.name, rows.procedureDescription, rows.idSKU));
                }
            });
        });
    }

    getTestDescriptorBySku(id){
        return new Promise((resolve, reject) =>{
            const query = 'SELECT id as id, name as name, procedureDescription as procedureDescription, idSKU as idSKU FROM TESTDESCRIPTOR WHERE idSKU = ?';
            this.db.get(query, [id], (err,row) =>{
                if(err){
                    reject(err);
                    return;
                }
                if(!row){
                    resolve(null);
                }else{
                    resolve(new InternalOrder(rows.id, rows.name, rows.procedureDescription, rows.idSKU));
                }
            });
        });
    }

    changeName(id, name){
        return new Promise((resolve, reject) =>{
            const query = 'UPDATE TESTDESCRIPTOR SET name=? WHERE id=?';
            this.db.run(query, [name, id], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    changeProcedure(id, procedure){
        return new Promise((resolve, reject) =>{
            const query = 'UPDATE TESTDESCRIPTOR SET procedureDescription=? WHERE id=?';
            this.db.run(query, [procedure, id], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    changeIdSKU(id, idSKU){
        return new Promise((resolve, reject) =>{
            const query = 'UPDATE TESTDESCRIPTOR SET idSKU=? WHERE id=?';
            this.db.run(query, [idSKU, id], (err) =>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    deleteTestDescriptor(id){
        return new Promise((resolve, reject) =>{
            const query = 'DELETE FROM TESTDESCRIPTOR WHERE id = ?';
            this.db.run(query, [id], (err) =>{
                if (err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        })
    }

    deleteAllTestDescriptors(){
        return new Promise((resolve, reject) =>{
            const query = 'DROP TABLE IF EXISTS TESTDESCRIPTOR';
            this.db.run(query, [id], (err) =>{
                if (err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        })
    }
}