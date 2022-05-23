'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const UsersDB = require('../modules/UsersDB');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe("test manage login and logout scenarios", () => {

    beforeEach(async () => {
        const users = new UsersDB('WarehouseDB');
        await users.deleteAllUsers();
    })

    //SCENARIO 7-1
    login(200, "username@gmail.com", "password99", "clerk");
    //SCENARIO 7-2
    logout(200);
})

function login(expectedHTTPStatus, username, password, type) {
    it('login', function (done) {
        let user = { username: username, name: "name", surname: "surname", password: password, type: type }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('api/' + type + 'Sessions')
                    .send({ username: username, password: password })
                    .then(function (rs) {
                        rs.should.have.status(expectedHTTPStatus);
                        agent.get('api/users')
                            .then(function (r) {
                                r.should.have.status(200);
                                r.body[0].id.should.equal(1);
                                r.body[0].name.should.equal("name");
                                r.body[0].email.should.equal(username);
                                done();
                            })
                    })
            })
    })
}

function logout(expectedHTTPStatus) {
    it('login', function (done) {
        let user = { username: username, name: "name", surname: "surname", password: password, type: type }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('api/' + type + 'Sessions')
                    .send({ username: username, password: password })
                    .then(function (rs) {
                        rs.should.have.status(200);
                        agent.get('api/users')
                            .then(function (r) {
                                r.should.have.status(200);
                                r.body[0].id.should.equal(1);
                                r.body[0].name.should.equal("name");
                                r.body[0].email.should.equal(username);
                                agent.post('api/logout')
                                    .then(function (r) {
                                        r.should.have.status(expectedHTTPStatus);
                                        done();
                                    })
                            })
                    })
            })
    })
}