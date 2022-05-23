'use strict';

const dayjs = require('dayjs');
const { body, param, check, validationResult } = require('express-validator');
const InternalOrderDB = require("./InternalOrderDB");

const STATES = ['ISSUED', 'ACCEPTED', 'REFUSED', 'CANCELED', 'COMPLETED'];

module.exports = function(app){

    //GET APIs

    //return the internal orders present in the database
    //request body: none
    app.get('/api/internalOrders', async (req, res) =>{
        let internalOrders;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            await internalOrders.createInternalTable();
            internalOrders = await internalOrders.getInternalOrders();
        }catch(err){
            //service unavailable (generic error)
            return res.status(500).end();
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
            await internalOrders.createInternalTable();
            internalOrders = await internalOrders.getInternalOrders();
        }catch(err){
            //service unavailable (generic error)
            return res.status(500).end();
        }

        internalOrders = internalOrders.filter(e => {return e.state==='ISSUED';})

        //success, data retrieved
        return res.status(200).json(internalOrders);
    })

    //return the internal orders present in the database in state = accepted
    //request body: none
    app.get('/api/internalOrdersAccepted', async (req, res) =>{
        let internalOrders;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            await internalOrders.createInternalTable();
            internalOrders = await internalOrders.getInternalOrders();
        }catch(err){
            //service unavailable (generic error)
            return res.status(500).end();
        }

        internalOrders = internalOrders.filter(e => {return e.state==='ACCEPTED';})
        //success, data retrieved
        return res.status(200).json(internalOrders);  
    })

    //return the internal order present in the database with id = :id
    //request body: none
    //request header: id
    app.get('/api/internalOrders/:id',
            param('id').isInt(), 
            async (req, res) =>{
        
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).end();
        }
        
        let internalOrders;
        let internalOrder;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            await internalOrders.createInternalTable();
            internalOrder = await internalOrders.getInternalOrder(req.params.id);
            if(!internalOrder){
                //not found, no internal order associated to the id = :id
                return res.status(404).end();
            }
        }catch(err){
            //service unavailable (generic error)
            return res.status(500).end();
        }

        //success, data retrieved
        return res.status(200).json(internalOrder);
    })

    //POST APIs

    //Creates a new internal order in state = ISSUED
    //request body: issueDate, products, customerId (state = ISSUED)
    app.post('/api/internalOrders', 
            check('products.*.SKUId').isInt({ min: 0}),
            check('products.*.qty').isInt({ min: 0}),
            body('customerId').isInt({ min: 0}),
            async (req, res) =>{
    
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).end();
        }
        if(req.body.DateOfStock && !dayjs(req.body.DateOfStock,['YYYY/MM/DD','YYYY/MM/DD HH:mm'],true).isValid()){
            return res.status(422).end();
        }
        
        let internalOrder
        try{
            internalOrder = new InternalOrderDB('WarehouseDB');
            await internalOrder.createInternalTable();
            await internalOrder.createInternalOrder(req.body.issueDate, req.body.products, req.body.customerId, 'ISSUED');
        } catch(err){
            //service unavailable (generic error)
            return res.status(503).end();
        }
        //success, entry created
        return res.status(200).json();
    })

    //PUT APIs
    //modify the statuts of an internal order
    //request body: new state and products array (to be considered if != completed)
    //request header: id
    app.put('/api/internalOrders/:id',
            check('products.*.SkuID').if(body('newState').equals('COMPLETED')).isInt({ min: 0}),
            check('products.*.RFID').if(body('newState').equals('COMPLETED')).isLength({min:32, max: 32}),
            body('newState').isIn(STATES),
            param('id').isInt(),
            async (req, res) =>{

        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).end();
        }
        
        let internalOrders;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            await internalOrders.createInternalTable();
            if(!await internalOrders.getInternalOrder(req.params.id)){
                //order not found
                return res.status(404).end();
            }

            if(req.body.newState !== 'COMPLETED'){
                await internalOrders.changeState(req.params.id, req.body.newState);
            }
            else {
                await internalOrders.changeState(req.params.id, req.body.newState, req.body.products);
            }

        }catch(err){
            //service unavailable, generic error
            return res.status(503).end();
        }
        //success, internal order modified
        return res.status(200).end();
    })

    //DELETE APIs
    //delete the order specified with the id = :id
    //request body: none
    //request header: id
    app.delete('/api/internalOrders/:id', 
            param('id').isInt(), 
            async (req, res) =>{
        
        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(422).end();
        }

        let internalOrders;
        try{
            internalOrders = new InternalOrderDB('WarehouseDB');
            await internalOrders.createInternalTable();
            await internalOrders.deleteInternalOrder(req.params.id);
            if(Object.keys(internalOrders).length === 0){
                //not found, no internal order associated to the id = :id
                return res.status(404).end();
            }
        }catch(err){
            //service unavailable, generic error
            return res.status(503).end();
        }
        //success, internal order deleted
        return res.status(204).end();
    })
}