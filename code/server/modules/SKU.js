'use strict';

class SKU{

    constructor(description, weight, volume, notes, availableQuantity, price, testDescriptors = [], positionId="", id=0){
        this.id = id;
        this.description = description;
        this.weight = weight;
        this.volume = volume;
        this.notes = notes;
        this.positionId = positionId;
        this.availableQuantity = availableQuantity;
        this.price = price;
        this.testDescriptors = testDescriptors;
    }

    getPositionId(){
        return this.positionId;
    }

    setPositionId(positionId){
        this.positionId = positionId;
    }

    getId(){
        return this.id;
    }

    setId(id){
        this.id = id;
    }

    getDescription(){
        return this.description;
    }

    setDescription(description){
        this.description = description;
    }

    getWeight(){
        return this.weight;
    }

    setWeight(weight){
        this.weight = weight;
    }

    getVolume(){
        return this.volume;
    }

    setVolume(volume){
        this.volume = volume;
    }

    getNotes(){
        return this.notes;
    }
    
    setNotes(){
        this.notes = notes;
    }

    getAvailableQuantity(){
        return this.availableQuantity;
    }

    setAvailableQuantity(availableQuantity){
        this.availableQuantity = availableQuantity;
    }

    getPrice(){
        return this.price;
    }

    setPrice(price){
        this.price = price;
    }

    getTestDescriptors(){
        return this.testDescriptors;
    }

    setTestDescriptors(testDescriptors){
        this.testDescriptors = [...testDescriptors];
    }

    getTotalWeight(){
        return (this.availableQuantity * this.weight);
    }

    getTotalVolume(){
        return (this.availableQuantity * this.volume);
    }
}

module.exports = SKU;

