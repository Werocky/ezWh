'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const RestockOrdersDB = require('../modules/RestockOrdersDB');
const PositionDB = require('../modules/PositionDB');
const SKUDB = require('../modules/SKUsDB');
const SKUItemDB = require('../modules/SKUItemsDB');

chai.use(chaiHttp);
chai.should();

const app = require('../server');
const ItemDB = require('../modules/ItemDB');
var agent = chai.request.agent(app);

describe('test manage reception of SKU items of a restock order', () => {

    beforeEach(async () => {

        let restockOrders = new RestockOrdersDB('WarehouseDB');
        await restockOrders.deleteAllRestockOrders();
        let items = new ItemDB('WarehouseDB');
        await items.deleteAllItems();
        let skuItems = new SKUItemDB('WarehouseDB');
        await skuItems.deleteAllSKUItems();
        let skus = new SKUDB('WarehouseDB');
        await skus.deleteAllSKUs();
        let positions = new PositionDB('WarehouseDB');
        await positions.deleteAllPositions();

        await skus.createSKUTable();
        await skus.createSKU('an sku',10,50,'first sku',10.99,1);
        await skus.createSKU('another sku',10,50,'second sku',9.99,1);
        await items.createItemTable();
        await items.createItem(1,'item',10.99,1,1);
        await items.createItem(2,'item',10.99,2,1);

    })

    
    after(async () => {

        let restockOrders = new RestockOrdersDB('WarehouseDB');
        await restockOrders.deleteAllRestockOrders();
        let skuItems = new SKUItemDB('WarehouseDB');
        await skuItems.deleteAllSKUItems();
        let items = new ItemDB('WarehouseDB');
        await items.deleteAllItems();
        let skus = new SKUDB('WarehouseDB');
        await skus.deleteAllSKUs();
        let positions = new PositionDB('WarehouseDB');
        await positions.deleteAllPositions();
    })

    

    //SCENARIO 5-1-1
    recordRestockOrderArrival()
})

function recordRestockOrderArrival() {
    it('test recording of restock order arrival', function (done) {

        let products = [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 3 },
        { SKUId: 2, itemId: 2, description: "another product", price: 9.99, qty: 2 }]

        let restockOrder = { issueDate: "2021/11/29 09:33", products: products, supplierId: 1 };
        agent.post('/api/restockOrder')
            .send(restockOrder)
            .then(function (res) {
                res.should.have.status(201);
                        let position = { positionID: "800234543412", aisleID: "8002", row: "3454", col: "3412", maxWeight: 1000, maxVolume: 1000 }
                        agent.post('/api/position')
                            .send(position)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.put('/api/sku/1/position')
                                    .send({ position: "800234543412" })
                                    .then(function (res) {
                                        res.should.have.status(200);
                                        let skuItem = { RFID: "12345678901234567890123456789015", SKUId: 1, DateOfStock: null };
                                        agent.post('/api/skuItem')
                                            .send(skuItem)
                                            .then(function (res) {
                                                res.should.have.status(201);
                                                skuItem.RFID = "12345678901234567890123456789016";
                                                agent.post('/api/skuItem')
                                                    .send(skuItem)
                                                    .then(function (res) {
                                                        res.should.have.status(201);
                                                        let skuItems = { skuItems: [{ SKUId: 1, rfid: "12345678901234567890123456789015" }, { SKUId: 1, rfid: "12345678901234567890123456789016" }] }
                                                        agent.put('/api/restockOrder/1/skuItems')
                                                            .send(skuItems)
                                                            .then(function (res) {
                                                                res.should.have.status(200);
                                                                agent.put('/api/restockOrder/1')
                                                                    .send({ newState: "DELIVERED" })
                                                                    .then(function (res) {
                                                                        res.should.have.status(200);
                                                                        agent.get('/api/restockOrders/1')
                                                                            .then(function (res) {
                                                                                res.should.have.status(200);
                                                                                res.body.issueDate.should.equal("2021/11/29 09:33");
                                                                                res.body.state.should.equal("DELIVERED");
                                                                                res.body.supplierId.should.equal(1);
                                                                                res.body.products.should.equal(products);
                                                                                res.body.skuItems.should.equal(skuItems);
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