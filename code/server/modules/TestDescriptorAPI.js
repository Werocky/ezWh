'use strict';

const TestDescriptorDB = require("./TestDescriptorDB");
const SKUDB = require('./SKUsDB');

const { body, param, check, validationResult } = require('express-validator');

module.exports = function(app){
    
    //GET APIs

    //return an array with all the test descriptors
    //request body: none
    app.get('/api/testDescriptors', async (req, res) =>{
        let testDescriptors;
        try {
            testDescriptors = new TestDescriptorDB('WarehouseDB');
            testDescriptors = await testDescriptors.getTestDescriptors();
        } catch (err) {
            //service unavailable (generic error)
            return res.status(500).json();
        }
        //success, data retrieved
        return res.status(200).json(testDescriptors);
    })

    //return test descriptor present in the database with id = :id
    //request body: none
    //request header: id
    app.get('/api/testDescriptors/:id',
        param('id').isInt(),
        async (req, res) =>{

        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).json();
        }
        
        let  testDescriptors;
        try {
            testDescriptors = new TestDescriptorDB('WarehouseDB');
            testDescriptors = await testDescriptors.getTestDescriptors(id);
            if(Object.keys(testDescriptors).length === 0){
                //not found, no test descriptor associated to the id = :id
                return res.status(404).json();
            }
        } catch (err) {
            //service unavailable (generic error)
            return res.status(500).json();
        }
        //success, data retrieved
        return res.status(200).json(testDescriptors);
    })


    //post APIs

    //create a new test descriptor
    //request body: name, procedure description and idSKU
    app.post('/api/testDescriptors',
            body('name').isAscii(), 
            body('procedureDescription').isAscii(), 
            body('idSKU').isInt({min: 0}),
            async (req, res) =>{
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).json();
        }

        let testDescriptors;
        let skus;
        let sku;
        try{
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            sku = await skus.getSKUById(req.body.idSKU);
            if (!sku) {
                return res.status(404).json();
            }
            testDescriptors = new TestDescriptorDB('WarehouseDB');
            testDescriptors.createTestDescriptorTable();
            testDescriptors = await testDescriptors.createTestDescriptor(req.body.name, req.body.procedureDescription, req.body.idSKU);
        }catch(err){
            //service unavailable (generic error)
            return res.status(503).json();
        }
        //success, entry created
        return res.status(201).json();
    })


    //PUT APIs
    //modify a test descriptor for the id = :id
    //request body: new name, new procedureDescription, newIdSKU (all optional)
    //request header: id 
    app.put('/api/testDescriptors/:id',
            body('newName').isAscii(), 
            body('newProcedureDescription').isAscii(), 
            body('newIdSKU').isInt({min: 0}),
            param('id').isInt(),
            async (req, res) =>{
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).json();
        }

        let testDescriptors;
        let testDescriptor;
        let skus;
        let sku;
        try{
            testDescriptors = new TestDescriptorDB('WarehouseDB');
            testDescriptor = await testDescriptors.getTestDescriptor(req.param.id);
            if(!testDescriptor){
                //not found, no test descriptor associated to the id = :id
                return res.status(404).json();
            }
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            sku = await skus.getSKUById(req.body.newIdSKU);
            if (!sku) {
                return res.status(404).json();
            }
            testDescriptors.changeName(req.body.name, req.param.id);
            testDescriptors.changeProcedure(req.body.procedureDescription, req.param.id);
            testDescriptors.changeIdSKU(req.body.idSKU, req.param.id);
        }catch(err){
            //service unavailable, generic error
            return res.status(503).json();
        }
        //success, test descriptor updated
        return res.status(200).json();
    })


    //DELETE APIs
    //delete test descriptor with id = :id
    //request body: none
    //request header: id
    app.delete('/api/testDescriptors/:id',
            param('id').isInt(),
            async (req, res) =>{
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).json();
        }

        let testDescriptors;
        try{
            testDescriptors = new TestDescriptorDB('WarehouseDB');
            await testDescriptors.deleteTestDescriptor(req.param.id);
            if(Object.keys(testDescriptors).length === 0){
                //not found, no test descriptor associated to the id = :id
                return res.status(404).json();
            }
        }catch(err){
            //service unavailable, generic error
            return res.status(503).json();
        }
        //success, test descriptor deleted
        return res.status(204).json();
    })
}