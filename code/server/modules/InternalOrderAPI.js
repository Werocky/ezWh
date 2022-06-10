'use strict';

const dayjs = require('dayjs');
const CustomParseFormat = require('dayjs/plugin/CustomParseFormat');
const { body, param, check, validationResult } = require('express-validator');
const InternalOrderDB = require("./InternalOrderDB");
const PositionDB = require('./PositionDB');
const Position = require('./Position')
const SKUDB = require('./SKUsDB');
const SKUItemsDB = require('./SKUItemsDB');
const SKU = require('./SKU');

const STATES = ['ISSUED', 'ACCEPTED', 'REFUSED', 'CANCELED', 'COMPLETED'];
dayjs.extend(CustomParseFormat);
module.exports = function (app) {

    //GET APIs

    //return the internal orders present in the database
    //request body: none
    app.get('/api/internalOrders', async (req, res) => {
        let internalOrders;
        try {
            internalOrders = new InternalOrderDB('WarehouseDB');
            await internalOrders.createInternalTable();
            internalOrders = await internalOrders.getInternalOrders();
        } catch (err) {
            //service unavailable (generic error)
            return res.status(500).end();
        }
        //success, data retrieved
        return res.status(200).json(internalOrders);
    })

    //return the internal orders present in the database in state = issued
    //request body: none
    app.get('/api/internalOrdersIssued', async (req, res) => {
        let internalOrders;
        try {
            internalOrders = new InternalOrderDB('WarehouseDB');
            await internalOrders.createInternalTable();
            internalOrders = await internalOrders.getInternalOrders();
        } catch (err) {
            //service unavailable (generic error)
            return res.status(500).end();
        }

        internalOrders = internalOrders.filter(e => { return e.state === 'ISSUED'; })

        //success, data retrieved
        return res.status(200).json(internalOrders);
    })

    //return the internal orders present in the database in state = accepted
    //request body: none
    app.get('/api/internalOrdersAccepted', async (req, res) => {
        let internalOrders;
        try {
            internalOrders = new InternalOrderDB('WarehouseDB');
            await internalOrders.createInternalTable();
            internalOrders = await internalOrders.getInternalOrders();
        } catch (err) {
            //service unavailable (generic error)
            return res.status(500).end();
        }

        internalOrders = internalOrders.filter(e => { return e.state === 'ACCEPTED'; })
        //success, data retrieved
        return res.status(200).json(internalOrders);
    })

    //return the internal order present in the database with id = :id
    //request body: none
    //request header: id
    app.get('/api/internalOrders/:id',
        param('id').isInt(),
        async (req, res) => {

            const err = validationResult(req);

            if (!err.isEmpty()) {
                return res.status(422).end();
            }

            let internalOrders;
            let internalOrder;
            try {
                internalOrders = new InternalOrderDB('WarehouseDB');
                await internalOrders.createInternalTable();
                internalOrder = await internalOrders.getInternalOrder(req.params.id);
                if (!internalOrder) {
                    //not found, no internal order associated to the id = :id
                    return res.status(404).end();
                }
            } catch (err) {
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
        check('products.*.SKUId').isInt({ min: 0 }),
        check('products.*.qty').isInt({ min: 0 }),
        body('customerId').isInt({ min: 0 }),
        async (req, res) => {

            const err = validationResult(req);

            if (!err.isEmpty()) {
                return res.status(422).end();
            }

            if (!req.body.issueDate || !dayjs(req.body.issueDate, ['YYYY/MM/DD', 'YYYY/MM/DD HH:mm'], true).isValid()) {
                return res.status(422).end();
            }

            let internalOrder
            try {
                const positions = new PositionDB('WarehouseDB');
                await positions.createPositionTable();
                const skus = new SKUDB('WarehouseDB');
                await skus.createSKUTable();
                internalOrder = new InternalOrderDB('WarehouseDB');
                await internalOrder.createInternalTable();
                let sku;
                for (let i = 0; i < req.body.products.length; i++) {
                    sku = await skus.getSKUById(req.body.products[i].SKUId);
                    if (sku /*|| sku.getAvailableQuantity() < req.body.products[i].qty*/){
                    sku.setAvailableQuantity(sku.getAvailableQuantity() - req.body.products[i].qty)
                    /*let position = await positions.getPosition(sku.getPositionId())
                    if (!position)
                        return res.status(422).end();
                    await positions.changePosition(position.getPositionID(), position.getAisleID(), position.getRow(), position.getCol(), position.getMaxWeight(), position.getMaxVolume(), sku.getTotalWeight(), sku.getTotalVolume());
                    */await skus.modifySKU(sku);
                    }
                }
                await internalOrder.createInternalOrder(req.body.issueDate, req.body.products, req.body.customerId, 'ISSUED');
            } catch (err) {
                return res.status(503).end();
            }
            //success, entry created
            return res.status(201).json();
        })

    //PUT APIs
    //modify the statuts of an internal order
    //request body: new state and products array (to be considered if != completed)
    //request header: id
    app.put('/api/internalOrders/:id',
        check('products.*.SkuID').if(body('newState').equals('COMPLETED')).isInt({ min: 0 }),
        check('products.*.RFID').if(body('newState').equals('COMPLETED')).isLength({ min: 32, max: 32 }),
        body('newState').isIn(STATES),
        param('id').isInt(),
        async (req, res) => {

            const err = validationResult(req);

            if (!err.isEmpty()) {
                return res.status(422).end();
            }

            let internalOrders;
            try {
                internalOrders = new InternalOrderDB('WarehouseDB');
                await internalOrders.createInternalTable();
                let internalOrder = await internalOrders.getInternalOrder(req.params.id)
                if (!internalOrder) {
                    //order not found
                    return res.status(404).end();
                }

                if (internalOrder.state === "ISSUED" && (req.body.newState === 'CANCELED' || req.body.newState === 'REFUSED')) {
                    const positions = new PositionDB('WarehouseDB');
                    await positions.createPositionTable();
                    const skus = new SKUDB('WarehouseDB');
                    await skus.createSKUTable();
                    let sku;
                    for (let i = 0; i < internalOrder.products.length; i++) {
                        sku = await skus.getSKUById(internalOrder.products[i].SKUId);
                        if(sku){
                        sku.setAvailableQuantity(sku.getAvailableQuantity() + internalOrder.products[i].qty)
                        /*let position = await positions.getPosition(sku.getPositionId())
                        if (!position)
                            return res.status(422).end();
                        await positions.changePosition(position.getPositionID(), position.getAisleID(), position.getRow(), position.getCol(), position.getMaxWeight(), position.getMaxVolume(), sku.getTotalWeight(), sku.getTotalVolume());
                        */await skus.modifySKU(sku);
                        }
                    }
                    await internalOrders.changeState(req.params.id, req.body.newState);
                }
                else if (req.body.newState === 'COMPLETED') {
                    const skuItems = new SKUItemsDB('WarehouseDB');
                    await skuItems.createSKUItemsTable();
                    let skuItem;
                    for (let i = 0; i < req.body.products.length; i++) {
                        //skuItem = await skuItems.getAvailableSKUItemsBySKUId(req.body.products[i].SkuID);
                        //skuItems.modifySKUItem(skuItem[0].RFID, 0, null, skuItem[0].RFID)
                        await skuItems.modifySKUItem(req.body.products[i].RFID, 0, null, req.body.products[i].RFID)
                    }
                    await internalOrders.changeState(req.params.id, req.body.newState, req.body.products);
                }

            } catch (err) {
                //service unavailable, generic error
                console.log(err);
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
        async (req, res) => {

            const err = validationResult(req);

            if (!err.isEmpty()) {
                return res.status(422).end();
            }

            let internalOrders;
            try {
                internalOrders = new InternalOrderDB('WarehouseDB');
                await internalOrders.createInternalTable();
                await internalOrders.deleteInternalOrder(req.params.id);
                if (Object.keys(internalOrders).length === 0) {
                    //not found, no internal order associated to the id = :id
                    return res.status(204).end();
                }
            } catch (err) {
                //service unavailable, generic error
                return res.status(503).end();
            }
            //success, internal order deleted
            return res.status(204).end();
        })
}