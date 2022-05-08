'use strict'

class RestockOrder {

    constructor(issueDate, state = 'ISSUED', products, supplierId, transportNote=undefined, skuItems='[]', id=0) {
        this.id = id;
        this.issueDate = issueDate;
        this.state = state;
        this.products = JSON.parse(products);
        this.supplierId = supplierId;
        this.transportNote = transportNote ? JSON.parse(transportNote) : transportNote;
        this.skuItems = JSON.parse(skuItems);
    }

}

module.exports = RestockOrder;