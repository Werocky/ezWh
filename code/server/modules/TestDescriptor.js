'use strict';

module.exports = class TestDescriptor{
    constructor(id = 0, name, procedureDescription, idSKU){
        this.id = id;
        this.name = name;
        this.procedureDescription = procedureDescription;
        this.idSKU = idSKU;
    }

    getId(){
        return this.id;
    }
    
    getName(){
        return this.name;
    }

    getProcedureDescription(){
        return this.procedureDescription;
    }

    getIdSku(){
        return this.idSKU;
    }

    setSkuId(id){
        this.idSKU = id;
    }


}