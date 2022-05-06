'use strict';

dayjs = require('dayjs');
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

//Verify DB-dayjs-String interaction/compatibility

class SKUItem{
    
    constructor(rfid, SKUid, available, stockDate, position){ //TODO: correct design
        this.rfid = rfid;
        this.SKUid = SKUid;
        this.available = available;
        this.positions = new Map([[stockDate, position]]);
        this.testResults = [];
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

    getPositions(){
        return this.positions;
    }

    getCurrentPosition(){   //Verify if it works
        let date = dayjs('1/1/1900');
        for(const d of this.positions.entries()){
            if(d.stockDate.isAfter(date))
                date = d.stockDate;
        }
        return this.positions.get(d.stockDate);
    }
    getPositionAtDate(date){ //Verify if it works

        let stockDate;
        for(const d of this.positions.entries()){
            if(d.stockDate.isSameOrBefore(date))
                stockDate = date;
            else
                break;
        }
        return this.positions.get(stockDate);
    }

    relocate(date, position){
        if(this.getCurrentPosition() != position)
            this.positions.set(date, position);
    }

    getTestResults(){
        return this.testResults;
    }

    addTestResult(testResult){ //Verify whether checks are needed
        this.testResults.push(testResult);
    }

    getTestResultById(id){
        return this.testResults.find(tr => tr.getID() === id);
    }

    deleteTestResult(id){
        this.testResults = this.testResults.filter(tr => tr.getID() != id);
    }







    
}