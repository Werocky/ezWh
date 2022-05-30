const ItemDB = require('../modules/ItemDB');
const UsersDB = require('../modules/UsersDB');
const SKUItemsDB = require('../modules/SKUItemsDB');
const SKUSDB = require('../modules/SKUsDB');

const itemDB = new ItemDB('WarehouseDB');
const usersDB = new UsersDB('WarehouseDB');
const SKUItemDB = new SKUItemsDB('WarehouseDB');
const skuDB = new SKUSDB('WarehouseDB');

describe('item test suite', () => {
    beforeAll( async () =>{
        await SKUItemDB.deleteAllSKUItems();
        await skuDB.deleteAllSKUs();
        await usersDB.deleteAllUsers();
        await itemDB.deleteAllItems();
        await SKUItemDB.createSKUItemsTable();
        await skuDB.createSKUTable();
        await usersDB.createUserTable();
        await usersDB.createUser('username', 'name', 'surname', 'password', 'type');
        await usersDB.createUser('username', 'name', 'surname', 'password', 'type');
        await itemDB.createItemTable();
    });
    
    test('create item table', async () =>{
    });

    test('get all items', async () =>{
        var res = await itemDB.getItems();
        expect(res.length).toStrictEqual(0);
    });

    testNewItem(1, 'description', 10, 1, 1);
    testModifyItem(2, 'new description', 11, 2, 1, 1);
    testAlreadySells(1, 2, 1);
    testDeleteItem(2);
    SKUItemDB.deleteAllSKUItems();
    skuDB.deleteAllSKUs();
    usersDB.deleteAllUsers();
    itemDB.deleteAllItems();
});


function testNewItem(id, description, price, skuid, supplierId){
    test('create new item and get item by id', async () =>{
        await skuDB.createSKU('description', 10, 10, 'note', 10, 5);
        await itemDB.createItem(id, description, price, skuid, supplierId);
        
        var res = await itemDB.getItemById(id);
        expect(res.description).toStrictEqual(description);
        expect(res.price).toStrictEqual(price);
        expect(res.SKUId).toStrictEqual(skuid);
        expect(res.supplierId).toStrictEqual(supplierId);
    })
}

function testModifyItem(id, newDescription, newPrice, newSKUId, newSupplierId, oldId){
    test('update item info', async () =>{
        await skuDB.createSKU('description', 10, 10, 'note', 10, 5);
        await itemDB.modifyItem(id, newDescription, newPrice, newSKUId, newSupplierId, oldId)
        const res = await itemDB.getItemById(id);
        expect(res.description).toStrictEqual(newDescription);
        expect(res.price).toStrictEqual(newPrice);
        expect(res.SKUId).toStrictEqual(newSKUId);
        expect(res.supplierId).toStrictEqual(newSupplierId);
    })
}

function testAlreadySells(supplierId, id, SKUId){
    test('check if supplier already sells a specific item', async () =>{
        const res = await itemDB.alreadySells(supplierId, id, SKUId);
        expect(res).toStrictEqual(true);
    })
}

function testDeleteItem(id){
    test('delete an item', async () =>{
        await itemDB.deleteItem(id);
        const res = await itemDB.getItemById(id);
        expect(res).toStrictEqual(null);
    })
}
