'use strict';

const dayjs = require('dayjs');

const RestockOrdersDB = require('./RestockOrdersDB');
const RestockOrder = require('./RestockOrder');
//const TestResultDB = require('./TestResultDB');

let currentUser = undefined;

module.exports = function(app) {

    //GET ALL RESTOCK ORDERS
    app.get('/api/restockOrders', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 500 -> Internal Server Error (generic error) 
         */
        
        return getRestockOrders(res);
    });

    //GET ALL ISSUED RESTOCK ORDERS
    app.get('/api/restockOrdersIssued', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 500 -> Internal Server Error (generic error) 
         */
        return getRestockOrders(res, true);
    });

    //GET AN ORDER BY ID
    app.get('/api/restockOrders/:id', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 404 -> Not Found (no restock order associated to id),
         * 422 -> Unprocessable Entity (validation of id failed), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        let id = req.params.id;

        if(!id) {
            return res.status(422).json();
        }

        let restockOrders;
        let restockOrder;
        try {
            restockOrders = new RestockOrdersDB('WarehouseDB');
            await restockOrders.createRestockTable();
            restockOrder = await restockOrders.getRestockOrder(id);
            if (!restockOrder) {
                return res.status(404).json();
            }
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        delete restockOrder['id'];
        return res.status(200).json(restockOrder);
    });

    //GET RETURN ITEMS OF AN ORDER
    app.get('/api/restockOrders/:id/returnItems', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 404 -> Not Found (no restock order associated to id),
         * 422 -> Unprocessable Entity (validation of id failed or restock order state != COMPLETEDRETURN), 
         * 500 -> Internal Server Error (generic error). 
         */
        
        let id = req.params.id;

        if(!id) {
            return res.status(422).json();
        }

        let restockOrders;
        let restockOrder;
        let returnItems = [];
        try {
            restockOrders = new RestockOrdersDB('WarehouseDB');
            await restockOrders.createRestockTable();
            restockOrder = await restockOrders.getRestockOrder(id);
            if (!restockOrder) {
                return res.status(404).json();
            }

            if (restockOrder.state !== 'COMPLETEDRETURN') {
                return res.status(422).json();
            }

            /**
            let testResults = new TestResultDB('WarehouseDB');
            await testResults.createTestResultTable();
            for (const skuItem of restockOrder.skuItems) {
                rfidTestResults = await testResults.getTestResult(skuItem.rfid);
                rfidTestResults.every(rfidTestResult => {
                    if (rfidTestResult.Result === false) {
                        returnItems.push(skuItem);
                        return false;
                    }
                    return true;
                });
            }
            */

        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(200).json(returnItems);
    });

    //CREATE A NEW ORDER
    app.post('/api/restockOrder', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 422 -> Unprocessable Entity (validation of request body failed), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        if(Object.keys(req.body).length!==3) { 
            return res.status(422).json();
        }

        let restockOrders;
        try {
            restockOrders = new RestockOrdersDB('WarehouseDB');
            await restockOrders.createRestockTable();
            await restockOrders.createRestockOrder(req.body.issueDate, JSON.stringify(req.body.products), req.body.supplierId);
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(201).json();
    });

    //CHANGE STATE OF A RESTOCK ORDER
    app.put('/api/restockOrder/:id', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 404 -> Not Found (no restock order associated to id),
         * 422 -> Unprocessable Entity (validation of request body or of id failed), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        let id = req.params.id;

        if(!id || Object.keys(req.body).length!==1) { 
            return res.status(422).json();
        }

        let restockOrders;
        try {
            restockOrders = new RestockOrdersDB('WarehouseDB');
            await restockOrders.createRestockTable();

            if(!await restockOrders.getRestockOrder(id)) {
                //restock order not found
                return res.status(404).json();
            }

            await restockOrders.changeState(id, req.body.newState);
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(200).json();
    });

    //ADD SKUITEMS TO AN ORDER
    app.put('/api/restockOrder/:id/skuItems', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 404 -> Not Found (no restock order associated to id),
         * 422 -> Unprocessable Entity (validation of request body or of id failed), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        let id = req.params.id;

        if(!id || Object.keys(req.body).length!==1) { 
            return res.status(422).json();
        }

        let restockOrders;
        let restockOrder;
        try {
            restockOrders = new RestockOrdersDB('WarehouseDB');
            await restockOrders.createRestockTable();

            restockOrder = await restockOrders.getRestockOrder(id);
            if(!restockOrder) {
                //restock order not found
                return res.status(404).json();
            }

            if (restockOrder.state !== 'DELIVERED') {
                return res.status(422).json();
            }

            await restockOrders.addSKUItems(id, req.body.skuItems, restockOrder);
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(200).json();
    });

    //ADD A TRANSPORT NOTE TO AN ORDER
    app.put('/api/restockOrder/:id/transportNote', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 404 -> Not Found (no restock order associated to id),
         * 422 -> Unprocessable Entity (validation of request body or of id failed), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        let id = req.params.id;

        if(!id || Object.keys(req.body).length!==1) { 
            return res.status(422).json();
        }

        let restockOrders;
        let restockOrder;
        try {
            restockOrders = new RestockOrdersDB('WarehouseDB');
            await restockOrders.createRestockTable();

            restockOrder = await restockOrders.getRestockOrder(id);
            if(!restockOrder) {
                //restock order not found
                return res.status(404).json();
            }

            let issueDate = dayjs(restockOrder.issueDate, 'YYYY/MM/DD HH:mm');
            let deliveryDate = dayjs(req.body.transportNote.deliveryDate, 'YYYY/MM/DD');

            if (restockOrder.state !== 'DELIVERED' || deliveryDate.isBefore(issueDate)) {
                return res.status(422).json();
            }

            await restockOrders.addTransportNote(id, req.body.transportNote);
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(200).json();
    });

    //DELETE AN ORDER BY ID
    app.delete('/api/restockOrder/:id', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 422 -> Unprocessable Entity (validation of request body failed), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        let id = req.params.id;

        if(!id) { 
            return res.status(422).json();
        }

        let restockOrders;
        try {
            restockOrders = new RestockOrdersDB('WarehouseDB');
            await restockOrders.createRestockTable();
            await restockOrders.deleteRestockOrder(id);
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(204).json();
    });
}

async function getRestockOrders(res, onlyIssued=false) {
    let restockOrders;
    try {
        restockOrders = new RestockOrdersDB('WarehouseDB');
        await restockOrders.createRestockTable();
        restockOrders = await restockOrders.getRestockOrders();
    } catch (err) {
        // generic error
        return res.status(500).json();
    }
    
    for (let restockOrder of restockOrders) {
        if (restockOrder.state === 'ISSUED' || restockOrder.state === 'DELIVERY') {
            restockOrder.skuItems = '[]';
            if (restockOrder.state === 'ISSUED') {
                delete restockOrder['transportNote'];
            }
        }
    }

    if (onlyIssued) {
        restockOrders = restockOrders.filter((el) => {
            return el.state === 'ISSUED';
          });
    }

    return res.status(200).json(restockOrders);
}