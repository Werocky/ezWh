'use strict';

const TestDescriptorDB = require("./TestDescriptorDB");
const SKUDB = require('./SKUsDB');

const { body, param, check, validationResult } = require('express-validator');
const TestResultDB = require("./TestResultDB");

module.exports = function (app) {

    //GET APIs

    //return an array with all the test descriptors
    //request body: none
    app.get('/api/testDescriptors', async (req, res) => {
        let testDescriptors;
        try {
            testDescriptors = new TestDescriptorDB('WarehouseDB');
            await testDescriptors.createTestDescriptorTable();
            testDescriptors = await testDescriptors.getTestDescriptors();
        } catch (err) {
            //service unavailable (generic error)
            return res.status(500).end();
        }
        //success, data retrieved
        return res.status(200).json(testDescriptors);
    })

    //return test descriptor present in the database with id = :id
    //request body: none
    //request header: id
    app.get('/api/testDescriptors/:id',
        param('id').isInt(),
        async (req, res) => {

            const err = validationResult(req);

            if (!err.isEmpty()) {
                return res.status(422).end();
            }

            let testDescriptors;
            try {
                testDescriptors = new TestDescriptorDB('WarehouseDB');
                await testDescriptors.createTestDescriptorTable();
                testDescriptors = await testDescriptors.getTestDescriptor(req.params.id);
                if (!testDescriptors) {
                    //not found, no test descriptor associated to the id = :id
                    return res.status(404).end();
                }
            } catch (err) {
                //service unavailable (generic error)
                return res.status(500).end();
            }
            //success, data retrieved
            return res.status(200).json(testDescriptors);
        })


    //post APIs

    //create a new test descriptor
    //request body: name, procedure description and idSKU
    app.post('/api/testDescriptor',
        body('name').isString().isLength({ min: 1 }),
        body('procedureDescription').isString().isLength({ min: 1 }),
        body('idSKU').isInt({ min: 0 }),
        async (req, res) => {
            const err = validationResult(req);

            if (!err.isEmpty()) {
                return res.status(422).end();
            }

            let testDescriptors;
            let skus;
            let sku;
            try {
                skus = new SKUDB('WarehouseDB');
                await skus.createSKUTable();
                sku = await skus.getSKUById(req.body.idSKU);
                if (!sku) {
                    return res.status(404).end();
                }
                testDescriptors = new TestDescriptorDB('WarehouseDB');
                await testDescriptors.createTestDescriptorTable();
                await testDescriptors.createTestDescriptor(req.body.name, req.body.procedureDescription, req.body.idSKU);
                sku.setTestDescriptors([req.param.id]);
                await skus.modifySKU(sku);
            } catch (err) {
                //service unavailable (generic error)
                return res.status(503).end();
            }
            //success, entry created
            return res.status(201).end();
        })


    //PUT APIs
    //modify a test descriptor for the id = :id
    //request body: new name, new procedureDescription, newIdSKU (all optional)
    //request header: id 
    app.put('/api/testDescriptor/:id',
        body('newName').isString().isLength({ min: 1 }),
        body('newProcedureDescription').isString().isLength({ min: 1 }),
        body('newIdSKU').isInt({ min: 0 }),
        param('id').isInt(),
        async (req, res) => {
            const err = validationResult(req);

            if (!err.isEmpty()) {
                return res.status(422).end();
            }

            let testDescriptors;
            let testDescriptor;
            let skus;
            let sku;
            let oldSku = [];
            try {
                testDescriptors = new TestDescriptorDB('WarehouseDB');
                await testDescriptors.createTestDescriptorTable();
                testDescriptor = await testDescriptors.getTestDescriptor(req.params.id);
                if (!testDescriptor) {
                    //not found, no test descriptor associated to the id = :id
                    return res.status(404).end();
                }
                skus = new SKUDB('WarehouseDB');
                await skus.createSKUTable();
                sku = await skus.getSKUById(req.body.newIdSKU);
                if (!sku) {
                    return res.status(404).end();
                }

                //if the id of the sku is update, remove from the old sku and add it to the new one
                if (testDescriptor.idSKU !== req.params.id) {
                    //update old sku descriptor's list
                    oldSku.map(async e => { await e.getSKUById(req.params.id) });

                    if (oldSku.testDescriptors) {
                        let descriptors = oldSku.testDescriptors;
                        oldSku.setTestDescriptors(descriptors.filter(e => e !== testDescriptor.idSKU));
                        await skus.modifySKU(oldSku);
                    }
                    //update new sku descriptor's list
                    sku.setTestDescriptors([req.param.id]);
                    await skus.modifySKU(sku);
                }
                await testDescriptors.changeName(req.body.newName, req.params.id);
                await testDescriptors.changeProcedure(req.body.newProcedureDescription, req.params.id);
                await testDescriptors.changeIdSKU(req.body.newIdSKU, req.params.id);
            } catch (err) {
                //service unavailable, generic error
                return res.status(503).end();
            }
            //success, test descriptor updated
            return res.status(200).end();
        })


    //DELETE APIs
    //delete test descriptor with id = :id
    //request body: none
    //request header: id
    app.delete('/api/testDescriptor/:id',
        param('id').isInt(),
        async (req, res) => {
            const err = validationResult(req);

            if (!err.isEmpty()) {
                return res.status(422).end();
            }

            let testDescriptors;
            let testDescriptor;
            let testResults;
            let testResult;
            try {
                testDescriptors = new TestDescriptorDB('WarehouseDB');
                await testDescriptors.createTestDescriptorTable();
                testDescriptor = await testDescriptors.getTestDescriptor(req.params.id);
                testResults = new TestResultDB('WarehouseDB');
                await testResults.createTestResultTable();
                testResult = await testResults.getTestResultsByTestDescriptor(req.params.id);
                //test descriptor not found
                if (!testDescriptor) {
                    //not found, no test descriptor associated to the id = :id
                    return res.status(404).end();
                }

                //test descriptor is used by some sku, cannot delete
                if (!testDescriptor)
                    return res.status(503).end();

                //test descriptor is used by some test result, cannot delete
                if (testResult.idTestDescriptor)
                    return res.status(503).end();

                await testDescriptors.deleteTestDescriptor(req.params.id);
            } catch (err) {
                //service unavailable, generic error
                return res.status(503).end();
            }
            //success, test descriptor deleted
            return res.status(204).end();
        })
}