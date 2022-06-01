'use strict';

const SKUDB = require('./SKUsDB');
const SKU = require('./SKU');
const Position = require('./Position');
const PositionDB = require('./PositionDB');
const { body, param, validationResult } = require('express-validator');
const TestDescriptorDB = require('./TestDescriptorDB');



module.exports = function (app) {


    //let skus = new SKUDB('WarehouseDB');
    //async () => await skus.createSKUTable();
    //let positions = new PositionDB('WarehouseDB');
    //async () => await positions.createPositionTable().then();

    const getSKUs = async () => {
        let skus = new SKUDB('WarehouseDB');
        await skus.createSKUTable();
        skus = await skus.getSKUs();
        return (skus);
    }
    //GET ALL SKUS
    app.get('/api/skus', async (req, res) => {

        let skus;
        try {
            skus = await getSKUs();
        }
        catch (err) {
            return res.status(500).json();
        }
        return res.status(200).json(skus);

    });

    const getSKUById = async (id) => {
        let skus = new SKUDB('WarehouseDB');
        await skus.createSKUTable();
        const sku = await skus.getSKUById(id);
        return (sku);
    }
    //GET AN SKU BY ITS ID
    app.get('/api/skus/:id',
        param('id').isInt({ min: 0 }),
        async (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).end();
            }
            let id = req.params.id;
            let sku;
            try {
                sku = await getSKUById(id);
            }
            catch (err) {
                return res.status(500).json();
            }
            if (!sku)
                return res.status(404).end();
            return res.status(200).json(sku);
        });

    const createSKU = async (description, weight, volume, notes, price, availableQuantity) => {
        let skus = new SKUDB('WarehouseDB');
        let positions = new PositionDB('WarehouseDB');
        await positions.createPositionTable();
        await skus.createSKUTable();
        await skus.createSKU(description, weight, volume, notes, price, availableQuantity);
    }
    //CREATE SKU
    app.post('/api/sku', [
        body('description').isString().isLength({ min: 1 }),
        body('weight').isInt({ min: 0 }),
        body('volume').isInt({ min: 0 }),
        body('notes').isString().isLength({ min: 1 }),
        body('price').isFloat({ min: 0 }),
        body('availableQuantity').isInt({ min: 0 })],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).end();
            }
            if (Object.keys(req.body).length !== 6) {
                return res.status(422).json();
            }
            try {
                await createSKU(req.body.description, req.body.weight, req.body.volume, req.body.notes, req.body.price, req.body.availableQuantity);
            }
            catch (err) {
                return res.status(503).json();
            }
            return res.status(201).json();
        });

    const modifySKU = async (newDescription, newWeight, newVolume, newNotes, newAvailableQuantity, newPrice, newTestDescriptors, id) => {
        let skus = new SKUDB('WarehouseDB');
        await skus.createSKUTable();
        const sku = await skus.getSKUById(id);
        if (!sku)
            return 404;
        if (sku.getPositionId() && (sku.getAvailableQuantity() !== newAvailableQuantity || sku.getWeight() !== newWeight || sku.getVolume() !== newVolume)) {
            const positions = new PositionDB('WarehouseDB');
            const position = positions.getPosition(sku.getPositionId());
            if (!position)
                return 404;
            //The following operation will raise an exception if the modified SKU doesn't fit the position
            await positions.changePosition(sku.getPositionId(), position.getAisleID(), positions.getRow(), position.getCol(), position.getMaxWeight(), position.getMaxVolume(), sku.getTotalWeight(), sku.getTotalVolume());
        }
        await skus.modifySKU(new SKU(newDescription, newWeight, newVolume, newNotes, newAvailableQuantity, newPrice, newTestDescriptors, sku.getPositionID(), id));
        return 201;
    }
    //CHANGE SKU INFORMATION
    app.put('/api/sku/:id', [
        param('id').isInt({ min: 0 }),
        body('newDescription').isString().isLength({ min: 1 }),
        body('newWeight').isInt({ min: 0 }),
        body('newVolume').isInt({ min: 0 }),
        body('newNotes').isString(),
        body('newPrice').isFloat({ min: 0 }),
        body('newAvailableQuantity').isInt({ min: 0 }),
        body('newTestDescriptors').isArray()
    ],
        async (req, res) => {

            let id = req.params.id;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).end();
            }
            if (Object.keys(req.body).length !== 6) {
                return res.status(422).json();
            }
            let response
            try {
                response = await modifySKU(req.body.newDescription, req.body.newWeight, req.body.newVolume, req.body.newNotes, req.body.newAvailableQuantity, req.body.newPrice, newTestDescriptors);
            }
            catch (err) {
                return res.status(503).end();
            }
            return res.status(response).end();
        });
    //CHANGE SKU POSITION

    const setSKUPosition = async (id, positionId) => {
        let skus = new SKUDB('WarehouseDB');
        await skus.createSKUTable();
        let sku = await skus.getSKUById(id);
        if (!sku) {
            return 404
        }
        let positions = new PositionDB('WarehouseDB');
        await positions.createPositionTable();
        if (positionId) {
            let position = await positions.getPosition(positionId);
            if (!position) {
                return 404
            }
            if (positionId === sku.getPositionId() || await skus.occupiedByOthers(positionId, sku.getId())) {
                return 422
            }
            if (sku.getPositionId()) {
                const oldPosition = await positions.getPosition(sku.getPositionId());
                await positions.changePosition(oldPosition.getPositionID(), oldPosition.getAisleID(), oldPosition.getRow(), oldPosition.getCol(), oldPosition.getMaxWeight(), oldPosition.getMaxVolume(), 0, 0);
            }
            await positions.changePosition(positionId, position.getAisleID(), position.getRow(), position.getCol(), position.getMaxWeight(), position.getMaxVolume(), sku.getTotalWeight(), sku.getTotalVolume());
            await skus.setSKUPosition(id, positionId);
        }
        else {
            if (sku.getPositionId()) {
                const oldPosition = await positions.getPosition(sku.getPositionId());
                await positions.changePosition(sku.getPositionId(), oldPosition.getAisleID(), oldPosition.getRow(), oldPosition.getCol(), oldPosition.getMaxWeight(), oldPosition.getMaxVolume(), 0, 0);
                await skus.setSKUPosition(id, "");
            }
        }
        return 200
    }
    app.put('/api/sku/:id/position', [
        param('id').isInt({ min: 0 }),
        body('position').isString().isLength({ min: 12, max: 12 }),],
        async (req, res) => {

            let id = req.params.id;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).end();
            }
            if (Object.keys(req.body).length !== 1) {
                return res.status(422).end();
            }
            let response;
            try {
                response = await setSKUPosition(id, req.body.position)
            }
            catch (err) {
                return res.status(503).end();
            }
            return res.status(response).end();
        });


    //DELETE AN SKU
    const deleteSKU = async (id) => {
        let skus = new SKUDB('WarehouseDB');
        await skus.createSKUTable();
        let sku = await skus.getSKUById(id);
        if (!sku) {
            return 404;
        }
        if (sku.getPositionId()) {
            let positions = new PositionDB('WarehouseDB');
            let position = await positions.getPosition(sku.getPositionId());
            await positions.changePosition(position.getPositionID(), position.getAisleID(), position.getRow(), position.getCol(), position.getMaxWeight(), position.getMaxVolume(), 0, 0);
        }
        await skus.deleteSKU(id);
        //let testDescriptors = new TestDescriptorDB('WarehouseDB');
        //let testDescriptor = testDescriptors.getTestDescriptorBySku(id);
        //if (testDescriptor) {
            /*
            let descriptors = testDescriptor.getIdSku();
            let index = descriptors.indexOf(id);
            if (index !== 1)
                index.splice(index, 1);
            testDescriptor.setSkuId(descriptors);
            testDescriptors.updateTestDescriptor(testDescriptor);
            */
        //}
        return 204;
    }

    app.delete('/api/skus/:id',
        param('id').isInt({ min: 0 }),
        async (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).end();
            }
            let id = req.params.id;
            let response;
            try {
                response = await deleteSKU(id);
            }
            catch (err) {
                return res.status(503).end();
            }
            return res.status(response).end();
        });
}