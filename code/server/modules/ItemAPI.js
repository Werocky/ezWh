'use strict';

const { body, param, check, validationResult } = require('express-validator');
const ItemDB = require('./ItemDB');
const Item = require('./Item');
const UsersDB = require('./UsersDB');
const SKUDB = require('./SKUsDB');

module.exports=function(app){

    //GET ALL ITEMS
    app.get('/api/items',async (req,res)=>{
        let items;
        try{
            items = new ItemDB('WarehouseDB');
            await items.createItemTable();
            items = await items.getItems();
        }
        catch(err){
            return res.status(500).json();
        }
        return res.status(200).json(items);
    });
    //GET AN ITEM GIVEN THE ID
    app.get('/api/items/:id/:supplierId',[
    param('id').isInt({min: 0}),
    param('supplierId').isInt({min: 0}),
    ], 
    async(req,res)=>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
              return res.status(422).end();
        }
        let id=req.params.id;
        let supplierId = req.params.supplierId;
        let items;
        let item;
        try{
            items = new ItemDB('WarehouseDB');
            await items.createItemTable();
            item = await items.getItemById(id,supplierId);
        }
        catch(err){
            return res.status(500).json();
        }
        if(!item)
            return res.status(404).end();
        return res.status(200).json(item);
    });
    //CREATE AN ITEM
    app.post('/api/item',[
        body('id').isInt({min:0}),
        body('description').isString(),
        body('price').isFloat({min: 0}),
        body('SKUId').isInt({min: 0}),
        body('supplierId').isInt({min: 0})],
        async (req,res)=>{
            const errors = validationResult(req);
        if (!errors.isEmpty()) {
              return res.status(422).end();
        }
        if(Object.keys(req.body).length !== 5){
            return res.status(422).json();
        }
        try{
            const items= new ItemDB('WarehouseDB');
            const skus = new SKUDB('WarehouseDB');
            const users = new UsersDB('WarehouseDB');
            await users.createUserTable();
            await skus.createSKUTable();
            await items.createItemTable();
            const sku = await skus.getSKUById(req.body.SKUId);
            if(!sku)
                return res.status(404).end();
            const alreadySupplies = await items.alreadySells(req.body.supplierId,req.body.id,req.body.SKUId);
            if(alreadySupplies)
                return res.status(422).end();
            await items.createItem(req.body.id,req.body.description,req.body.price,req.body.SKUId,req.body.supplierId);
        }
        catch(err){
            return res.status(503).end();
        }
        return res.status(201).end();
        });

        //MODIFY AN ITEM
        app.put('/api/item/:id/:supplierId',[
            check('id').isInt({min: 0}),
            check('supplierId').isInt({min: 0}),
            body('newDescription').isString(),
            body('newPrice').isFloat({min: 0})],
            async (req,res)=>{
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).end();
                }
                const id = req.params.id;
                const supplierId = req.params.supplierId;
                if(!id || Object.keys(req.body).length !== 2){
                    return res.status(422).json();
                }
                try{
                    let items = new ItemDB('WarehouseDB');
                    await items.createItemTable();
                    let item = await items.getItemById(id,supplierId);
                    if(!item)
                        return res.status(404).end();
                    await items.modifyItem(id,req.body.newDescription,req.body.newPrice,item.getSKUId(),supplierId,id);
                }
                catch(err){
                    return res.status(503).end();
                }
                return res.status(200).end();
            });

            //DELETE AN ITEM
            app.delete('/api/items/:id/:supplierId',async (req,res)=>{
                const id = req.params.id;
                const supplierId = req.params.supplierId;
                if(!id || !supplierId)
                    return res.status(422).end();
                try{
                    let items = new ItemDB('WarehouseDB');
                    await items.createItemTable();
                    const item = await items.getItemById(id,supplierId);
                    if(!item)
                        return res.status(204).end();
                    await items.deleteItem(id,supplierId);
                }
                catch(err){
                    return res.status(503).end();
                }
                return res.status(204).end();
            })

}