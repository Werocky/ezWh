const SKUDB = require('../modules/SKUsDB');
const SKUItemsDB = require('../modules/SKUItemsDB');
const SKU = require('../modules/SKU');
const PositionDB = require('../modules/PositionDB');

const skuDB = new SKUDB('WarehouseDB');
const SKUItemDB = new SKUItemsDB('WarehouseDB');
const positionDB = new PositionDB('WarehouseDB');

describe('SKU test suite', () => {
    beforeAll( async () =>{
        await SKUItemDB.deleteAllSKUItems();
        await skuDB.deleteAllSKUs();
        await positionDB.deleteAllPositions();
        await SKUItemDB.createSKUItemsTable();
        await positionDB.createPositionTable();
        await positionDB.createPosition("1", "1", "1", 10, 10);
    });
    
    test('create sku table', async () =>{
        await skuDB.createSKUTable();
    });

    test('get all skus', async () =>{
        var res = await skuDB.getSKUs();
        expect(res.length).toStrictEqual(0);
    });

    testNewSKU('description', 10, 10, "note", 10, 5);
    testGetSKU(1);
    testModifySKU("new description", 15, 15, "new note", 15, 10, [1], 1);
    testSetSKUPosition(1, "1".concat("1","1"));
    testOccupiedByOthers("1".concat("1","1"), 1);
    testDeleteSKU(1);

    skuDB.deleteAllSKUs();
    SKUItemDB.deleteAllSKUItems();
    positionDB.deleteAllPositions();
});


function testNewSKU(description, weight, volume, notes, price, availableQuantity){
    test('create new SKU', async () =>{
        await skuDB.createSKU(description, weight, volume, notes, price, availableQuantity);
        
        var res = await skuDB.getSKUById(1);
        expect(res.description).toStrictEqual(description);
        expect(res.weight).toStrictEqual(weight);
        expect(res.volume).toStrictEqual(volume);
        expect(res.notes).toStrictEqual(notes);
        expect(res.price).toStrictEqual(price);
    })
}

function testGetSKU(id){
    test('get SKU by id', async () =>{

        const res = await skuDB.getSKUById(id);
        expect(res.description).toStrictEqual("description");
        expect(res.weight).toStrictEqual(10);
        expect(res.volume).toStrictEqual(10);
        expect(res.notes).toStrictEqual("note");
        expect(res.price).toStrictEqual(10);
    })
}

function testModifySKU(newDescription, newWeight, newVolume, newNotes, newPrice, newQuantity, newTestDescriptors, id){
    test('update SKU info', async () =>{
        await skuDB.modifySKU(new SKU(newDescription, newWeight, newVolume, newNotes, newQuantity, newPrice, newTestDescriptors, "", id));
        const res = await skuDB.getSKUById(id);
        expect(res.description).toStrictEqual(newDescription);
        expect(res.weight).toStrictEqual(newWeight);
        expect(res.volume).toStrictEqual(newVolume);
        expect(res.notes).toStrictEqual(newNotes);
        expect(res.price).toStrictEqual(newPrice);
        expect(res.testDescriptors).toStrictEqual(newTestDescriptors);
    })
}

function testSetSKUPosition(id, positionId){
    test('set position for a SKU', async () =>{
        await skuDB.setSKUPosition(id, positionId);
        const res = await skuDB.getSKUById(id);
        expect(res.positionId).toStrictEqual(positionId);
    })
}

function testOccupiedByOthers(positionId, id){
    test('test if position is already occupied', async () =>{
        const res = await skuDB.occupiedByOthers(positionId, id);
        expect(res).toStrictEqual(false);
    })
}

function testDeleteSKU(id){
    test('delete a SKU', async () =>{
        await skuDB.deleteSKU(id);
        const res = await skuDB.getSKUById(id);
        expect(res).toStrictEqual(null);
    })
}
