'use strict'

class Position {
  
  constructor(aisleID = "", row = "", col = "", maxWeight, maxVolume, occupiedWeight = 0, occupiedVolume = 0) {
    this.positionID = aisleID.concat(row, col);
    this.aisleID = aisleID;
    this.row = row;
    this.col = col;
    this.maxWeight = maxWeight;
    this.maxVolume = maxVolume;
    this.occupiedWeight = occupiedWeight;
    this.occupiedVolume= occupiedVolume;
  }

  getPositionID(){
    return this.positionID;
  }

  getAisleID(){
    return this.aisleID;
  }

  getRow(){
    return this.row;
  }

  getCol(){
    return this.col;
  }

  getMaxWeight(){
    return this.maxWeight;
  }

  getMaxVolume(){
    return this.maxVolume;
  }

  getOccupiedWeight(){
    return this.occupiedWeight;
  }

  getOccupiedVolume(){
    return this.occupiedVolume;
  }

  updateOccWeight(deltaW) {
    this.occupiedWeight += deltaW;
  }

  updateOccVol(deltaV) {
    this.occupiedVolume += deltaV;
  }

  fits(newW, newV) {
    return (newW <= this.maxWeight && newV <= this.maxVolume);
  }
}

module.exports = Position;

