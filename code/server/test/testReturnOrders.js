'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { after } = require('mocha');
const RestockOrdersDB = require('../modules/RestockOrdersDB');
const ReturnOrdersDB = require('../modules/ReturnOrdersDB');
const PositionDB = require('../modules/PositionDB');
const SKUDB = require('../modules/SKUsDB');
const SKUItemDB = require('../modules/SKUItemsDB');
const TestDescriptorsDB = require('../modules/TestDescriptorDB');
const TestResultDB = require('../modules/TestResultDB');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test return order of SKU items use cases', () => {

    beforeEach(async () => {
        try {
            const restockOrders = new RestockOrdersDB('WarehouseDB');
            await restockOrders.deleteAllRestockOrders();
            const returnOrders = new ReturnOrdersDB('WarehouseDB');
            await returnOrders.deleteAllReturnOrders();
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
            await positions.createPosition("8000", "3333", "6486", 1000, 1000);
            await skus.createSKU("an sku", 10, 10, "first sku", 10.99, 10);
            await skuItems.createSKUItem("12345678901234567890123456789015", 1, 0, "2021/11/29 12:30");
            await skuItems.createSKUItem("12345678901234567890123456789016", 1, 0, "2021/11/29 12:30");
            await skuItems.createSKUItem("12345678901234567890123456789017", 1, 0, "2021/11/29 12:30");
            await testDescriptors.createTestDescriptor("test 1", "do this...", 1);
            await positions.changePosition("800033336486", "8000", "3333", "6486", 1000, 1000, 10 * 10, 10 * 10);
            await skus.setSKUPosition(1, "800033336486");
            await restockOrders.createRestockOrder("2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 }], 1)
            await restockOrders.changeState(1, "COMPLETEDRETURN");
            let rO = await restockOrders.getRestockOrder(1);
            await restockOrders.addSKUItems(1, [{ SKUId: 1, rfid: "12345678901234567890123456789015" }, { SKUId: 1, rfid: "12345678901234567890123456789016" }, { SKUId: 1, rfid: "12345678901234567890123456789017" }], rO);

        }
        catch (err) {
            console.log(err);
        }
    })
    after(async () => {
        try {
            const restockOrders = new RestockOrdersDB('WarehouseDB');
            await restockOrders.deleteAllRestockOrders();
            const returnOrders = new ReturnOrdersDB('WarehouseDB');
            await returnOrders.deleteAllReturnOrders();
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
        }
        catch (err) {
            console.log(err);
        }
    })


    //SCENARIOS 6-1
    returnFailedItems();
    //SCENARIOS 6-1
    returnWrongOrder();
})

