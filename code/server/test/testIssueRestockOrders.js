'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const RestockOrdersDB = require('../modules/RestockOrdersDB');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test issue restock order use cases',()=>{

    beforeEach(async ()=>{
        const restockOrders = new RestockOrdersDB('WarehouseDB');
        await restockOrders.deleteAllRestockOrders();
    })

    //SCENARIOS 3-1,3-2
    issueRestockOrder(201,"2021/11/29 09:33",[{"SKUId":12,"description":"a product","price":10.99,"qty":30},
    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],1);
})

function issueRestockOrder(expectedHTTPStatus,issueDate,products,supplierId){
    it('issuing a restock order',function(done){
        let restockOrder ={issueDate: issueDate, products: products,supplierId: supplierId};
        agent.post('/api/restockOrder')
        .send(restockOrder)
        .then(function(res){
            res.should.have.status(expectedHTTPStatus);
            agent.get('/api/restockOrder/1')
            .then(function(r){
                r.should.have.status(200);
                r.body.issueDate.should.equal(issueDate);
                r.body.products.should.equal(products);
                r.body.supplierId.should.equal(supplierId);
                r.body.state.should.equal('ISSUED');
                done();
            })
        })
    })
}