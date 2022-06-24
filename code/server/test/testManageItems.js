'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const ItemDB = require('../modules/ItemDB');
const UsersDB = require('../modules/UsersDB');
const SKUDB = require('../modules/SKUsDB');
const SKUItemDB = require('../modules/SKUItemsDB');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test item use case', () => {

    beforeEach(async () => {
        const items = new ItemDB('WarehouseDB');
        const skuItems = new SKUItemDB('WarehouseDB');
        const skus = new SKUDB('WarehouseDB');
        const users = new UsersDB('WarehouseDB');
        await items.deleteAllItems();
        await skuItems.deleteAllSKUItems();
        await skus.deleteAllSKUs();
        await users.deleteAllUsers();
    })

    after(async () => {
        const items = new ItemDB('WarehouseDB');
        const skuItems = new SKUItemDB('WarehouseDB');
        const skus = new SKUDB('WarehouseDB');
        const users = new UsersDB('WarehouseDB');
        await items.deleteAllItems();
        await skuItems.deleteAllSKUItems();
        await skus.deleteAllSKUs();
        await users.deleteAllUsers();
    })

   

    //SCENARIO 11-1
    createItem(201, 12, 'a new item', 10.99, 1, 1);
    //SCENARIO 11-2
    modifyDescriptionAndPrice(200, 12, 1, 'new description', 11.2);
})

function createItem(expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it('create a new item', function (done) {
        let supplier = { username: "user1@ezwh.com", name: 'John', surname: 'Smith', password: 'testpassword', type: 'supplier' };
        agent.post('/api/newUser')
            .send(supplier)
            .then(function (res) {
                res.should.have.status(201);
                let sku = { description: 'a new sku', weight: 12, volume: 100, notes: 'first sku', price: 10.1, availableQuantity: 3 };
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (rs) {
                        rs.should.have.status(201);
                        let item = { id: id, description, description, price: price, SKUId: SKUId, supplierId: supplierId }
                        agent.post('/api/item')
                            .send(item)
                            .then(function (response) {
                                response.status.should.have(expectedHTTPStatus);
                                agent.get('/api/items/' + id + '/' + supplierId)
                                    .then(function (r) {
                                        r.should.have.status(200);
                                        r.body.id.should.equal(id);
                                        r.body.description.should.equal(description);
                                        r.body.price.should.equal(price);
                                        r.body.SKUId.should.equal(SKUId);
                                        r.body.supplierId.should.equal(supplierId);
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

function modifyDescriptionAndPrice(expectedHTTPStatus, id, supplierId, newDescription, newPrice) {
    it('change description and price', function (done) {
        let supplier = { username: "user1@ezwh.com", name: 'John', surname: 'Smith', password: 'testpassword', type: 'supplier' };
        agent.post('/api/newUser')
            .send(supplier)
            .then(function (res) {
                res.should.have.status(201);
                let sku = { description: 'a new sku', weight: 12, volume: 100, notes: 'first sku', price: 10.1, availableQuantity: 3 };
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (rs) {
                        rs.should.have.status(201);
                        let item = { id: id, description, description, price: price, SKUId: 1, supplierId: supplierId }
                        agent.post('/api/item')
                            .send(item)
                            .then(function (response) {
                                response.status.should.have(expectedHTTPStatus);
                                agent.put('/api/item/' + id + '/' + supplierId)
                                    .send({ newDescription: newDescription, newPrice: newPrice })
                                    .then(function (rsp) {
                                        rsp.should.have.status(expectedHTTPStatus);
                                        agent.get('/api/items/' + id + '/' + supplierId)
                                            .then(function (r) {
                                                r.should.have.status(200);
                                                r.body.description.should.equal(newDescription);
                                                r.body.price.should.equal(newPrice);
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