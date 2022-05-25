'use strict';

module.exports = class TestResult{
    constructor(id = 0, idTestDescriptor, date, result,rfid){
        this.id = id;
        this.idTestDescriptor = idTestDescriptor;
        this.date = date;
        this.result = result;
        this.rfid = rfid;
    }

    getIdTestDescriptor(){
        return this.idTestDescriptor;
    }

    getId(){
        return this.id;
    }

    getDate(){
        return this.date;
    }

    getResult(){
        return this.result;
    }

    getRfid(){
        return this.rfid;
    }
}