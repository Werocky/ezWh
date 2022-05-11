'use strict';

const SKUItemsDB = require('./SKUItemsDB');
const SKUDB = require('./SKUsDB');
const SKU = require('./SKU');
const SKUItem = require('./SKUItem');
const Position = require('./Position');
const PositionDB = require('./PositionDB');
const dayjs = require('dayjs');

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

    app.get('/api/skuitems/sku/:id',async (req,res) =>{

        let id = req.params.id;
        if(!id)
            return res.status(422).json();
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

    app.get('/api/skuitems/:rfid',async (req,res) =>{

        let rfid = req.params.rfid;
        if(!rfid)
            return res.status(422).end();
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

    app.post('/api/skuitem',async (req,res) =>{

        if(Object.keys(req.body).length != 3)
            return res.status(422).end();
        let skuItems;
        let skus;
        try{
        skus = new SKUDB('WarehouseDB');
        await skus.createSKUTable();
        const sku = skus.getSKUById(req.body.id);
        if(!sku)
            return res.status(404).end();
        skuItems = new SKUItemsDB('WarehouseDB');
        await skuItems.createSKUItemsTable();
        await skuItems.createSKUItem(new SKUItem(req.body.RFID,req.body.SKUId,0,req.body.DateOfStock));
        }
        catch (err){
            return res.status(503).end();

        }
        return res.status(201).end();
        
     
    })

    app.put('/api/skuitems/:rfid',async (req,res) =>{

        let rfid = req.params.rfid;
        if(!rfid || Object.keys(req.body).length != 3)
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
            if(req.body.newAvailable === 1 !== skuItem.getAvailable()){
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
        }
        catch (err){
            return res.status(503).end();
        }
        return res.status(200).end();
    })

    app.delete('/api/skuitems/:rfid',async (req,res) =>{

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
            skuItem = skuItems.getSKUItemByRFID(rfid);
            if(!skuItem)
                return res.status(404).end();
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            sku = await skus.getSKUById(skuItem.getSKUById());
            if(!sku)
                return res.status(503).end();
            if(skuItem.getAvailable() === 1){
                sku.setAvailableQuantity(sku.getAvailableQuantity()-1);
                await skus.modifySKU(sku);
            }
        }
        catch(err){
            return res.status(503).end();
        }
        return res.status(200).end();
    })
}