'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const RestockOrdersDB = require('../modules/RestockOrdersDB');
const PositionDB = require('../modules/PositionDB');
const SKUDB = require('../modules/SKUsDB');
const SKUItemDB = require('../modules/SKUItemsDB');
const TestDescriptorsDB = require('../modules/TestDescriptorDB');
const TestResultDB = require('../modules/TestResultDB');

chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test acceptance of SKU items of a restock order',()=>{

    beforeEach(async ()=>{

        let restockOrders = new RestockOrdersDB('WarehouseDB');
        await restockOrders.deleteAllRestockOrders();
        let skuItems = new SKUItemDB('WarehouseDB');
        await skuItems.deleteAllSKUItems();
        let skus = new SKUDB('WarehouseDB');
        await skus.deleteAllSKUs();
        let positions = new PositionDB('WarehouseDB');
        await positions.deleteAllPositions();
        let testResults = new TestResultDB('WarehouseDB');
        await testResults.deleteAllTestResults();
        let testDescriptors = new TestDescriptorsDB('WarehouseDB');
        await testDescriptors.deleteAllTestDescriptors();

        //pre-conditions for the scenarios
        await positions.createPositionTable();
        await skus.createSKUTable();
        await skuItems.createSKUItemsTable();
        await testDescriptors.createTestDescriptorTable();
        await testResults.createTestResultTable();
        await restockOrders.createRestockTable();
        await positions.createPosition("8000","3333","6486",1000,1000);
        await skus.createSKU("an sku",10,10,"first sku",10.99,10);
        await skuItems.createSKUItem("12345678901234567890123456789015",1,0,"2021/11/29 12:30");
        await skuItems.createSKUItem("12345678901234567890123456789016",1,0,"2021/11/29 12:30");
        await skuItems.createSKUItem("12345678901234567890123456789017",1,0,"2021/11/29 12:30");
        await testDescriptors.createTestDescriptor("test 1","do this...",1);
        await positions.changePosition("800033336486","8000","3333","6486",1000,1000,10*10,10*10);
        await skus.setSKUPosition(1,"800033336486");
        await restockOrders.createRestockOrder("2021/11/29 09:33",[{"SKUId":1,"itemId": 1, "description":"a product","price":10.99,"qty":3}],1)
        await restockOrders.changeState(1,"DELIVERED");
        let rO = await restockOrders.getRestockOrder(1);
        await restockOrders.addSKUItems(1,[{SKUId: 1, itemId: 1,rfid: "12345678901234567890123456789015"},{SKUId: 1, itemId: 1,rfid: "12345678901234567890123456789016"},{SKUId: 1,itemId: 1, rfid: "12345678901234567890123456789017"}],rO);

    })

    //SCENARIO 5-3-1
    stockAllSKUItems();
    //SCENARIO 5-3-3
    stockSomeSKUItems();

    after(async ()=>{

        let restockOrders = new RestockOrdersDB('WarehouseDB');
        await restockOrders.deleteAllRestockOrders();
        let skuItems = new SKUItemDB('WarehouseDB');
        await skuItems.deleteAllSKUItems();
        let skus = new SKUDB('WarehouseDB');
        await skus.deleteAllSKUs();
        let positions = new PositionDB('WarehouseDB');
        await positions.deleteAllPositions();
        let testResults = new TestResultDB('WarehouseDB');
        await testResults.deleteAllTestResults();
        let testDescriptors = new TestDescriptorsDB('WarehouseDB');
        await testDescriptors.deleteAllTestDescriptors();
    })
})

