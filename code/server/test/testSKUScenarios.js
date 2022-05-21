'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const SKUDB = require('../modules/SKUsDB');
const PositionDB = require('../modules/PositionDB');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const PositionDB = require('../../EzWh/code/server/modules/PositionDB');
var agent = chai.request.agent(app);

describe('test SKU scenarios',()=>{

    beforeEach(async ()=>{
        const skus = new SKUDB('WarehouseDB');
        await skus.deleteAllSKUs();
        const positions = new PositionDB('WarehouseDB');
        await positions.deleteAllPositions();
    })

    //SCENARIO 1-1
    newSKU(201,'a new sku',100,50,'first SKU',10.99,2);
    //SCENARIO 1-2
    placeSKU(200,1,'800234523412');
    //SCENARIO 1-3
    modifySKUWeightAndVolume(200,1,10,12);


})

function newSKU(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    it('adding a new sku', function (done) {
            let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity }
            agent.post('/api/sku/')
                .send(sku)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    agent.get('/api/skus/' + id)
                    .then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    r.body.id.should.equal(id);
                    r.body.description.should.equal(description);
                    r.body.weight.should.equal(weight);
                    r.body.volume.should.equal(volume);
                    r.body.notes.should.equal(notes);
                    r.body.position.should.equal(null);
                    r.body.price.should.equal(price);
                    r.body.availableQuantity.should.equal(availableQuantity);
                    r.body.testDescriptors.should.equal([]);
                    done();
                });
            });
        
    });
}

function placeSKU(expectedHTTPStatus,id,position,aisleID,row,col){
    it('placing an sku',function(done){
        let pos = { positionID:position,
        aisleID: aisleID,
        row: row,
        col: col,
        maxWeight: 1000,
        maxVolume: 1000}
        agent.post('api/position')
        .send(pos)
        .then(function(res){
            res.should.have.status(201);
            let sku = { description: "a new sku", weight: 100, volume: 50, notes: "first sku", price: 10.99, availableQuantity: 2 }
            agent.post('/api/sku/')
                .send(sku)
                .then(function(r){
                    r.should.have.status(201);
                    agent.put('/api/sku/'+ id + '/position')
                    .send({position: position})
                    .then(function(response){
                        response.should.have.status(expectedHTTPStatus);
                        agent.get('/api/skus/' + id)
                        .then(function (rs){
                            rs.should.have.status(200);
                            rs.body.position.should.equal(position);
                            done();
                        })
                    })
                })

        })
    })
}

function modifySKUWeightAndVolume(expectedHTTPStatus,id,newWeight,newVolume){
    it('changing weight and volume',function(done){
        let sku = { description: "a new sku", weight: 100, volume: 50, notes: "first sku", price: 10.99, availableQuantity: 2 }
        agent.post('/api/sku')
        .send(sku)
        .then(function(res){
            res.should.have.status(201);
            agent.get('/api/skus/' + id)
            .then(function(r){
                r.should.have.status(200);
                sku = {newDescription: r.body.description, newWeight: newWeight, newVolume: newVolume, newNotes: r.body.notes, newPrice: r.body.price, newAvailableQuantity: r.body.availableQuantity}
                agent.put('/api/sku/' + id)
                .send(sku)
                .then(function(response){
                    response.should.have.status(expectedHTTPStatus);
                    agent.get('/api/skus/' + id)
                    .then(function(rs){
                        rs.should.have.status(200);
                        rs.body.weight.should.equal(newWeight);
                        rs.body.volume.should.equal(newVolume);
                        done();
                    })
                })
            })
        })
    })
}
