'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const UsersDB = require('../modules/UsersDB');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe("test manage users and rights scenarios", () => {

    beforeEach(async () => {
        const users = new UsersDB('WarehouseDB');
        await users.deleteAllUsers();
    })

    //SCENARIO 4-1
    createUser(201, "username@gmail.com", "name", "surname", "password99", "clerk");
    //SCENARIO 4-2
    changeUserRights(200, "username@gmail.com", "qualityEmployee", "clerk");    
    //SCENARIO 4-3
    deleteUser(204, "username@gmail.com", "clerk");
})

function createUser(expectedHTTPStatus, username, name, surname, password, type) {
    it('adding a new user', function (done) {
        let user = { username: username, name: name, surname: surname, password: password, type: type }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                agent.get('api/users')
                    .then(function (r) {
                        r.should.have.status(200);
                        r.body[0].id.should.equal(1);
                        r.body[0].name.should.equal(name);
                        r.body[0].surname.should.equal(surname);
                        r.body[0].email.should.equal(username);
                        r.body[0].type.should.equal(type);
                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}

function changeUserRights(expectedHTTPStatus, username, oldType, newType) {
    it('modify user rights', function (done) {
        let user = { username: username, name: "name", surname: "surname", password: "password99", type: oldType }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.put('api/users/' + username)
                    .send({ oldType: oldType, newType: newType })
                    .then(function (rs) {
                        rs.should.have.status(expectedHTTPStatus);
                        agent.get('api/users')
                            .then(function (r) {
                                r.should.have.status(200);
                                r.body[0].id.should.equal(1);
                                r.body[0].name.should.equal("name");
                                r.body[0].surname.should.equal("surname");
                                r.body[0].email.should.equal(username);
                                r.body[0].type.should.equal(newType);
                            })
                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}

function deleteUser(expectedHTTPStatus, username, type) {
    it('deleting a user', function (done) {
        let user = { username: username, name: "name", surname: "surname", password: "password99", type: type }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.delete('/api/users/' + username + '/' + type)
                    .then(function (rs) {
                        rs.should.have.status(expectedHTTPStatus);
                        agent.delete('/api/users/' + username + '/' + type)
                            .then(function (r) {
                                r.should.have.status(422); 
                                //validation of username/type failed
                            })
                    })
            })
            .then(() => done(), done)
            .catch((error) => {
                done(error);
            });
    })
}