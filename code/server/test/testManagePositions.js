'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const SKUDB = require('../modules/SKUsDB');
const SKUItemDB = require('../modules/SKUItemsDB');
const PositionDB = require('../modules/PositionDB');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe("test manage positions scenarios", () => {

    beforeEach(async () => {
        let skuItems = new SKUItemDB('WarehouseDB');
        await skuItems.deleteAllSKUItems();
        let skus = new SKUDB('WarehouseDB');
        await skus.deleteAllSKUs();
        const positions = new PositionDB('WarehouseDB');
        await positions.deleteAllPositions();
    })

    //SCENARIO 2-1
    createPosition(201, "800234543412", "8002", "3454", "3412", 1000, 1000);
    //SCENARIO 2-2
    changePositionID(200, "800234543412", "800234543415");
    //SCENARIO 2-3 AND 2-4
    modifyPosition(200, "800234543412", "4003", "3844", "9912", 1200, 600);
    //SCENARIO 2.5
    deletePosition(204, "800234543412");
})

function createPosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
    it('adding a new position', function (done) {
        let position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume }
        agent.post('/api/position')
            .send(position)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                agent.get('/api/positions')
                    .then(function (r) {
                        r.should.have.status(200);
                        r.body[0].positionID.should.equal(positionID);
                        r.body[0].aisleID.should.equal(aisleID);
                        r.body[0].row.should.equal(row);
                        r.body[0].col.should.equal(col);
                        r.body[0].maxWeight.should.equal(maxWeight);
                        r.body[0].maxVolume.should.equal(maxVolume);
                        r.body[0].occupiedWeight.should.equal(0);
                        r.body[0].occupiedVolume.should.equal(0);
                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}

function changePositionID(expectedHTTPStatus, oldPositionID, newPositionID) {
    it('change id of a position', function (done) {
        let position = { positionID: oldPositionID, aisleID: oldPositionID.slice(0, 4), row: oldPositionID.slice(4, 8), col: oldPositionID.slice(8), maxWeight: 1000, maxVolume: 100 }
        agent.post('/api/position')
            .send(position)
            .then(function (res) {
                res.should.have.status(201);
                agent.put('/api/position/' + oldPositionID + '/changeID')
                    .send({ newPositionID: newPositionID })
                    .then(function (rs) {
                        rs.should.have.status(expectedHTTPStatus);
                        agent.get('/api/positions')
                            .then(function (r) {
                                r.should.have.status(200);
                                r.body[0].positionID.should.equal(newPositionID);
                                r.body[0].aisleID.should.equal(newPositionID.slice(0, 4));
                                r.body[0].row.should.equal(newPositionID.slice(4, 8));
                                r.body[0].col.should.equal(newPositionID.slice(8));
                            })
                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}

function modifyPosition(expectedHTTPStatus, positionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume) {
    it('changing position data', function (done) {
        let position = { positionID: positionID, aisleID: positionID.slice(0, 4), row: positionID.slice(4, 8), col: positionID.slice(8), maxWeight: 1000, maxVolume: 1000 };
        agent.post('/api/position')
            .send(position)
            .then(function (res) {
                res.should.have.status(201);
                let newPosition = { positionID: newAisleID.concat(newRow, newCol), aisleID: newAisleID, row: newRow, col: newCol, maxWeight: newMaxWeight, maxVolume: newMaxVolume, newOccupiedWeight: 0, newOccupiedVolume: 0 }
                agent.put('/api/position/' + positionID)
                    .send(newPosition)
                    .then(function (rs) {
                        rs.should.have.status(expectedHTTPStatus);
                        agent.get('/api/positions')
                            .then(function (r) {
                                r.should.have.status(200);
                                r.body[0].positionID.should.equal(newPosition.positionID);
                                r.body[0].aisleID.should.equal(newAisleID);
                                r.body[0].row.should.equal(newRow);
                                r.body[0].col.should.equal(newCol);
                                r.body[0].maxWeight.should.equal(newMaxWeight);
                                r.body[0].maxVolume.should.equal(newMaxVolume);
                            })
                    })

            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}

function deletePosition(expectedHTTPStatus, positionID) {
    it('deleting a position', function (done) {
        let position = { positionID: positionID, aisleID: positionID.slice(0, 4), row: positionID.slice(4, 8), col: positionID.slice(8), maxWeight: 1000, maxVolume: 1000 };
        agent.post('/api/position')
            .send(position)
            .then(function (res) {
                res.should.have.status(201);
                agent.delete('/api/position/' + positionID)
                    .then(function (rs) {
                        rs.should.have.status(expectedHTTPStatus);
                        agent.delete('/api/position/' + positionID)   //Should not be found after deletion
                            .then(function (r) {
                                r.should.have.status(404);
                            })
                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}