'use strict';

class Item{
    constructor(id,description,price,SKUId,supplierId){

        this.id = id;
        this.description = description;
        this.price = price;
        this.SKUId = SKUId;
        this.supplierId = supplierId;
    }

    getId(){
        return this.id;
    }

    getDescription(){
        return this.description;
    }

    getPrice(){
        return this.price;
    }

    getSKUId(){
        return this.SKUId;
    }

    getSupplierId(){
        return this.supplierId;
    }

}
module.exports = Item;