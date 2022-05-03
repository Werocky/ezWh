'use strict'

class User {

    constructor(username, name, surname, password, type, id = 0) {
        this.name = name;
        this.surname = surname;
        this.email = username;
        this.password = this.encrypt(password);
        this.type = type;
        this.id = id;
    }

    encrypt(password) {
        let encryptedPassword = password;
        //Algorithm to encrypt

        return encryptedPassword;
    }

    static encrypt(password) {
        let encryptedPassword = password;
        //Algorithm to encrypt

        return encryptedPassword;
    }
}

module.exports = User;