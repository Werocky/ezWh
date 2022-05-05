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
            return res.status(422).json();
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
        return await login(req, res, 'manager');
    });

    app.post('/api/customerSessions', async (req,res) => {
        return await login(req, res, 'customer');
    });

    app.post('/api/supplierSessions', async (req,res) => {
        return await login(req, res, 'supplier');
    });

    app.post('/api/clerkSessions', async (req,res) => {
        return await login(req, res, 'clerk');
    });

    app.post('/api/qualityEmployeeSessions', async (req,res) => {
        return await login(req, res, 'qualityEmployee');
    });

    app.post('/api/deliveryEmployeeSessions', async (req,res) => {
        return await login(req, res, 'deliveryEmployee');
    });

    app.post('/api/logout', (req, res) => {
        currentUser = undefined;
        return res.status(200).json();
    });

    app.put('/api/users/:username', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 404 -> Not Found (wrong username or oldType fields or user doesn't exists), 
         * 422 -> Unprocessable Entity (validation of request body failed or attempt to modify rights to administrator or manager), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        if(Object.keys(req.body).length!==2 || !types.includes(req.body.oldType)) { 
            return res.status(422).json();
        }

        let username = req.params.username;
        
        let users;
        try {
            users = new UsersDB('WarehouseDB');
            await users.createUserTable();
            if(!await users.alreadyExists(username, req.body.oldType)) {
                // user not found
                return res.status(404).json();
            }
            await users.updateRight(username, req.body.newType);
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(200).json();
    });

    app.put('/api/users/:username/:type', async (req,res)=>{
        /**Error responses: 
         * 401 -> Unauthorized (not logged in or wrong permissions),
         * 422 -> Unprocessable Entity (validation of username or of type failed or attempt to delete a manager/administrator), 
         * 503 -> Service Unavailable (generic error). 
         */
        
        let username = req.params.username;
        let type = req.params.type;

        if(!username || !types.includes(type)) { 
            return res.status(422).json();
        }
        
        let users;
        try {
            users = new UsersDB('WarehouseDB');
            await users.createUserTable();
            if(!await users.alreadyExists(username, type)) {
                // user not found
                return res.status(422).json();
            }
            await users.deleteUser(username, type);
        } catch (err) {
            // generic error
            return res.status(503).json(); // Service Unavailable
        }
        return res.status(204).json();
    });

}

async function login(req, res, type) {
    if(Object.keys(req.body).length!==2) { 
        return res.status(401).json();
    }
    let users;
    let user;
    try {
        users = new UsersDB('WarehouseDB');
        user = await users.login(req.body.username, req.body.password, type);
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
}