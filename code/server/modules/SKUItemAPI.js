'use strict';

const SKUItemsDB = require('./SKUItemsDB');
const SKUItem = require('./SKUItem');
const Position = require('./Position');
const PositionDB = require('./PositionDB');
const dayjs = require('dayjs');

module.exports = function(app){
    
    app.get('/api/skuitems',async (req,res) =>{
     
        let skuItems;
        try{
            skuItems = new SKUItemsDB('WarehouseDB');
        }
        catch(err){
            
        }
    })

    app.get('/api/skuitems/sku/:id',async (req,res) =>{
     
    })

    app.get('/api/skuitems/:rfid',async (req,res) =>{
     
    })

    app.post('/api/skuitem',async (req,res) =>{
     
    })

    app.put('/api/skuitems/:rfid',async (req,res) =>{
     
    })

    app.delete('/api/skuitems/:rfid',async (req,res) =>{
     
    })
}