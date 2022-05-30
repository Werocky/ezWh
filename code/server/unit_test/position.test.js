const PositionDB = require('../modules/PositionDB');

const positionDB = new PositionDB('WarehouseDB');

describe('position test suite', () => {
    beforeAll( async () =>{
        await positionDB.deleteAllPositions();
    });
    
    test('create position table', async () =>{
        await positionDB.createPositionTable();
    });

    test('get all positions', async () =>{
        var res = await positionDB.getPositions();
        expect(res.length).toStrictEqual(0);
    });

    testNewPosition("1", "1", "1", 10, 10);
    testGetPositionById("1".concat("1", "1"));
    testModifyPosition("1".concat("1", "1"), "2", "2", "2", 20, 20, 16, 16);
    testChangePosition("2".concat("2", "2"), "1", "1", "1", 10, 10, 8, 8);
    testDeletePosition("1".concat("1","1"));
    positionDB.deleteAllPositions();
});


function testNewPosition(id, row, col, maxWeight, maxVolume){
    test('create new position', async () =>{
        await positionDB.createPosition(id, row, col, maxWeight, maxVolume);
        
        var res = await positionDB.getPosition(id.concat(row,col));
        expect(res.row).toStrictEqual(row);
        expect(res.col).toStrictEqual(col);
        expect(res.maxWeight).toStrictEqual(maxWeight);
        expect(res.maxVolume).toStrictEqual(maxVolume);
    })
}

function testGetPositionById(id){
    test('get position by id', async () =>{

        const res = await positionDB.getPosition(id);
        expect(res.row).toStrictEqual("1");
        expect(res.col).toStrictEqual("1");
        expect(res.maxWeight).toStrictEqual(10);
        expect(res.maxVolume).toStrictEqual(10);
    })
}

function testModifyPosition(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume){
    test('update location info', async () =>{
        await positionDB.changePosition(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume)
        const res = await positionDB.getPosition(aisleID.concat(row,col));
        expect(res.row).toStrictEqual(row);
        expect(res.col).toStrictEqual(col);
        expect(res.maxWeight).toStrictEqual(maxWeight);
        expect(res.maxVolume).toStrictEqual(maxVolume);
        expect(res.occupiedWeight).toStrictEqual(occupiedWeight);
        expect(res.occupiedVolume).toStrictEqual(occupiedVolume);
    })
}

function testChangePosition(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume){
    test('change the position', async () =>{
        await positionDB.changePosition(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume);
        const res = await positionDB.getPosition(aisleID.concat(row,col));
        expect(res.row).toStrictEqual(row);
        expect(res.col).toStrictEqual(col);
        expect(res.maxWeight).toStrictEqual(maxWeight);
        expect(res.maxVolume).toStrictEqual(maxVolume);
        expect(res.occupiedWeight).toStrictEqual(occupiedWeight);
        expect(res.occupiedVolume).toStrictEqual(occupiedVolume);
    })
}

function testChangePositionID(positionID, newPositionID){
    test('change the position ID', async () =>{
        await positionDB.changePositionID(positionID, newPositionID);
        const res = await positionDB.getPosition(newPositionID);
        expect(res.row).toStrictEqual(1);
        expect(res.col).toStrictEqual(1);
        expect(res.maxWeight).toStrictEqual(10);
        expect(res.maxVolume).toStrictEqual(10);
        expect(res.occupiedWeight).toStrictEqual(8);
        expect(res.occupiedVolume).toStrictEqual(8);
    })
}

function testDeletePosition(id){
    test('delete a position', async () =>{
        await positionDB.deletePosition(id);
        const res = await positionDB.getPosition(id);
        expect(res).toStrictEqual(null);
    })
}