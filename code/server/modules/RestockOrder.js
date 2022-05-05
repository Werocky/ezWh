'use strict'

class RestockOrder {

    constructor(issueDate, state = 'ISSUED', products, supplierId, transportNote=undefined, skuItems='[]', id=0) {
        this.issueDate = issueDate;
        this.state = state;
        this.products = products;
        this.supplierId = supplierId;
        this.transportNote = transportNote;
        this.skuItems = skuItems;
        this.id = id;
    }

}

module.exports = RestockOrder;