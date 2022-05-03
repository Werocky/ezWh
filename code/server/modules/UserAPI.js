'use strict';

const UsersDB = require('./UsersDB');

const types = ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"];


module.exports = function(app) {
    app.post('/api/newUser', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 409 -> Conflict (user with same mail and type already exists), 
         * 422 -> Unprocessable Entity (validation of request body failed or attempt to create manager or administrator accounts), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        if(Object.keys(req.body).length===0 || req.body.password.length<8 || !types.includes(req.body.type)) { 
            return res.status(422);
        }

        let users;
        try {
            users = new UsersDB('WarehouseDB');
            console.log("A");
            await users.createUserTable();
            console.log("B");
            if(await users.alreadyExists(req.body.username, req.body.type)) {
                // user with same mail and type already exists
                return res.status(409).json();
            }
            await users.createUser(req.body.username, req.body.name, req.body.surname, req.body.password, req.body.type);
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(201).json();
    });
}