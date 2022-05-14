'use strict';

const SKUDB = require('./SKUsDB');
const SKU = require('./SKU');
const Position = require('./Position');
const PositionDB = require('./PositionDB');
const {body, param, validationResult} = require('express-validator');

module.exports=function(app){

    app.get('/api/skus', async (req,res) =>{

        let skus;
        try{
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            skus = await skus.getSKUs();
        }
        catch(err){
            return res.status(500).json();
        }
        return res.status(200).json(skus);

    });

    app.get('/api/skus/:id',
    param('id').isInt({min: 0}), 
    async(req,res)=>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
              return res.status(422).end();
        }
        let id=req.params.id;
        let skus;
        let sku;
        try{
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            sku = await skus.getSKUById(id);
        }
        catch(err){
            return res.status(500).json();
        }
        if(!sku)
            return res.status(404).end();
        return res.status(200).json(sku);
    });

    app.post('/api/sku',[
        body('description').isAscii().isLength({min:1}),
        body('weight').isInt({min: 0}),
        body('volume').isInt({min: 0}),
        body('notes').isAscii(),
        body('price').isFloat({min: 0}),
        body('availableQuantity').isInt({min: 0})], 
        async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
              return res.status(422).end();
        }
        if(Object.keys(req.body).length !== 6){
            return res.staus(422).json();
        }
        let skus;
        try{
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            await skus.createSKU(req.body.description,req.body.weight,req.body.volume,req.body.notes,req.body.availableQuantity,req.body.price);
        }
        catch(err){
            return res.status(503).json();
        }
        return res.status(201).json();
    });

    app.put('/api/sku/:id',[
        param('id').isInt({min: 0}),
        body('newDescription').isAscii().isLength({min:1}),
        body('newWeight').isInt({min: 0}),
        body('newVolume').isInt({min: 0}),
        body('newNotes').isAscii(),
        body('newPrice').isFloat({min: 0}),
        body('newAvailableQuantity').isInt({min: 0})
    ],
    async (req,res)=>{

        let id = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
              return res.status(422).end();
        }
        if(Object.keys(req.body).length!== 6){
            return res.status(422).json();
        }
        let skus;
        let sku;
        try{
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            sku = await skus.getSKUById(id);
            if(!sku)
                return res.status(404).end();
            await skus.modifySKU(new SKU(req.body.newDescription,req.body.newWeight,req.body.newVolume,req.body.newNotes,req.body.newAvailableQuantity,req.body.newPrice,[],"",id));
        }
        catch(err){
            return res.status(503).end();
        }
        return res.status(200).end();
    });

    app.put('/api/sku/:id/position',[
        param('id').isInt({min: 0}),
        body('position').isLength({min: 12, max: 12})
    ],
    async (req,res)=>{

        let id = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
              return res.status(422).end();
        }
        if(Object.keys(req.body).length !== 1){
            return res.status(422).end();
        }
        let sku;
        let skus;
        let positions;
        let position;
        try{
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            sku = await skus.getSKUById(id);
            if(!sku){
                return res.status(404).end();
            }
            positions = new PositionDB('WarehouseDB');
            await positions.createPositionTable();
            position = new Position(await positions.getPosition(req.body.position));
            if(!position){
                return res.status(404).end();
            }
            if(req.body.position === sku.getPositionId()){
                console.log("same position");
                return res.status(422).end();
            }
            if(!(await skus.occupiedByOthers(req.body.position,sku.getId()))){
                if(!position.fits(sku.getTotalWeight(),sku.getTotalVolume())){
                    console.log("Not fit");
                    return res.status(503).end();
                }
                else{
                    if(sku.getPositionId()){
                        const oldPosition = await positions.getPosition(sku.getPositionId());
                        //Free old position
                        await positions.changePosition(oldPosition.aisleID,oldPosition.row,oldPosition.col,oldPosition.maxWeight,oldPosition.maxVolume,0,0);
                    }
                    await positions.changePosition(position.aisleID,position.row,position.col,position.maxWeight,position.maxVolume,sku.getTotalWeight(),sku.getTotalVolume());
                    sku.setPositionId(req.body.position);
                    await skus.setSKUPosition(sku.getID(),req.body.position);
                    return res.status(200).end();
                }
            }
        }
        catch(err){
            console.log(err);
            return res.status(503).end();
        }
    });

    app.delete('/api/skus/:id',
    param('id').isInt({min: 0}),
    async (req,res) =>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
              return res.status(422).end();
        }
        let id = req.params.id;
        let skus;
        let sku;
        let positions;
        let position;
        try{
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            sku = await skus.getSKUById(id);
            if(!sku){
                return res.status(404).end();
            }
            if(sku.getPositionId()){
                positions = new PositionDB('WarehouseDB');
                position = new Position(await positions.getPosition(sku.getPositionId()));
                position.setOccWeight(0);
                position.setOccVol(0);
                await positions.modifyPosition(position);
            }
            await skus.deleteSKU(id);
            return res.status(204).end();
        }
        catch(err){
            return res.status(503).end();
        }
    });
}