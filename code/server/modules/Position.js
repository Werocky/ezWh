'use strict'

class Position {
  
  constructor(p) {
    this.positionID = p.positionID;
    this.aisleID = p.aisleID;
    this.row = p.row;
    this.col = p.col;
    this.maxWeight = p.maxWeight;
    this.maxVolume = p.maxVolume;
    this.occupiedWeight = p.occupiedWeight;
    this.occupiedVolume= p.occupiedVolume;
  }

  updateOccWeight(deltaW) {
    this.occupiedWeight += deltaW;
  }

  updateOccVol(deltaV) {
    this.occupiedVolume += deltaV;
  }

  fits(newW, newV) {
    return (this.occupiedWeight + newW <= this.maxWeight && this.occupiedVolume + newV <= this.maxVolume);
  }
}

module.exports = Position;

