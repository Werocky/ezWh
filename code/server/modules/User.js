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
        var hashVal = 0;
        if (encryptedPassword.length == 0) return hashVal;
        for (i = 0; i < encryptedPassword.length; i++) {
            char = encryptedPassword.charCodeAt(i);
            hashVal = ((hashVal << 5) - hashVal) + char;
            hashVal = hashVal & hashVal;
        }

        return hashVal;
    }

    static encrypt(password) {
        let encryptedPassword = password;
        var hashVal = 0;
        if (encryptedPassword.length == 0) return hashVal;
        for (i = 0; i < encryptedPassword.length; i++) {
            char = encryptedPassword.charCodeAt(i);
            hashVal = ((hashVal << 5) - hashVal) + char;
            hashVal = hashVal & hashVal;
        }

        return hashVal;
    }
}

module.exports = User;