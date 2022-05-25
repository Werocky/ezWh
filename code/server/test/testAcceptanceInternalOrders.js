'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const InternalOrderDB = require('../modules/InternalOrderDB');
const PositionDB = require('../modules/PositionDB');
const SKUDB = require('../modules/SKUsDB');
const SKUItemDB = require('../modules/SKUItemsDB');

chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test manage internal orders creation and acceptance', () => {

    beforeEach(async () => {

        let internalOrders = new InternalOrderDB('WarehouseDB');
        await internalOrders.deleteAllInternalOrders();
        let skuItems = new SKUItemDB('WarehouseDB');
        await skuItems.deleteAllSKUItems();
        let skus = new SKUDB('WarehouseDB');
        await skus.deleteAllSKUs();
        let positions = new PositionDB('WarehouseDB');
        await positions.deleteAllPositions();

        await positions.createPositionTable();
        await skus.createSKUTable();
        await internalOrders.createInternalTable();
        await positions.createPosition("8000", "3333", "6486", 3000, 3000);
        await positions.createPosition("9999", "3333", "6486", 3000, 3000);
        await skus.createSKU("an sku", 10, 10, "first sku", 10.99, 10);
        await skus.createSKU("another sku", 11, 10, "second sku", 10.99, 20);
        await skus.setSKUPosition(1, "800033336486");
        await skus.setSKUPosition(2, "999933336486");
        await positions.changePosition("800033336486", "8000", "3333", "6486", 3000, 3000, 10 * 10, 10 * 10)
        await positions.changePosition("999933336486", "9999", "3333", "6486", 3000, 3000, 11 * 20, 10 * 20)
    })

    after(async () => {

        let internalOrders = new InternalOrderDB('WarehouseDB');
        await internalOrders.deleteAllInternalOrders();
        let skuItems = new SKUItemDB('WarehouseDB');
        await skuItems.deleteAllSKUItems();
        let skus = new SKUDB('WarehouseDB');
        await skus.deleteAllSKUs();
        let positions = new PositionDB('WarehouseDB');
        await positions.deleteAllPositions();
    })

    //SCENARIO 9-1
    acceptInternalOrder();
    //SCENARIO 9-2
    rejectInternalOrder();
    //SCENARIO 9-3
    cancelInternalOrder();
    //SCENARIO 10-1
    deliverInternalOrder();
})

function acceptInternalOrder() {
    it('accepting internal an order', function (done) {
        let internalOrder = {
            issueDate: "2021/11/29 09:33",
            products: [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
            { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }],
            customerId: 1
        }
        agent.post('/api/internalOrders')
            .send(internalOrder)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/internalOrders/1')
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.issueDate.should.equal(internalOrder.issueDate);
                        res.body.state.should.equal("ISSUED");
                        res.body.products.should.equal(internalOrder.products);
                        res.body.customerId.should.equal(internalOrder.customerId);
                        agent.put('/api/internalOrders/1')
                            .send({ newState: "ACCEPTED" })
                            .then(function (res) {
                                res.should.have.status(200);
                            })

                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}

function rejectInternalOrder() {
    it('rejecting an internal order', function (done) {
        let internalOrder = {
            issueDate: "2021/11/29 09:33",
            products: [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
            { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }],
            customerId: 1
        }
        agent.post('/api/internalOrders')
            .send(internalOrder)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/internalOrders/1')
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.issueDate.should.equal(internalOrder.issueDate);
                        res.body.state.should.equal("ISSUED");
                        res.body.products.should.equal(internalOrder.products);
                        res.body.customerId.should.equal(internalOrder.customerId);
                        agent.put('/api/internalOrders/1')
                            .send({ newState: "REJECTED" })
                            .then(function (res) {
                                res.should.have.status(200);
                            })

                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}

function cancelInternalOrder() {
    it('cancelling an internal order', function (done) {
        let internalOrder = {
            issueDate: "2021/11/29 09:33",
            products: [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
            { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }],
            customerId: 1
        }
        agent.post('/api/internalOrders')
            .send(internalOrder)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/internalOrders/1')
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.issueDate.should.equal(internalOrder.issueDate);
                        res.body.state.should.equal("ISSUED");
                        res.body.products.should.equal(internalOrder.products);
                        res.body.customerId.should.equal(internalOrder.customerId);
                        agent.put('/api/internalOrders/1')
                            .send({ newState: "CANCELED" })
                            .then(function (res) {
                                res.should.have.status(200);
                            })

                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}

function deliverInternalOrder() {
    it('delivering internal an order', function (done) {
        let internalOrder = {
            issueDate: "2021/11/29 09:33",
            products: [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
            { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }],
            customerId: 1
        }
        agent.post('/api/internalOrders')
            .send(internalOrder)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/internalOrders/1')
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.issueDate.should.equal(internalOrder.issueDate);
                        res.body.state.should.equal("ISSUED");
                        res.body.products.should.equal(internalOrder.products);
                        res.body.customerId.should.equal(internalOrder.customerId);
                        agent.put('/api/internalOrders/1')
                            .send({ newState: "ACCEPTED" })
                            .then(function (res) {
                                res.should.have.status(200);
                                agent.get('/api/skuitems/sku/1')
                                    .then(function (res) {
                                        res.should.have.status(200);
                                        const rfid1 = res.body[0].RFID;
                                        const dateOfStock = res.body[0].DateOfStock;
                                        agent.put('/api/skuitems/' + rfid1)
                                            .send({
                                                newRFID: rfid1,
                                                newAvailable: 0,
                                                newDateOfStock: dateOfStock
                                            })
                                            .then(function (res) {
                                                res.should.have.status(200);
                                                agent.get('/api/skuitems/sku/2')
                                                    .then(function (res) {
                                                        res.should.have.status(200);
                                                        const rfid2 = res.body[0].RFID;
                                                        const dateOfStock2 = res.body[0].DateOfStock;
                                                        agent.put('/api/skuitems/' + rfid2)
                                                            .send({
                                                                newRFID: rfid2,
                                                                newAvailable: 0,
                                                                newDateOfStock: dateOfStock2
                                                            })
                                                            .then(function (res) {
                                                                res.should.have.status(200);
                                                                agent.put('/api/internalOrders/1')
                                                                    .send({
                                                                        newState: "COMPLETED",
                                                                        products: [{ "SkuID": 1, "RFID": rfid1 },
                                                                        { "SkuID": 2, "RFID": rfid2 }]
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
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}