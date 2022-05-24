'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const TestDescriptorDB = require('../modules/TestDescriptorDB');
const SKUItemDB = require('../modules/SKUItemsDB');
const SKUsDB = require('../modules/SKUsDB');
const PositionDB = require('../modules/PositionDB');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe("test manage test descriptors scenarios", () => {

    beforeEach(async () => {
        const testDescriptors = new TestDescriptorDB('WarehouseDB');
        await testDescriptors.deleteAllTestDescriptors();
        let skuItems = new SKUItemDB('WarehouseDB');
        await skuItems.deleteAllSKUItems();
        const skus = new SKUsDB('WarehouseDB');
        await skus.deleteAllSKUs();
        const positions = new PositionDB('Warehouse');
        await positions.createPositionTable();
    })

    //SCENARIO 12-1
    createTestDescriptor(201, "test desc 1", "procedureDescription");
    //SCENARIO 4-2
    updateTestDescriptor(200, 1, "newProcedureDescription");
    //SCENARIO 4-3
    deleteTestDescriptor(204, 1);
})

function createTestDescriptor(expectedHTTPStatus, name, testDescription) {
    it('adding a new test descriptor', function (done) {
        let sku = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                let td = {
                    name: name,
                    testDescription: testDescription,
                    idSKU: 1
                }
                agent.post('api/testDescriptor')
                    .send(td)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        agent.get('api/testDescriptors')
                            .then(function (r) {
                                r.should.have.status(200);
                                r.body[0].id.should.equal(1);
                                r.body[0].name.should.equal(name);
                                r.body[0].testDescription.should.equal(testDescription);
                                r.body[0].idSKU.should.equal(idSKU);
                            })
                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}

function updateTestDescriptor(expectedHTTPStatus, id, newProcedureDescription) {
    it('update test descriptor', function (done) {
        let sku = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                let td = {
                    name: "test desc 1",
                    testDescription: "procedureDescription",
                    idSKU: 1
                }
                agent.post('api/testDescriptor')
                    .send(td)
                    .then(function (r) {
                        r.should.have.status(201);
                        let td = {
                            name: "test desc 1",
                            testDescription: newProcedureDescription,
                            idSKU: 1
                        }
                        agent.put('api/testDescriptor/' + id)
                            .send(td)
                            .then(function (r) {
                                r.should.have.status(expectedHTTPStatus);
                                agent.get('api/testDescriptors')
                                    .then(function (r) {
                                        r.should.have.status(200);
                                        r.body[0].id.should.equal(1);
                                        r.body[0].name.should.equal("test desc 1");
                                        r.body[0].testDescription.should.equal(newProcedureDescription);
                                        r.body[0].idSKU.should.equal(1);
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

function deleteTestDescriptor(expectedHTTPStatus, id) {
    it('deleting a test descriptor', function (done) {
        let sku = {
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            price: 10.99,
            availableQuantity: 50
        }
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);

                let td = {
                    name: "test desc 1",
                    testDescription: "procedureDescription",
                    idSKU: 1
                }
                agent.post('api/testDescriptor')
                    .send(td)
                    .then(function (r) {
                        r.should.have.status(201);
                        agent.delete('/api/testDescriptor/' + id)
                            .then(function (rs) {
                                rs.should.have.status(expectedHTTPStatus);
                                agent.delete('/api/testDescriptor/' + id)
                                    .then(function (r) {
                                        r.should.have.status(422);
                                        //validation of id failed (not found)
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