'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { after } = require('mocha');
const RestockOrdersDB = require('../modules/RestockOrdersDB');
const SKUDB = require('../modules/SKUsDB');
const ItemDB = require('../modules/ItemDB');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test issue restock order use cases', () => {

    beforeEach(async () => {
        try{
        const skus = new SKUDB('WarehouseDB');
        await skus.deleteAllSKUs();
        await skus.createSKUTable();
        const items = new ItemDB('WarehouseDB');
        await items.deleteAllItems();
        await items.createItemTable();
        const restockOrders = new RestockOrdersDB('WarehouseDB');
        await restockOrders.deleteAllRestockOrders();
        await skus.createSKU('an sku',1,1,'sku',10.99,2);
        await skus.createSKU('another sku',1,2,'sku',11.99,2);
        await items.createItem(4,'an item',10.99,1,1);
        await items.createItem(3,'an item',11.99,2,1);
        }
        catch(err){
            console.log(err);
        }
    })
    after(async () => {
        try{
            const skus = new SKUDB('WarehouseDB');
            await skus.deleteAllSKUs();
            const items = new ItemDB('WarehouseDB');
            await items.deleteAllItems();
        const restockOrders = new RestockOrdersDB('WarehouseDB');
        await restockOrders.deleteAllRestockOrders();
        }
        catch(err){
            console.log(err);
        }
    })

    

    //SCENARIOS 3-2
    issueRestockOrder(201, "2021/11/29 09:33", [{ "SKUId": 1, "itemId": 4, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 2, "itemId": 3, "description": "another product", "price": 11.99, "qty": 20 }], 1);
})

function issueRestockOrder(expectedHTTPStatus, issueDate, products, supplierId) {
    it('issuing a restock order', function (done) {
        let restockOrder = { issueDate: issueDate, products: products, supplierId: supplierId };
        agent.post('/api/restockOrder')
            .send(restockOrder)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                agent.get('/api/restockOrder/1')
                    .then(function (r) {
                        r.should.have.status(200);
                        r.body.issueDate.should.equal(issueDate);
                        r.body.products.should.equal(products);
                        r.body.supplierId.should.equal(supplierId);
                        r.body.state.should.equal('ISSUED');
                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);

            });
    })
}