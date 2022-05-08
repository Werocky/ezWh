'use strict';

const dayjs = require('dayjs');

const ReturnOrdersDB = require('./ReturnOrdersDB');
const ReturnOrder = require('./ReturnOrder');

const RestockOrdersDB = require('./RestockOrdersDB');

let currentUser = undefined;

module.exports = function(app) {

    //GET ALL RETURN ORDERS
    app.get('/api/returnOrders', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 500 -> Internal Server Error (generic error) 
         */
        
        let returnOrders;
        try {
            returnOrders = new ReturnOrdersDB('WarehouseDB');
            await returnOrders.createReturnOrdersTable();
            returnOrders = await returnOrders.getReturnOrders();
        } catch (err) {
            // generic error
            return res.status(500).json();
        }
        
        return res.status(200).json(returnOrders);
    });

    //GET AN ORDER BY ID
    app.get('/api/returnOrders/:id', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 404 -> Not Found (no return order associated to id),
         * 422 -> Unprocessable Entity (validation of id failed), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        let id = req.params.id;

        if(!id) {
            return res.status(422).json();
        }

        let returnOrders;
        let returnOrder;
        try {
            returnOrders = new ReturnOrdersDB('WarehouseDB');
            await returnOrders.createReturnOrdersTable();
            returnOrder = await returnOrders.getReturnOrder(id);
            if (!returnOrder) {
                return res.status(404).json();
            }
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        delete returnOrder['id'];
        return res.status(200).json(returnOrder);
    });

    //CREATE A NEW ORDER
    app.post('/api/returnOrder', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 404 -> Not Found (no restock order associated to restockOrderId),
         * 422 -> Unprocessable Entity (validation of request body failed), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        if(Object.keys(req.body).length!==3) { 
            return res.status(422).json();
        }

        let returnOrders;
        let restockOrders;
        try {

            restockOrders = new RestockOrdersDB('WarehouseDB'); 
            await restockOrders.createRestockTable();
            if (! await restockOrders.getRestockOrder(req.body.restockOrderId)) {
                res.status(404).json();
            }
            returnOrders = new ReturnOrdersDB('WarehouseDB');
            await returnOrders.createReturnOrdersTable();
            await returnOrders.createReturnOrder(req.body.returnDate, JSON.stringify(req.body.products), req.body.restockOrderId);
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(201).json();
    });

    //DELETE AN ORDER BY ID
    app.delete('/api/returnOrder/:id', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 422 -> Unprocessable Entity (validation of request body failed), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        let id = req.params.id;

        if(!id) { 
            return res.status(422).json();
        }

        let returnOrders;
        try {
            returnOrders = new ReturnOrdersDB('WarehouseDB');
            await returnOrders.createReturnOrdersTable();
            await returnOrders.deleteReturnOrder(id);
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(204).json();
    });
}