'use strict';

const TestDescriptorDB = require("./TestDescriptorDB");

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
    app.get('/api/testDescriptors/:id', async (req, res) =>{
        if(!req.param.id)
            //unprocessable entity, validation of id failed
            return res.status(422).json();
        
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
    app.post('/api/testDescriptors', async (req, res) =>{
        if(Object.keys(req.body).length !==3)
            //unprocessable entity, validation of request body failed
            return res.status(422).json();
        
        let testDescriptors;
        try{
            testDescriptors = new TestDescriptorDB('WarehouseDB');
            testDescriptors.createTestDescriptorTable
            testDescriptors = await testDescriptors.createTestDescriptor(req.body.name, req.body.procedureDescription, req.body.idSKU);
            if(Object.keys(testDescriptors).length === 0){
                //not found, nothing found associated to the idSKU
                return res.status(404).json();
            }
        }catch(err){
            //service unavailable (generic error)
            return res.status(503).json();
        }
        //success, entry created
        return res.status(201).json
    })


    //PUT APIs
    //modify a test descriptor for the id = :id
    //request body: new name, new procedureDescription, newIdSKU (all optional)
    //request header: id 
    app.put('/api/testDescriptors/:id', async (req, res) =>{
        if(Object.keys(req.body).length < 1 || !req.param.id) 
            //unprocessable entity, validation of request body or id failed
            return res.status(422).json();
        
        let testDescriptors;
        try{
            testDescriptors = new TestDescriptorDB('WarehouseDB');
            testDescriptors = await testDescriptors.getTestDescriptor(req.param.id);
            
            if(Object.keys(testDescriptors).length === 0){
                //not found, no test descriptor associated to the id = :id
                return res.status(404).json();
            }

            if(req.body.name)
                testDescriptors.changeName(req.body.name, req.param.id);
            if(req.body.procedureDescription)
                testDescriptors.changeProcedure(req.body.procedureDescription, req.param.id);
            if(req.body.idSKU)
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
    app.delete('/api/testDescriptors/:id', async (req, res) =>{
        if(!req.param.id)
            //unprocessable entity, validation of id failed
            return res.status(422).json();
        
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