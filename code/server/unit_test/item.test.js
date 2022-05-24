const ItemDB = require('../modules/ItemDB');
const UsersDB = require('../modules/UsersDB');
const SKUSDB = require('../modules/SKUsDB');

const itemDB = new ItemDB('WarehouseDB');
const usersDB = new UsersDB('WarehouseDB');
const skuDB = new SKUSDB('WarehouseDB');

describe('item test suite', () => {
    test('delete all', async () =>{
        await skuDB.deleteAllSKUs();
        await usersDB.deleteAllUsers();
        await itemDB.deleteAllItems();
        await skuDB.createSKUTable();
        await usersDB.createUserTable();
        await usersDB.createUser('username', 'name', 'surname', 'password', 'type');
        await usersDB.createUser('username', 'name', 'surname', 'password', 'type');
    });
    
    test('create item table', async () =>{
        await itemDB.createItemTable();
    });

    test('get all items', async () =>{
        var res = await itemDB.getItems();
        expect(res.length).toStrictEqual(0);
    });

    testNewItem(1, 'description', 10, 1, 1);
    testGetItemById(1);
    testModifyItem(2, 'new description', 11, 2, 2, 1);
    testAlreadySells(2, 2, 2);
    testDeleteItem(2);
    itemDB.deleteAllItems();
    usersDB.deleteAllUsers();
    skuDB.deleteAllSKUs();
});


function testNewItem(id, description, price, skuid, supplierId){
    test('create new item', async () =>{
        await itemDB.createItem(id, description, price, skuid, supplierId);
        
        var res = await itemDB.getItemById(id);
        expect(res.description).toStrictEqual(description);
        expect(res.price).toStrictEqual(price);
        expect(res.SKUId).toStrictEqual(skuid);
        expect(res.supplierId).toStrictEqual(supplierId);
    })
}

function testGetItemById(id){
    test('get item by id', async () =>{

        const res = await itemDB.getItemById(id);
        expect(res.description).toStrictEqual('description');
        expect(res.price).toStrictEqual(10);
        expect(res.SKUId).toStrictEqual(1);
        expect(res.supplierId).toStrictEqual(1);
    })
}

function testModifyItem(id, newDescription, newPrice, newSKUId, newSupplierId, oldId){
    test('update item info', async () =>{
        await itemDB.modifyItem(id, newDescription, newPrice, newSKUId, newSupplierId, oldId)
        const res = await itemDB.getItemById(id);
        expect(res.description).toStrictEqual('new description');
        expect(res.price).toStrictEqual(11);
        expect(res.SKUId).toStrictEqual(2);
        expect(res.supplierId).toStrictEqual(2);
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
