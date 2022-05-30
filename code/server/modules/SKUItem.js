'use strict';

const dayjs = require('dayjs');

//Verify DB-dayjs-String interaction/compatibility

class SKUItem{
    
    constructor(rfid, SKUid, available, stockDate){ //TODO: correct design
        this.rfid = rfid;
        this.SKUid = SKUid;
        this.available = available;
        this.stockDate = stockDate
    }

    getRfid(){
        return this.rfid;
    }

    setRfid(rfid){
        this.rfid = rfid;
    }

    getSKUId(){
        return this.SKUid;
    }

    getAvailable(){
        return this.available;
    }
    
    setAvailable(available){
        this.available = available;
    }

    getStockDate(){
        return this.stockDate;
    }

    setStockDate(stockDate){
        this.stockDate = stockDate;
    }
    
}
module.exports = SKUItem;