const TestDescriptorDB = require('../modules/TestDescriptorDB');

const testDescriptorDB = new TestDescriptorDB('WarehouseDB');

describe('test descriptor test suite', () => {
    beforeAll( async () =>{
        await testDescriptorDB.deleteAllTestDescriptors();
    });
    
    test('create test descriptor table', async () =>{
        await testDescriptorDB.createTestDescriptorTable();
    });

    test('get all test descriptors', async () =>{
        var res = await testDescriptorDB.getTestDescriptors();
        expect(res.length).toStrictEqual(0);
    });

    testNewTestDescriptor('name', 'descriptor', 22);
    testUpdateTestDescriptor({
        id: 1,
        name: 'newName',
        procedureDescription: 'new descriptor',
        idSKU: 10
    });
    testGetTestDescriptor(1);
    testGetTestDescriptorBySku(10);
    testChangeName('newerName', 1);
    testChangeProcedure('newer procedure', 1);
    testChangeIdSKU(1, 1);
    testDeleteTestDescriptor(1);
    testDeleteAllTestDescriptors();
    testDescriptorDB.deleteAllTestDescriptors();
});


function testNewTestDescriptor(name, procedureDescription, idSKU){
    test('create new test descriptor', async () =>{
        await testDescriptorDB.createTestDescriptor(name, procedureDescription, idSKU);
        
        var res = await testDescriptorDB.getTestDescriptors();
        expect(res.length).toStrictEqual(1);

        res.map(e => {
            expect(e.name).toStrictEqual(name);
            expect(e.procedureDescription).toStrictEqual(procedureDescription);
            expect(e.idSKU).toStrictEqual(idSKU);
        })
    })
}

function testUpdateTestDescriptor(testDescriptor){
    test('update test descriptor', async () =>{
        await testDescriptorDB.updateTestDescriptor(testDescriptor);

        var res = await testDescriptorDB.getTestDescriptors();
        expect(res.length).toStrictEqual(1);

        res.map(e => {
            expect(e.name).toStrictEqual(testDescriptor.name);
            expect(e.procedureDescription).toStrictEqual(testDescriptor.procedureDescription);
            expect(e.idSKU).toStrictEqual(testDescriptor.idSKU);
        })
    })
}

function testGetTestDescriptor(id){
    test('get specific test descriptor', async () =>{
        const res = await testDescriptorDB.getTestDescriptor(id);
        expect(res.name).toStrictEqual('newName');
        expect(res.procedureDescription).toStrictEqual('new descriptor');
        expect(res.idSKU).toStrictEqual(10);
    })
}

function testGetTestDescriptorBySku(skuId){
    test('get specific test descriptor by skuId', async () =>{
        const res = await testDescriptorDB.getTestDescriptorBySku(skuId);
        expect(res.name).toStrictEqual('newName');
        expect(res.procedureDescription).toStrictEqual('new descriptor');
        expect(res.idSKU).toStrictEqual(10);
    })
}

function testChangeName(name, id){
    test('change name of a test descriptor', async () =>{
        await testDescriptorDB.changeName(name, id);
        const res = await testDescriptorDB.getTestDescriptor(id);
        expect(res.name).toStrictEqual('newerName');
        expect(res.procedureDescription).toStrictEqual('new descriptor');
        expect(res.idSKU).toStrictEqual(10);
    })
}

function testChangeProcedure(procedure, id){
    test('change procedure of a test descriptor', async () =>{
        await testDescriptorDB.changeProcedure(procedure, id);
        const res = await testDescriptorDB.getTestDescriptor(id);
        expect(res.name).toStrictEqual('newerName');
        expect(res.procedureDescription).toStrictEqual('newer procedure');
        expect(res.idSKU).toStrictEqual(10);
    })
}

function testChangeIdSKU(skuId, id){
    test('change idSKU of a test descriptor', async () =>{
        await testDescriptorDB.changeIdSKU(skuId, id);
        const res = await testDescriptorDB.getTestDescriptor(id);
        expect(res.name).toStrictEqual('newerName');
        expect(res.procedureDescription).toStrictEqual('newer procedure');
        expect(res.idSKU).toStrictEqual(skuId);
    })
}

function testDeleteTestDescriptor(id){
    test('delete a test descriptor', async () =>{
        await testDescriptorDB.deleteTestDescriptor(id);
        const res = await testDescriptorDB.getTestDescriptor(id);
        expect(res).toStrictEqual(null);
    })
}

function testDeleteAllTestDescriptors(){
    test('delete all test descriptors in the database', async () =>{
        await testDescriptorDB.createTestDescriptor('name', 'procedure', 5);
        await testDescriptorDB.createTestDescriptor('name', 'procedure', 12);
        let res = await testDescriptorDB.getTestDescriptors();
        expect(res.length).toStrictEqual(2);
        await testDescriptorDB.deleteAllTestDescriptors();
        await testDescriptorDB.createTestDescriptorTable();
        res = await testDescriptorDB.getTestDescriptors();
        expect(res.length).toStrictEqual(0);
    })
}