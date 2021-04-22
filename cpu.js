/*
 * Gameboy CPU Emulator
 * © 2020 Michael Hamilton
 */

class CPU {
  constructor(memory) {
    this.registers = {
      a: 0x00,
      b: 0x00,
      c: 0x00,
      d: 0x00,
      e: 0x00,
      h: 0x00,
      l: 0x00,
      pc: 0x0000
    };

    this.isReset = false;

    // Used for cycle accuracy
    this.t = 0; // time cycles
    this.m = 0; // machine cycles

    this.memory = memory;
  }

  reset() {
    this.registers.a = 0x00;
    this.registers.b = 0x00;
    this.registers.c = 0x00;
    this.registers.d = 0x00;
    this.registers.e = 0x00;
    this.registers.h = 0x00;
    this.registers.l = 0x00
    this.registers.pc = 0x0000;
    this.t = 0;
    this.m = 0;
  }

  getRegisterState() {
    return this.registers;
  }

  readMemory(address) {
    return this.memory.readByte(address);
  }

  handleClockStep() {
    if (this.m === 0) {
      const opcode = this.readMemory(this.registers.pc);
      this.executeOpcode(opcode);
      this.registers.pc = this.registers.pc + 0x01
    }

    if (this.t < this.m -1) {
      this.t = this.t + 1;
    }
    else {
      this.t = 0
      this.m = 0;
    }
  }

  getT() {
    return this.t;
  }

  getM() {
    return this.m;
  }

  getPC() {
    return this.registers.pc;
  }

  executeOpcode(opcode){
    // r is easier to type over and over
    const r = this.registers;

    switch(opcode) {

      // ld b,*
      case 0x06:
        this.m = 7;
        r.b = this.readMemory(r.pc);
        r.pc = r.pc + 0x02;
        break;

      // ld a(bc)
      case 0x0a:
        this.m = 7;
        r.a = this.readMemory(r.b<<8 | r.c);
        break;

      // ld c,*
      case 0x0e:
        this.m = 7;
        r.c = this.readMemory(r.pc);
        r.pc = r.pc + 0x02;
        break;

      // ld b,b
      case 0x40:
        r.b = r.b;
        break;

      // ld b,c
      case 0x41:
        r.b = r.c;
        break;

      // ld b,d
      case 0x42:
        r.b = r.d;
        break;

      // ld b,e
      case 0x43:
        r.b = r.e;
        break;

      // ld b,h
      case 0x44:
        r.b = r.h;
        break;

      // ld b,l
      case 0x45:
        r.b = r.l;
        break;

      // ld b,(hl)
      case 0x46:
        r.b = this.readMemory(r.h<<8 | r.l);
        break;

      // ld b,a
      case 0x47:
        r.b = r.a;
        break;

      // ld c,b
      case 0x48:
        r.c = r.b;
        break;

      // ld c,c
      case 0x49:
        r.c = r.c;
        break;

      // ld c,d
      case 0x4a:
        r.c = r.d;
        break;

      // ld c,e
      case 0x4b:
        r.c = r.e;
        break;

      // ld c,h
      case 0x4c:
        r.c = r.h;
        break;

      // ld c,l
      case 0x4d:
        r.c = r.l;
        break;

      // ld c,(hl)
      case 0x4e:
        r.c = this.readMemory(r.h<<8 | r.l);
        break;

      // ld c,a
      case 0x4f:
        r.c = r.a;
        break;

      // ld d,b
      case 0x50:
        r.d = r.b;
        break;

      // ld d,c
      case 0x51:
        r.d = r.c;
        break;

      // ld d,d
      case 0x52:
        r.d = r.d;
        break;

      // ld d,e
      case 0x53:
        r.d = r.e;
        break;

      // ld d,h
      case 0x54:
        r.d = r.h;
        break;

      // ld d,l
      case 0x55:
        r.d = r.l;
        break;

      // ld d,(hl)
      case 0x56:
        r.d = this.readMemory(r.h<<8 | r.l);
        break;

      // ld d,a
      case 0x57:
        r.d = r.a;
        break;

      // ld e,b
      case 0x58:
        r.e = r.b;
        break;

      // ld e,c
      case 0x59:
        r.e = r.c;
        break;

      // ld e,d
      case 0x5a:
        r.e = r.d;
        break;

      // ld e,e
      case 0x5b:
        r.e = r.e;
        break;

      // ld e,h
      case 0x5c:
        r.e = r.h;
        break;

      // ld e,l
      case 0x5d:
        r.e = r.l;
        break;

      // ld e,(hl)
      case 0x5e:
        r.e = this.readMemory(r.h<<8 | r.l);
        break;

      // ld e,a
      case 0x5f:
        r.e = r.a;
        break;

      // ld h,b
      case 0x60:
        r.h = r.b;
        break;

      // ld h,c
      case 0x61:
        r.h = r.c;
        break;

      // ld h,d
      case 0x62:
        r.h = r.d;
        break;

      // ld h,e
      case 0x63:
        r.h = r.e;
        break;

      // ld h,h
      case 0x64:
        r.h = r.h;
        break;

      // ld h,l
      case 0x65:
        r.h = r.l;
        break;

      // ld h,(hl)
      case 0x66:
        r.h = this.readMemory(r.h<<8 | r.l);
        break;

      // ld h,a
      case 0x67:
        r.h = r.a;
        break;

      // ld l,b
      case 0x68:
        r.l = r.b;
        break;

      // ld l,c
      case 0x69:
        r.l = r.c;
        break;

      // ld l,d
      case 0x6a:
        r.l = r.d;
        break;

      // ld l,e
      case 0x6b:
        r.l = r.e;
        break;

      // ld l,h
      case 0x6c:
        r.l = r.h;
        break;

      // ld l,l
      case 0x6d:
        r.l = r.l;
        break;

      // ld l,(hl)
      case 0x6e:
        r.l = this.readMemory(r.h<<8 | r.l);
        break;

      // ld l,a
      case 0x6f:
        r.l = r.a;
        break;

      // ld a,b
      case 0x78:
        r.a = r.b;
        break;

      // ld a,c
      case 0x79:
        r.a = r.c;
        break;

      // ld a,d
      case 0x7a:
        r.a = r.d;
        break;

      // ld a,e
      case 0x7b:
        r.a = r.e;
        break;

      // ld a,h
      case 0x7c:
        r.a = r.h;
        break;

      // ld a,l
      case 0x7d:
        r.a = r.l;
        break;

      // ld a,(hl)
      case 0x7e:
        r.a = this.readMemory(r.h<<8 | r.l);
        break;

      // ld a,a
      case 0x7f:
        r.a = r.a;
        break;

      // add a,b
      case 0x80:
        r.a = r.a + r.b;
        break;

      // add a,c
      case 0x81:
        r.a = r.a + r.c;
        break;

      // add a,d
      case 0x82:
        r.a = r.a + r.d;
        break;

      // add a,e
      case 0x83:
        r.a = r.a + r.e;
        break;

      // add a,h
      case 0x84:
        r.a = r.a + r.h;
        break;

      // add a,l
      case 0x85:
        r.a = r.a + r.l;
        break;

      // add a,(hl)
      case 0x86:
        r.a = r.a + this.readMemory(r.h<<8 | r.l);
        break;

      // add a,a
      case 0x87:
        r.a = r.a + r.a;
        break;

      // nop
      default:
        break;
    }
  }
}

export default CPU;
