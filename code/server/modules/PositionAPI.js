'use strict';

const PositionDB = require('./PositionDB');

module.exports = function(app) {

  //get all positions
  app.get('/api/positions', async (req,res) => {
      let positions = await new PositionDB('WarehouseDB').getPositions();
    return res.status(200).json(positions);
  });

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




  //app.PUT is missing!!!!
   //app.PUT is missing!!!!
    //app.PUT is missing!!!!
     //app.PUT is missing!!!!




  //delete a position
  app.delete('/api/position/:positionID', async (req,res) => {
    //Error responses: 
    //401 -> Unauthorized (not logged in or wrong permissions),
    //422 -> Unprocessable Entity (validation of request body failed), 
    //503 -> Service Unavailable (generic error). 
    
    let id = req.params.positionID;

    if(!id || Object.keys(req.body).length <= 4 || req.body.aisleID.length !== 4 || req.body.row.length !== 4 || req.body.col.length !== 4) { 
      return res.status(422).json();
    }

    let positions;
    try {
        positions = new PositionDB('WarehouseDB');
        await positions.deletePosition(id);
    } catch (err) {
        // generic error
        return res.status(503).json(); // Service Unavailable
    }
    return res.status(204).json();
});

}