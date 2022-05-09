'use strict';

const PositionDB = require('./PositionDB');

module.exports = function (app) {

  //get all positions
  app.get('/api/positions', async (req, res) => {

    let positions;
    try {
      positions = new PositionDB('WarehouseDB');
      await positions.createPositionTable();
      positions = await positions.getPositions();
      if (!positions) {
        return res.status(404).json();
      }
    } catch (err) {
      // generic error
      return res.status(503).json(); // Service Unavailable
    }
    return res.status(200).json(positions);
  });

  app.post('/api/position', async (req, res) => {
    //401 Unauthorized (not logged in or wrong permissions)
    //422 Unprocessable Entity (validation of request body failed)
    //503 Service Unavailable (generic error)

    if (Object.keys(req.body).length !== 6 || req.body.aisleID.length !== 4 || req.body.row.length !== 4 || req.body.col.length !== 4 || req.body.positionID !== req.body.aisleID.concat(req.body.row, req.body.col)) {
      return res.status(422).json();
    }

    let positions;
    try {
      positions = new PositionDB('WarehouseDB');
      await positions.createPositionTable();
      await positions.createPosition(req.body.positionID, req.body.aisleID, req.body.row, req.body.col, req.body.maxWeight, req.body.maxVolume);
    } catch (err) {
      // generic error
      return res.status(503).json(); // Service Unavailable
    }
    return res.status(201).json();
  });

  /*
  //creates a new position
  app.post('/api/position', async (req,res) => {
    //401 Unauthorized (not logged in or wrong permissions)
    //422 Unprocessable Entity (validation of request body failed)
    //503 Service Unavailable (generic error)

    if(Object.keys(req.body).length <= 4 || req.body.aisleID.length !== 4 || req.body.row.length !== 4 || req.body.col.length !== 4) { 
        return res.status(422).json();
    }

    let positions;
    let positionID = req.body.aisleID.concat(row, col);
    try {
        positions = new PositionDB('WarehouseDB');
        await positions.createPositionTable();
        await positions.createPosition(positionID, req.body.aisleID, req.body.row, req.body.col, req.body.maxWeight, req.body.maxVolume);
    } catch (err) {
        // generic error
        return res.status(503).json(); // Service Unavailable
    }
    return res.status(201).json();
  });
  */

  //Modify a position identified by positionID
  app.put('/api/position/:positionID', async (req, res) => {
    /**Error responses: 
     * 401 -> Unauthorized (not logged in or wrong permissions),
     * 404 -> Not Found (no position associated to positionID),
     * 422 -> Unprocessable Entity (validation of request body or of postionID failed), 
     * 503 -> Service Unavailable (generic error). 
     */

    let id = req.params.positionID;

    if (!id || Object.keys(req.body).length !== 7) {
      return res.status(422).json();
    }

    let positions;
    try {
      positions = new PositionDB('WarehouseDB');
      await positions.createPositionTable();

      if (!await positions.getPosition(id)) {
        //restock order not found
        return res.status(404).json();
      }

      await positions.changePosition(id, req.body.newAisleID, req.body.newRow, req.body.newCol, req.body.newMaxWeight, req.body.newMaxVolume, req.body.newOccupiedWeight, req.body.newOccupiedVolume);
    } catch (err) {
      // generic error
      return res.status(503).json(); // Service Unavailable
    }
    return res.status(200).json();
  });

  //MODIFY THE POSITION ID OF A POSITION
  app.put('/api/position/:positionID/changeID', async (req, res) => {
    /**Error responses: 
     * 401 -> Unauthorized (not logged in or wrong permissions),
     * 404 -> Not Found (no position associated to positionID),
     * 422 -> Unprocessable Entity (validation of request body or of postionID failed), 
     * 503 -> Service Unavailable (generic error). 
     */

    let id = req.params.positionID;

    if (!id || Object.keys(req.body).length !== 1) {
      return res.status(422).json();
    }

    let positions;
    try {
      positions = new PositionDB('WarehouseDB');
      await positions.createPositionTable();

      if (!await positions.getPosition(id)) {
        //restock order not found
        return res.status(404).json();
      }

      await positions.changePositionID(id, req.body.newPositionID);
    } catch (err) {
      // generic error
      return res.status(503).json(); // Service Unavailable
    }
    return res.status(200).json();
  });

  //delete a position
  app.delete('/api/position/:positionID', async (req, res) => {
    //Error responses: 
    //401 -> Unauthorized (not logged in or wrong permissions),
    //422 -> Unprocessable Entity (validation of positionID failed), 
    //503 -> Service Unavailable (generic error). 

    let id = req.params.positionID;

    if (!id) {
      return res.status(422).json();
    }

    let positions;
    try {
      positions = new PositionDB('WarehouseDB');
      await positions.createPositionTable();
      await positions.deletePosition(id);
    } catch (err) {
      // generic error
      return res.status(503).json(); // Service Unavailable
    }
    return res.status(204).json();
  });

}