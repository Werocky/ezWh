'use strict';

const SKUItemsDB = require('./SKUItemsDB');
const SKUDB = require('./SKUsDB');
const SKU = require('./SKU');
const SKUItem = require('./SKUItem');
const Position = require('./Position');
const PositionDB = require('./PositionDB');
const dayjs = require('dayjs');
const CustomParseFormat = require('dayjs/plugin/CustomParseFormat');
const {param,body,validationResult} = require('express-validator');

dayjs.extend(CustomParseFormat);

module.exports = function(app){
    
    app.get('/api/skuitems',async (req,res) =>{
     
        let skuItems;
        try{
            skuItems = new SKUItemsDB('WarehouseDB');
            await skuItems.createSKUItemsTable();
            skuItems = await skuItems.getSKUItems();
        }
        catch(err){
            return res.status(500).json();
        }
        return res.status(200).json(skuItems);
    })

    app.get('/api/skuitems/sku/:id',

    param('id').isInt({min: 0}),
    async (req,res) =>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
              return res.status(422).end();
        }
        let id = req.params.id;
        let skuItems;
        let skus;
        try{
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            if(!skus.getSKUById(id))
                return res.status(404).json();
            skuItems = new SKUItemsDB('WarehouseDB');
            await skuItems.createSKUItemsTable();
            skuItems = await skuItems.getAvailableSKUItemsBySKUId(id);
        }
        catch(err){
            return res.status(500).json();
        }
        return res.status(200).json(skuItems);
    })

    app.get('/api/skuitems/:rfid',

    param('rfid').isLength({min: 32, max: 32}),
    async (req,res) =>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
              return res.status(422).end();
        }
        let rfid = req.params.rfid;
        let skuItems;
        let skuItem;
        try{
            skuItems = new SKUItemsDB('WarehouseDB');
            await skuItems.createSKUItemsTable();
            skuItem = await skuItems.getSKUItemByRFID(rfid);
        }
        catch (err){
            return res.status(500).end();
        }
        if(!skuItem)
            return res.status(404).end();
        return res.status(200).json(skuItem);
     
    })

    app.post('/api/skuitem',[

    body('RFID').isString().isLength({min: 32, max: 32}),
    body('SKUId').isInt({min: 0})
    ],async (req,res) =>{

        if(Object.keys(req.body).length != 3)
            return res.status(422).end();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                return res.status(422).end();
        }
        if(req.body.DateOfStock && !dayjs(req.body.DateOfStock,['YYYY/MM/DD','YYYY/MM/DD HH:mm'],true).isValid()){
            return res.status(422).end();
        }
        let skuItems;
        let skus;
        try{
        skus = new SKUDB('WarehouseDB');
        await skus.createSKUTable();
        const sku = await skus.getSKUById(req.body.SKUId);
        if(!sku)
            return res.status(404).end();
        skuItems = new SKUItemsDB('WarehouseDB');
        await skuItems.createSKUItemsTable();
        await skuItems.createSKUItem(req.body.RFID,req.body.SKUId,0,req.body.DateOfStock);
        }
        catch (err){
            console.log(err);
            return res.status(503).end();

        }
        return res.status(201).end();
        
     
    })

    app.put('/api/skuitems/:rfid',[

        param('rfid').isLength({min:32, max:32}),
        body('newRFID').isString().isLength({min: 32, max: 32}),
        body('newAvailable').isInt({min: 0, max:1})
        ],async (req,res) =>{
    
            if(Object.keys(req.body).length != 3)
                return res.status(422).end();
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                    return res.status(422).end();
            }
            if(req.body.DateOfStock && !dayjs(req.body.DateOfStock,['YYYY/MM/DD','YYYY/MM/DD HH:mm'],true).isValid())
                return res.status(422).end();
        let skuItems;
        let skuItem;
        let skus;
        let sku;
        try{
            skuItems = new SKUItemsDB('WarehouseDB');
            await skuItems.createSKUItemsTable();
            skuItem = await skuItems.getSKUItemByRFID(rfid);
            if(!skuItem)
                return res.status(404).end();
            if(req.body.newAvailable !== skuItem.getAvailable()){
                skus = new SKUDB('WarehouseDB');
                await skus.createSKUTable();
                sku = await skus.getSKUById(skuItem.getSKUId());
                if(!sku)
                    return res.staus(503).end();
                if(req.body.newAvailable === 1){
                    sku.setAvailableQuantity(sku.getAvailableQuantity() + 1);
                }
                else
                    sku.setAvailableQuantity(sku.getAvailableQuantity() - 1);
                await skus.modifySKU(sku);
            }
            await skuItems.modifySKUItem(req.body.newRFID,sku.getId(),req.body.newAvailable,req.body.newDateOfStock,skuItem.getRfid())
        }
        catch (err){
            console.log(err);
            return res.status(503).end();
        }
        return res.status(200).end();
    })

    app.delete('/api/skuitems/:rfid',
    
    param('rfid').isLength({min:32, max:32}),
    async (req,res) =>{

        let rfid = req.params.rfid;
        if(!rfid)
            return res.status(422).end();
        let skuItems;
        let skuItem;
        let skus;
        let sku;
        try{
            skuItems = new SKUItemsDB('WarehouseDB');
            await skuItems.createSKUItemsTable();
            skuItem = await skuItems.getSKUItemByRFID(rfid);
            if(!skuItem)
                return res.status(404).end();
            if(skuItem.getAvailable() === 1){
                skus = new SKUDB('WarehouseDB');
                await skus.createSKUTable();
                sku = await skus.getSKUById(skuItem.getSKUId());
                if(!sku)
                    return res.status(503).end();
                sku.setAvailableQuantity(sku.getAvailableQuantity()-1);
                await skus.modifySKU(sku);
            }
            await skuItems.deleteSKUItem(rfid);
        }
        catch(err){
            console.log(err);
            return res.status(503).end();
        }
        return res.status(204).end();
    })
}