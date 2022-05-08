'use strict';
const express = require('express');
const UserAPI = require('./modules/UserAPI');
const RestockOrderAPI = require('./modules/RestockOrderAPI');
const InternalOrderAPI = require('./modules/InternalOrderAPI');

// init express
const app = new express();
const port = 3001;

app.use(express.json());

UserAPI(app);
RestockOrderAPI(app);
InternalOrderAPI(app);

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