function stockAllSKUItems(){
    it('stock all',function(done){
        let rfids = ["12345678901234567890123456789015","12345678901234567890123456789016","12345678901234567890123456789017"]
            let testResult = {rfid: rfids[0], idTestDescriptor: 1, Date: "2021/11/28", Result: true}
            agent.post('/api/skuitems/testResult')
            .send(testResult)
            .then(function(res){
                res.should.have.status(201);
                agent.get('/api/skuitems/' + rfids[0] + '/testResults/1')
                .then(function(res){
                    res.should.have.status(200);
                    res.body.id.should.equal(1);
                    res.body.idTestDescriptor.should.equal(1)
                    res.body.Date.should.equal("2021/11/28")
                    res.body.Result.should.equal(true);
                    let testResult = {rfid: rfids[1], idTestDescriptor: 1, Date: "2021/11/28", Result: true}
                    agent.post('/api/skuitems/testResult')
                    .send(testResult)
                    .then(function(res){
                        res.should.have.status(201);
                        let testResult = {rfid: rfids[2], idTestDescriptor: 1, Date: "2021/11/28", Result: true}
                        agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function(res){
                            res.should.have.status(201);
                            agent.put('/api/restockOrder/1')
                            .send({newState: "TESTED"})
                            .then(function(res){
                                res.should.have.status(200);
                                agent.put('/api/skuitems/' + rfids[0])
                                .send({newRFID: rfids[0], newAvailable: 1, newDateOfStock: "2021/11/29 12:30"})
                                .then(function(res){
                                    res.should.have.status(200);
                                    agent.put('/api/skuitems/' + rfids[1])
                                    .send({newRFID: rfids[1], newAvailable: 1, newDateOfStock: "2021/11/29 12:30"})
                                    .then(function(res){
                                        res.should.have.status(200);
                                        agent.put('/api/skuitems/' + rfids[2])
                                        .send({newRFID: rfids[2], newAvailable: 1, newDateOfStock: "2021/11/29 12:30"})
                                        .then(function(res){
                                            res.should.have.status(200);
                                            agent.get('/api/skuitems/' +rfids[2])
                                            .then(function(res){
                                                res.should.have.status(200);
                                                res.body.Available.should.equal(1);
                                                agent.put('/api/restockOrder/1')
                                                .send({newState: "COMPLETED"})
                                                .then(function(res){
                                                    res.should.have.status(200);
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })   
                })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
        })  
}

function stockSomeSKUItems(){
    it('stock some',function(done){
        let rfids = ["12345678901234567890123456789015","12345678901234567890123456789016","12345678901234567890123456789017"]
            let testResult = {rfid: rfids[0], idTestDescriptor: 1, Date: "2021/11/28", Result: true}
            agent.post('/api/skuitems/testResult')
            .send(testResult)
            .then(function(res){
                res.should.have.status(201);
                agent.get('/api/skuitems/' + rfids[0] + '/testResults/1')
                .then(function(res){
                    res.should.have.status(200);
                    res.body.id.should.equal(1);
                    res.body.idTestDescriptor.should.equal(1)
                    res.body.Date.should.equal("2021/11/28")
                    res.body.Result.should.equal(true);
                    let testResult = {rfid: rfids[1], idTestDescriptor: 1, Date: "2021/11/28", Result: true}
                    agent.post('/api/skuitems/testResult')
                    .send(testResult)
                    .then(function(res){
                        res.should.have.status(201);
                        let testResult = {rfid: rfids[2], idTestDescriptor: 1, Date: "2021/11/28", Result: false}
                        agent.post('/api/skuitems/testResult')
                        .send(testResult)
                        .then(function(res){
                            res.should.have.status(201);
                            agent.put('/api/restockOrder/1')
                            .send({newState: "TESTED"})
                            .then(function(res){
                                res.should.have.status(200);
                                agent.put('/api/skuitems/' + rfids[0])
                                .send({newRFID: rfids[0], newAvailable: 1, newDateOfStock: "2021/11/29 12:30"})
                                .then(function(res){
                                    res.should.have.status(200);
                                    agent.put('/api/skuitems/' + rfids[1])
                                    .send({newRFID: rfids[1], newAvailable: 1, newDateOfStock: "2021/11/29 12:30"})
                                    .then(function(res){
                                        res.should.have.status(200);
                                        agent.put('/api/skuitems/' + rfids[2])
                                        .send({newRFID: rfids[2], newAvailable: 1, newDateOfStock: "2021/11/29 12:30"})
                                        .then(function(res){
                                           agent.get('/api/skuitems/' +rfids[2])
                                           .then(function(res){
                                               res.should.have.status(200);
                                               res.body.Available.should.equal(0);
                                               agent.put('/api/restockOrder/1')
                                               .send({newState: "COMPLETEDRETURN"})
                                               .then(function(res){
                                                   res.should.have.status(200);
                                               })
                                           })
                                        })
                                    })
                                })
                            })
                        })
                    })   
                })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
        })  
}
