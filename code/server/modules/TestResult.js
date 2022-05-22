'use strict';

module.exports = class TestResult{
    constructor(id = 0, idTestDescriptor, date, result){
        this.id = id;
        this.idTestDescriptor = idTestDescriptor;
        this.date = date;
        this.result = result;
    }

    getIdTestDescriptor(){
        return this.idTestDescriptor;
    }
}