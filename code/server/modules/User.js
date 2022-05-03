'use strict'

class User {

    constructor(username, name, surname, password, type) {
        this.name = name;
        this.surname = surname;
        this.email = username;
        this.password = this.encrypt(password);
        this.type = type;
    }

    encrypt(password) {
        let encryptedPassword = password;
        //Algorithm to encrypt

        return encryptedPassword;
    }
}

module.exports = User;