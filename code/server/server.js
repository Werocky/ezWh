'use strict';
const express = require('express');
const UserAPI = require('./modules/UserAPI');
const SKUAPI = require('./modules/SKUAPI');
const SKUItemAPI = require('./modules/SKUItemAPI');
const RestockOrderAPI = require('./modules/RestockOrderAPI');
const ReturnOrderAPI = require('./modules/ReturnOrderAPI');
const InternalOrderAPI = require('./modules/InternalOrderAPI');
const TestDescriptorAPI = require('./modules/TestDescriptorAPI');
const TestResultAPI = require('./modules/TestResultAPI');
const PositionAPI = require('./modules/PositionAPI');
const ItemAPI = require('./modules/ItemAPI');

// init express
const app = new express();
const port = 3001;

app.use(express.json());

UserAPI(app);
SKUAPI(app);
SKUItemAPI(app);
RestockOrderAPI(app);
ReturnOrderAPI(app);
InternalOrderAPI(app);
TestDescriptorAPI(app);
TestResultAPI(app);
PositionAPI(app);
ItemAPI(app);

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;