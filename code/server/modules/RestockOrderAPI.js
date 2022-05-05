'use strict';

const RestockOrdersDB = require('./RestockOrdersDB');
const RestockOrder = require('./RestockOrder');

const types = ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"];

let currentUser = undefined;

module.exports = function(app) {
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

    app.put('/api/restockOrder/:id', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
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
}