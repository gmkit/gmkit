export class Roll {
  static d4() {
    return Roll.d(4);
  }
  static d6() {
    return Roll.d(6);
  }

  static d8() {
    return Roll.d(8);
  }
  static d10() {
    return Roll.d(10);
  }
  static d12() {
    return Roll.d(12);
  }
  static d20() {
    return Roll.d(20);
  }
  static d(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }
}
