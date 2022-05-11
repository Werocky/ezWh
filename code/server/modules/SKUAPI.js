'use strict';

const SKUDB = require('./SKUsDB');
const SKU = require('./SKU');
const Position = require('./Position');
const PositionDB = require('./PositionDB');

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

    })

    app.get('/api/skus/:id', async(req,res)=>{

        let id=req.params.id;
        if(!id || Object.keys(req.body).length===0){
            return res.status(422).json();
        }
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
            return res.status(404).json();
        return res.status(200).json(sku);
    });

    app.post('/api/sku', async (req,res)=>{
        if(Object.keys(req.body).length !== 6){
            return res.staus(422).json();
        }
        let skus;
        try{
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            await skus.createSKU(new SKU(req.body.description,req.body.weight,req.body.volume,req.body.notes,req.body.availableQuantity,req.body.price));
        }
        catch(err){
            return res.status(503).json();
        }
        return res.status(201).json();
    });

    app.put('/api/sku/:id',(req,res)=>{

        let id = req.params.id;
        if(!id || Object.keys(req.body)!== 7){
            return res.status(422).json();
        }
        let skus;
        let sku;
        let positions;
        let position;
        try{
            skus = new SKUDB('WarehouseDB');
            positions = new PositionDB('WarehouseDB');
            await positions.createPositionTable();
            await skus.createSKUTable();
            sku = await skus.getSKUById(id);
            if(!sku)
                return res.status(404).json();
            await skus.modifySKU(new SKU(req.body.newDescription,req.body.newWeight,req.body.newVolume,req.body.newNotes,req.body.newAvailableQuantity,req.body.newPrice));
        }
        catch(err){
            return res.status(503).json();
        }
        return res.status(200).json();
    });

    app.put('/api/sku/:id/position',(req,res)=>{

        let id = req.params.id;
        if(!id || Object.keys(req.body) !== 1){
            return res.status(422).json();
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
                return res.status(404).json();
            }
            positions = new PositionDB('WarehouseDB');
            await positions.createPositionTable();
            position = new Position(await positions.getPosition(req.body.position));
            if(!position){
                return res.status(404).json();
            }
            if(req.body.position === sku.getPositionId()){
                return res.status(422).json();
            }
            if(!(await occupiedByOthers(req.body.position,sku.getID()))){
                if(!position.fits(sku.getTotalWeight(),sku.getTotalVolume())){
                    return res.status(503).json();
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
                    return res.status(200).json();
                }
            }
        }
        catch(err){
            return res.status(503).json();
        }
    });

    app.delete('/api/skus/:id',(req,res) =>{

        let id = req.params.id;
        if(!id){
            return res.status(422).json();
        }
        let skus;
        let sku;
        let positions;
        let position;
        try{
            skus = new SKUDB('WarehouseDB');
            await skus.createSKUTable();
            sku = await skus.getSKUById(id);
            if(!sku){
                return res.status(404).json();
            }
            if(sku.getPositionId()){
                positions = new PositionDB('WarehouseDB');
                position = new Position(await positions.getPosition(sku.getPositionId()));
                position.setOccWeight(0);
                position.setOccVol(0);
                await positions.modifyPosition(position);
            }
            await skus.deleteSKU(id);
            return res.status(204).json();
        }
        catch(err){
            return res.status(503).json();
        }
    });
}