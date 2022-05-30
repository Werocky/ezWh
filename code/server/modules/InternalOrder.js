'use strict';

module.exports = class InternalOrder{
    constructor (id = 0, issueDate, state, products, customerId){
        this.id = id;
        this.issueDate = issueDate;
        this.state = state;
        this.products = products;
        this.customerId = customerId;
    }
}