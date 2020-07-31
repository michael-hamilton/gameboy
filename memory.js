/*
 * Generic Virtual Memory
 * © 2020 Michael Hamilton
 */

class Memory {
  constructor(size) {
    this.memory = [];
    this.initMemory(size);
  }

  initMemory(size) {
    for(let address = 0; address < size; address++) {
      this.memory.push(0x00);
    }
  }

  readByte(address) {
    return this.memory[address];
  }

  writeByte(address, data) {
    this.memory[address] = data;
  }

  getMemorySize() {
    return this.memory.length;
  }

  bulkWrite(data) {
    for(let address = 0; address < data.length; address++) {
      this.memory[address] = data[address];
    }
  }
}

export default Memory;
