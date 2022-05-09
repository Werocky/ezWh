'use strict';

const TestResultDB = require("./TestResultDB");

module.exports = function(app){

    //GET APIs

    //return the test results for a certain sky item identified by rfid = :rfid
    //request body: none
    //request header: rfid
    app.get('/api/skuitems/:rfid/testResults', async (req, res) =>{
        if(!req.param.rfid)
            //unprocessable entity, validation of rfid failed
            return res.status(422).json();
        
        let testResult;
        try{
            testResult = new TestResultDB('WarehouseDB');
            testResult = await testResult.getTestResults(req.param.rfid);
            if(Object.keys(testResult).length === 0)
                //not found, no test result associated to rfid = :rfid
                return res.status(404).json();
        }catch(err){
            //service unavailable, generic error
            return res.status(500).json();
        }
        //sucess, data retrieved
        return res.status(200).json(testResult);
    })

    //return a test result for a certain sky item idenfied by rfid
    //request body: none
    //request header: rfid, id
    app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) =>{
        if(!(req.param.rfid && req.param.id))
            return res.status(422).json();

        let testResult;
        try{
            testResult = new TestResultDB('WarehouseDB');
            testResult = await testResult.getTestResultsByIdAndRfid(req.param.id, req.param.rfid);
            if(Object.keys(testResult).length === 0)
                //not found, no test result associatd to rfid = :rfid and id = :id
                return res.status(404).json();
        }catch(err){
            //service unavailable, generic error
            return res.status(500).json();
        }
        //success, data retrieved
        return res.stauts(200).json(testResult);
    })


    //POST APIs
    //creates a new test result for a sku item idefied by rfid
    //request body: idTestDescriptor, Date and Result
    app.post('/api/skuitems/testResult', (req, res) =>{
        
        //unprocessable entity, validation of request body failed
        if(Object.keys(req.body).length!==3)
            return res.status(422).json();

        let testResult
        try{
            testResult = new TestResultDB('WarehouseDB');
            testResult.createTestResultTable();
            testResult.createTestResult(req.body.idTestDescriptor, req.body.date, req.body.result);
        }catch(err){
            //service unavailable, generic error
            return res.status(503).json();
        }
        //sucess, entry created
        return res.status(200).json();
    })

    //PUT APIs

    //modify a test result identified by id = :id for a sku item identified by rfid = :rfid
    //request body = new testDescriptor, new Date and new Result
    //request header = id, rfid
    app.put('/api/skuitems/:rfid/testResult/:id', async (req, res) =>{

        if(!(req.param.id || req.param.rfid))
            //unprocessable entity, validation of request body failed
            return res.status(422).json();

        let testResults
        try{
            testResults = new TestResultDB('WarehouseDB');
            testResults = await testResults.getTestResultsByIdAndRfid(req.param.id, req.param.rfid);
            if(Object.keys(testResults).length === 0)
                //not found, no test results associated to rfid = :rfid and id = :id
                return res.status(404).json();
            await testResults.changeTestResult(req.param.id, req.body.testDescriptor, req.body.date, req.body.result);
        }catch(err){
            //service unavailable, generic error
            return res.status(503).json();
        }
        //success, test result modified
        return res.status(200).json();
    })

    //DELETE APIs

    //delete a test result, given its id for a certain sku item identified by rfid
    //request body = none
    //request header = id, rfid
    app.delete('/api/skuitems/:rfid/testResult/id', async (req, res) =>{
        let testResults;
        try{
            testResults = testResults('WarehouseDB');
            await testResults.deleteTestResult(req.params.id, req.param.rfid);
        }catch(err){
            //service unavailable, generic error
            return res.stauts(503).json();
        }
        //success, test result deleted
        return res.status(204).json();
    })
}