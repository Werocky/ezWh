'use strict';

const { body, param, check, validationResult } = require('express-validator');

const TestResultDB = require("./TestResultDB");
const SKUItemsDB = require('./SKUItemsDB');
const TestDescriptorDB = require("./TestDescriptorDB");

module.exports = function(app){

    //GET APIs

    //return the test results for a certain sky item identified by rfid = :rfid
    //request body: none
    //request header: rfid
    app.get('/api/skuitems/:rfid/testResults',
            param('rfid').isLength({min:32, max:32}),
            async (req, res) =>{
        
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).end();
        }

        let testResult;
        try{
            testResult = new TestResultDB('WarehouseDB');
            testResult = await testResult.getTestResultsByRfid(req.params.rfid);
            if(!testResult)
                //not found, no test result associated to rfid = :rfid
                return res.status(404).end();
        }catch(err){
            //service unavailable, generic error
            return res.status(500).end();
        }
        //sucess, data retrieved
        return res.status(200).json(testResult);
    })

    //return a test result for a certain sky item idenfied by rfid
    //request body: none
    //request header: rfid, id
    app.get('/api/skuitems/:rfid/testResults/:id',
            param('rfid').isLength({min:32, max:32}),
            param('id').isInt({min:0}),        
            async (req, res) =>{
        
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).end();
        }

        let testResult;
        try{
            testResult = new TestResultDB('WarehouseDB');
            testResult = await testResult.getTestResultsByIdAndRfid(req.param.id, req.param.rfid);
            if(!testResult)
                //not found, no test result associatd to rfid = :rfid and id = :id
                return res.status(404).end();
        }catch(err){
            //service unavailable, generic error
            return res.status(500).end();
        }
        //success, data retrieved
        return res.stauts(200).json(testResult[0]);
    })


    //POST APIs
    //creates a new test result for a sku item idefied by rfid
    //request body: idTestDescriptor, Date and Result
    app.post('/api/skuitems/testResult',
            body('rfid').isLength({min: 32, max:32}), 
            body('idTestDescriptor').isInt({min: 0}),
            body('Date').isDate(), 
            body('Result').isBoolean(),
            async (req, res) =>{
        
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).end();
        }

        let testResult;
        let skuItems;
        let skuItem;
        let testDescriptors;
        let testDescriptor;
        try {
            skuItems = new SKUItemsDB('WarehouseDB');
            await skuItems.createSKUItemsTable();
            skuItem = await skuItems.getSKUItemByRFID(req.body.rfid);
            if (!skuItem) {
                //no sku item associated to rfid
                return res.status(404).end();
            }
            testDescriptors = new TestDescriptorDB('WarehouseDB');
            await testDescriptors.createTestDescriptorTable();
            testDescriptor = await testDescriptors.getTestDescriptors(req.body.idTestDescriptor);
            if (!testDescriptor) {
                //no test descriptor associated to idTestDescriptor
                return res.status(404).end();
            }
            testResult = new TestResultDB('WarehouseDB');
            await testResult.createTestResultTable();
            await testResult.createTestResult(req.body.rfid, req.body.idTestDescriptor, req.body.date, req.body.result);
        }catch(err){
            //service unavailable, generic error
            return res.status(503).end();
        }
        //sucess, entry created
        return res.status(201).end();
    })

    //PUT APIs

    //modify a test result identified by id = :id for a sku item identified by rfid = :rfid
    //request body = new testDescriptor, new Date and new Result
    //request header = id, rfid
    app.put('/api/skuitems/:rfid/testResult/:id',
            param('rfid').isLength({min:32, max:32}),
            param('id').isInt({min:0}),      
            body('newIdTestDescriptor').isInt({min: 0}),
            body('newDate').isDate(), 
            body('newResult').isBoolean(),
            async (req, res) =>{

        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).end();
        }

        let testResults
        try{
            testResults = new TestResultDB('WarehouseDB');
            testResults = await testResults.getTestResultsByIdAndRfid(req.param.id, req.param.rfid);
            if(Object.keys(testResults).length === 0)
                //not found, no test results associated to rfid = :rfid and id = :id
                return res.status(404).end();
            await testResults.changeTestResult(req.params.id, req.param.rfid, req.body.testDescriptor, req.body.date, req.body.result);
        }catch(err){
            //service unavailable, generic error
            return res.status(503).end();
        }
        //success, test result modified
        return res.status(200).end();
    })

    //DELETE APIs

    //delete a test result, given its id for a certain sku item identified by rfid
    //request body = none
    //request header = id, rfid
    app.delete('/api/skuitems/:rfid/testResult/:id',
            param('rfid').isLength({min:32, max:32}),
            param('id').isInt({min:0}),  
            async (req, res) =>{

        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).end();
        }

        let testResults;
        try{
            testResults = testResults('WarehouseDB');
            await testResults.deleteTestResult(req.params.id, req.params.rfid);
        }catch(err){
            //service unavailable, generic error
            return res.stauts(503).end();
        }
        //success, test result deleted
        return res.status(204).end();
    })
}