'use strict';

const SKUDB = require('./SKUDB');

module.exports=function(app){

    app.get('/api/skus', async (req,res) =>{

        return getSKUs(res); 
    })

    app.get('/api/skus/:id', async(req,res)=>{

    })

    app.post('/api/sku',(req,res)=>{

    })

    app.put('/api/sku/:id',(req,res)=>{

    })

    app.put('/api/sku/:id/position',(req,res)=>{

    })

    app.delete('/api/skus/:id',(req,res) =>{
        
    })
}