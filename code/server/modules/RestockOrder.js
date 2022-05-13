'use strict'

class RestockOrder {

    constructor(issueDate, state = 'ISSUED', products, supplierId, transportNote=undefined, skuItems='[]', id=0) {
        this.id = id;
        this.issueDate = issueDate;
        this.state = state;
        this.products = products;
        this.supplierId = supplierId;
        this.transportNote = transportNote ? JSON.parse(transportNote) : transportNote;
        this.skuItems = skuItems;
    }

}

module.exports = RestockOrder;