function returnFailedItems() {
    it('return order of SKU items that failed quality test', function (done) {
        let rfids = ["12345678901234567890123456789015", "12345678901234567890123456789016", "12345678901234567890123456789017"]
        let testResult = { rfid: rfids[0], idTestDescriptor: 1, Date: "2021/11/28", Result: false }
        agent.post('/api/skuitems/testResult')
            .send(testResult)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/skuitems/' + rfids[0] + '/testResults/1')
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.idTestDescriptor.should.equal(1)
                        res.body.Date.should.equal("2021/11/28")
                        res.body.Result.should.equal(true);
                        let testResult = { rfid: rfids[1], idTestDescriptor: 1, Date: "2021/11/28", Result: false }
                        agent.post('/api/skuitems/testResult')
                            .send(testResult)
                            .then(function (res) {
                                res.should.have.status(201);
                                let testResult = { rfid: rfids[2], idTestDescriptor: 1, Date: "2021/11/28", Result: false }
                                agent.post('/api/skuitems/testResult')
                                    .send(testResult)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.get('/api/restockOrders/1/returnItems')
                                            .then(function (res) {
                                                res.should.have.status(200);
                                                let retOrder = ({
                                                    returnDate: "2021/11/29 09:33",
                                                    products: [{ "SKUId": 1, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789015" },
                                                    { "SKUId": 1, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789016" },
                                                    { "SKUId": 1, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789017" }],
                                                    restockOrderId: 1
                                                });
                                                agent.post('/api/returnOrder')
                                                    .send(retOrder)
                                                    .then(function (res) {
                                                        res.should.have.status(201);
                                                        agent.put('/api/skuitems/12345678901234567890123456789015')
                                                            .send({
                                                                newRFID: '12345678901234567890123456789015',
                                                                newAvailable: 0,
                                                                newDateOfStock: null
                                                            })
                                                            .then(function (res) {
                                                                res.should.have.status(200);
                                                                agent.put('/api/skuitems/12345678901234567890123456789016')
                                                                    .send({
                                                                        newRFID: '12345678901234567890123456789016',
                                                                        newAvailable: 0,
                                                                        newDateOfStock: null
                                                                    })
                                                                    .then(function (res) {
                                                                        res.should.have.status(200);
                                                                        agent.put('/api/skuitems/12345678901234567890123456789017')
                                                                            .send({
                                                                                newRFID: '12345678901234567890123456789017',
                                                                                newAvailable: 0,
                                                                                newDateOfStock: null
                                                                            })
                                                                            .then(function (res) {
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
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}

function returnWrongOrder() {
    it('return order of any SKU items', function (done) {
        let rfids = ["12345678901234567890123456789015", "12345678901234567890123456789016", "12345678901234567890123456789017"]
        let testResult = { rfid: rfids[0], idTestDescriptor: 1, Date: "2021/11/28", Result: true }
        agent.post('/api/skuitems/testResult')
            .send(testResult)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/skuitems/' + rfids[0] + '/testResults/1')
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.idTestDescriptor.should.equal(1)
                        res.body.Date.should.equal("2021/11/28")
                        res.body.Result.should.equal(true);
                        let testResult = { rfid: rfids[1], idTestDescriptor: 1, Date: "2021/11/28", Result: false }
                        agent.post('/api/skuitems/testResult')
                            .send(testResult)
                            .then(function (res) {
                                res.should.have.status(201);
                                let testResult = { rfid: rfids[2], idTestDescriptor: 1, Date: "2021/11/28", Result: false }
                                agent.post('/api/skuitems/testResult')
                                    .send(testResult)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.get('/api/restockOrders/1/returnItems')
                                            .then(function (res) {
                                                res.should.have.status(200);
                                                let retOrder = ({
                                                    returnDate: "2021/11/29 09:33",
                                                    products: [{ "SKUId": 1, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789015" },
                                                    { "SKUId": 1, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789016" },
                                                    { "SKUId": 1, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789017" }],
                                                    restockOrderId: 1
                                                });
                                                agent.post('/api/returnOrder')
                                                    .send(retOrder)
                                                    .then(function (res) {
                                                        res.should.have.status(201);
                                                        agent.put('/api/skuitems/12345678901234567890123456789015')
                                                            .send({
                                                                newRFID: '12345678901234567890123456789015',
                                                                newAvailable: 0,
                                                                newDateOfStock: null
                                                            })
                                                            .then(function (res) {
                                                                res.should.have.status(200);
                                                                agent.put('/api/skuitems/12345678901234567890123456789016')
                                                                    .send({
                                                                        newRFID: '12345678901234567890123456789016',
                                                                        newAvailable: 0,
                                                                        newDateOfStock: null
                                                                    })
                                                                    .then(function (res) {
                                                                        res.should.have.status(200);
                                                                        agent.put('/api/skuitems/12345678901234567890123456789017')
                                                                            .send({
                                                                                newRFID: '12345678901234567890123456789017',
                                                                                newAvailable: 0,
                                                                                newDateOfStock: null
                                                                            })
                                                                            .then(function (res) {
                                                                                res.should.have.status(200);
                                                                                agent.get('/api/skus/1')
                                                                                    .then(function (res) {
                                                                                        res.should.have.status(200);
                                                                                        let q = res.body.availableQuantity - 1;
                                                                                        agent.put('/api/sku/1')
                                                                                            .send({
                                                                                                newDescription: res.body.description,
                                                                                                newWeight: res.body.weight,
                                                                                                newVolume: res.body.volume,
                                                                                                newNotes: res.body.notes,
                                                                                                newPrice: res.body.price,
                                                                                                newAvailableQuantity: q
                                                                                            }
                                                                                            )
                                                                                            .then(function (res) {
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
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}