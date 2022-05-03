'use strict';

const UsersDB = require('./UsersDB');
const User = require('./User');

const types = ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"];

let currentUser = undefined;

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
            await users.createUserTable();
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

    app.post('/api/managerSessions', async (req,res) => {
        
        if(Object.keys(req.body).length!==2) { 
            return res.status(401);
        }
        let users;
        let user;
        try {
            users = new UsersDB('WarehouseDB');
            user = await users.login(req.body.username, req.body.password);
            if(!user) {
                return res.status(401).json();
            }
        } catch (err) {
            // generic error
            return res.status(500).json(); // Internal Server Error
        }
        currentUser = user;
        const userInfo = {
            id: user.id,
            username: user.email,
            name: user.name
        };
        return res.status(200).json(userInfo);
    });
}