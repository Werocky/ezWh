'use strict';

const SKUDB = require('./SKUsDB');
const SKU = require('./SKU');
const Position = require('./Position');
const PositionDB = require('./PositionDB');
const {body, param, validationResult} = require('express-validator');



module.exports=function(app){

    
    //let skus = new SKUDB('WarehouseDB');
    //async () => await skus.createSKUTable();
    //let positions = new PositionDB('WarehouseDB');
    //async () => await positions.createPositionTable().then();

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
    //CREATE SKU
    app.post('/api/sku',[
        body('description').isString().isLength({min:1}),
        body('weight').isInt({min: 0}),
        body('volume').isInt({min: 0}),
        body('notes').isString(),
        body('price').isFloat({min: 0}),
        body('availableQuantity').isInt({min: 0})], 
        async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
              return res.status(422).end();
        }
        if(Object.keys(req.body).length !== 6){
            return res.status(422).json();
        }
        let skus;
        try{
            skus = new SKUDB('WarehouseDB');
            const positions = new PositionDB('WarehouseDB');
            await positions.createPositionTable();
            await skus.createSKUTable();
            await skus.createSKU(req.body.description,req.body.weight,req.body.volume,req.body.notes,req.body.price,req.body.availableQuantity);
        }
        catch(err){
            console.log(err);
            return res.status(503).json();
        }
        return res.status(201).json();
    });
    //CHANGE SKU INFORMATION
    app.put('/api/sku/:id',[
        param('id').isInt({min: 0}),
        body('newDescription').isString().isLength({min:1}),
        body('newWeight').isInt({min: 0}),
        body('newVolume').isInt({min: 0}),
        body('newNotes').isString(),
        body('newPrice').isFloat({min: 0}),
        body('newAvailableQuantity').isInt({min: 0}),
        body('newTestDescriptors').isArray()
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
            if(sku.getPositionId() && (sku.getAvailableQuantity() !== req.body.newAvailableQuantity || sku.getWeight() !== req.body.newWeight || sku.getVolume() !== req.body.newVolume)){
                const positions = new PositionDB('WarehouseDB');
                const position = positions.getPosition(sku.getPositionId());
                if(!position)
                    return res.status(404).end();
                //The following operation will raise an exception if the modified SKU doesn't fit the position
                await positions.changePosition(sku.getPositionId(),position.getAisleID(),positions.getRow(),position.getCol(),position.getMaxWeight(),position.getMaxVolume(),sku.getTotalWeight(),sku.getTotalVolume());
            }
            await skus.modifySKU(new SKU(req.body.newDescription,req.body.newWeight,req.body.newVolume,req.body.newNotes,req.body.newAvailableQuantity,req.body.newPrice,newTestDescriptors,sku.getPositionID(),id));
        }
        catch(err){
            console.log(err);
            return res.status(503).end();
        }
        return res.status(200).end();
    });
    //CHANGE SKU POSITION
    app.put('/api/sku/:id/position',[
        param('id').isInt({min: 0}),
        body('position').isString()],
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
            if(req.body.position){
                position = await positions.getPosition(req.body.position);
                if(!position){
                return res.status(404).end();
                }
                if(req.body.position === sku.getPositionId() || await skus.occupiedByOthers(req.body.position,sku.getId())){
                    return res.status(422).end();
                }
                if(sku.getPositionId()){
                    const oldPosition = await positions.getPosition(sku.getPositionId());
                    await positions.changePosition(oldPosition.getPositionID(),oldPosition.getAisleID(),oldPosition.getRow(),oldPosition.getCol(),oldPosition.getMaxWeight(),oldPosition.getMaxVolume(),0,0);
                }
                await positions.changePosition(req.body.position,position.getAisleID(),position.getRow(),position.getCol(),position.getMaxWeight(),position.getMaxVolume(),sku.getTotalWeight(),sku.getTotalVolume());
                await skus.setSKUPosition(id,req.body.position);
            }
                else{
                        if(sku.getPositionId()){
                            const oldPosition = await positions.getPosition(sku.getPositionId());
                            await positions.changePosition(sku.getPositionId(),oldPosition.getAisleID(),oldPosition.getRow(),oldPosition.getCol(),oldPosition.getMaxWeight(),oldPosition.getMaxVolume(),0,0);
                            await skus.setSKUPosition(id,"");   
                        }
                    }
            return res.status(200).end();
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
                position = await positions.getPosition(sku.getPositionId());
                await positions.changePosition(position.getPositionID(),position.getAisleID(),position.getRow(),position.getCol(),position.getMaxWeight(),position.getMaxVolume(),0,0);
            }
            await skus.deleteSKU(id);
            return res.status(204).end();
        }
        catch(err){
            console.log(err);
            return res.status(503).end();
        }
    });
}