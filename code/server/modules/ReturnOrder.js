'use strict'

class ReturnOrder {

    constructor(returnDate, products, restockOrderId, id=0) {
        this.id = id;
        this.returnDate = returnDate;
        this.products = JSON.parse(products);
        this.restockOrderId = restockOrderId;
    }

}

module.exports = ReturnOrder;