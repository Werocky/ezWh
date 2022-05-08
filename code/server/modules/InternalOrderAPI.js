'use strict';

const InternalOrder = require("./InternalOrder");
const InternalOrderDB = require("./InternalOrderDB");
const RestockOrder = require("./RestockOrder");

module.exports = function(app){

    //GET APIs

    //return the internal orders present in the database
    //request body: none
    app.get('/api/internalOrders', async (req, res) =>{
        let internalOrders;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            internalOrders = await internalOrders.getInternalOrders();
        }catch(err){
            //service unavailable (generic error)
            return res.status(500).json();
        }

        for(let internalOrder of internalOrders){
            if(internalOrder.state === 'completed'){
                delete internalOrder.products['rfid'];
            }else{
                delete internalOrder.products['quantity'];
            }
        }
        //success, data retrieved
        return res.status(200).json(internalOrders);
    })

    //return the internal orders present in the database in state = issued
    //request body: none
    app.get('/api/internalOrdersIssued', async (req, res) =>{
        let internalOrders;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            internalOrders = await internalOrders.getInternalOrders();
        }catch(err){
            //service unavailable (generic error)
            return res.status(500).json();
        }

        internalOrders = internalOrders.filter(e => {return e.state==='issued';})

        //success, data retrieved
        return res.status(200).json(internalOrders);
    })

    //return the internal orders present in the database in state = accepted
    //request body: none
    app.get('/api/internalOrdersAccepted', async (req, res) =>{
        let internalOrders;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            internalOrders = await internalOrders.getInternalOrders();
        }catch(err){
            //service unavailable (generic error)
            return res.status(500).json();
        }

        internalOrders = internalOrders.filter(e => {return e.state==='accepted';})
        //success, data retrieved
        return res.status(200).json(internalOrders);  
    })

    //return the internal order present in the database with id = :id
    //request body: none
    //request header: id
    app.get('/api/internalOrders/:id', async (req, res) =>{
        let internalOrders;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            if(Object.keys(internalOrders).length === 0){
                //not found, no internal order associated to the id = :id
                return res.status(404).json();
            }
            internalOrders = await internalOrders.getInternalOrders(req.params.id);
        }catch(err){
            //service unavailable (generic error)
            return res.status(500).json();
        }

        for(let internalOrder of internalOrders){
            if(internalOrder.state === 'completed'){
                delete internalOrder.products['rfid'];
            }else{
                delete internalOrder.products['quantity'];
            }
        }
        //success, data retrieved
        return res.status(200).json(internalOrders);
    })

    //POST APIs

    //Creates a new internal order in state = ISSUED
    //request body: issueDate, products, customerId (state = ISSUED)
    app.post('/api/internalOrders', (req, res) =>{
    
        //unprocessable entity (validation of request body failed)
        if(Object.keys(req.body).length!==3) {return res.status(422).json;}
        
        let internalOrder
        try{
            internalOrder = new InternalOrderDB('WarehouseDB');
            internalOrder.createInternalTable();
            internalOrder.createInternalOrder(req.body.issueDate, JSON.stringify(req.body.products), req.body.customerId, 'issued');
        } catch(err){
            //service unavailable (generic error)
            return res.status(503).json();
        }
        //success, entry created
        return res.status(200).json();
    })

    //PUT APIs
    //modify the statuts of an internal order
    //request body: new state and products array (to be considered if != completed)
    //request header: id
    app.put('/api/internalOrders/:id', async (req, res) =>{

        //unprocessable entity (validation of request body failed)
        if(Object.keys(req.body).length<=1) {return res.status(422).json;}
        
        let internalOrders;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            if(!await internalOrders.getInternalOrders(req.params.id)){
                //order not found
                return res.status(404).json();
            }
            await internalOrders.changeState(req.params.id, req.body.newState, JSON.stringify(req.body.products));

        }catch(err){
            //service unavailable, generic error
            return res.status(503).json();
        }
        //success, internal order modified
        return res.status(200).json();
    })

    //DELETE APIs
    //delete the order specified with the id = :id
    //request body: none
    //request header: id
    app.delete('/api/internalOrders/:id', async (req, res) =>{
        let internalOrders;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            if(Object.keys(internalOrders).length === 0){
                //not found, no internal order associated to the id = :id
                return res.status(404).json();
            }
            await internalOrders.deleteInternalOrder(req.params.id);
        }catch(err){
            //service unavailable, generic error
            return res.status(503).json();
        }
        //success, internal order deleted
        return res.status(204).json();
    })
}