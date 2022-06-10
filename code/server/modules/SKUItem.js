'use strict';

const dayjs = require('dayjs');

//Verify DB-dayjs-String interaction/compatibility

class SKUItem{
    
    constructor(RFID, SKUId, Available, DateOfStock){ //TODO: correct design
        this.RFID = RFID;
        this.SKUId = SKUId;
        this.Available = Available;
        this.DateOfStock = DateOfStock;
    }

    getRfid(){
        return this.RFID;
    }

    setRfid(RFID){
        this.RFID = RFID;
    }

    getSKUId(){
        return this.SKUId;
    }

    getAvailable(){
        return this.Available;
    }
    
    setAvailable(Available){
        this.Available = Available;
    }

    getStockDate(){
        return this.DateOfStock;
    }

    setStockDate(DateOfStock){
        this.DateOfStock = DateOfStock;
    }
    
}
module.exports = SKUItem;