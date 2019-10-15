'use strict';

const BitArray = require('../lib/bit-typed-array.js');
const expect = require('expect.js');

describe('BitArray', function () {
  it('should create an empty bit array', function () {
    expect(new BitArray(0).toString().length).to.eql(0);
    expect(new BitArray(0).size()).to.eql(0);
  });

  it('should parse hex given to the constructor', function () {
    const b = new BitArray(32, 'deadbeef');

    expect(b.toBinaryString()).to.eql('11011110101011011011111011101111');
    expect(b.toHexString()).to.eql('deadbeef');

    const c = new BitArray(64, '0000c0ffeec0ffee').and(
      new BitArray(64, 'ffffffffff000000')
    );

    expect(c.toHexString()).to.eql('0000c0ffee000000');
  });

  it('should correctly pad hex given in the constructor', function () {
    const b = new BitArray(32, 'f');

    expect(b.toHexString()).to.eql('0000000f');
    expect(b.toBinaryString()).to.eql('00000000000000000000000000001111');
  });

  it('should correctly convert a bit array to hex', function () {
    const b = new BitArray(32);

    b.set(5, true);
    b.set(6, true);

    expect(b.toHexString()).to.eql('00000060');
    expect(b.toBinaryString()).to.eql('00000000000000000000000001100000');

    const c = new BitArray(32, b.toHexString());

    expect(c.toHexString()).to.eql('00000060');
    expect(c.toBinaryString()).to.eql('00000000000000000000000001100000');
  });

  it('should set individual bits', function () {
    const b = new BitArray(32);

    b.set(31, true); // 0 | 1 << 30
    expect(b.size()).to.eql(32);
    expect(b.toString()).to.eql('00000000000000000000000000000001');

    b.set(0, true); // 0 | 1 << 31 | 1 << 0
    expect(b.size()).to.eql(32);
    expect(b.toString()).to.eql('10000000000000000000000000000001');

    b.set(15, true); // 0 | 1 << 31 | 1 << 0 | 1 << 15
    expect(b.size()).to.eql(32);
    expect(b.toString(), '10000000000000010000000000000001');

    // Reset bit 15 to false
    b.set(15, false); // 0 | 1 << 31 | 1 << 0
    expect(b.size()).to.eql(32);
    expect(b.toString()).to.eql('10000000000000000000000000000001');

    // Reset bit 0 to false
    b.set(0, false); // 0 | 1 << 31
    expect(b.size()).to.eql(32);
    expect(b.toString()).to.eql('00000000000000000000000000000001');

    // Reset bit 31 to false
    b.set(31, false); // 0
    expect(b.size()).to.eql(32);
    expect(b.toString()).to.eql('00000000000000000000000000000000');
  });

  it('should be able to set bits beyond a single integer', function () {
    const b = new BitArray(64);

    b.set(32, true);

    expect(b.size()).to.eql(64);
    expect(b.toString()).to.eql(
      '0000000000000000000000000000000010000000000000000000000000000000'
    );
  });

  it('should get individual bits', function () {
    const b = new BitArray(32);
    b.set(0, true);
    b.set(4, true);
    b.set(31, true);

    expect(b.get(0)).to.be(true);
    expect(b.get(4)).to.be(true);
    expect(b.get(31)).to.be(true);
  });

  it('should be able to get bits beyond a single integer', function () {
    var b = new BitArray(64);
    b.set(32, true);

    expect(b.size()).to.eql(64);
    expect(b.get(32)).to.be(true);
  });

  it('should toggle individual bits', function () {
    const b = new BitArray(32);
    b.set(0, true);
    b.set(31, true);

    expect(b.toggle(0).get(0)).to.be(false);
    expect(b.toggle(4).get(4)).to.be(true);
    expect(b.toggle(31).get(31)).to.be(false);
  });

  it('should toggle individual bits beyond a single integer', function () {
    const b = new BitArray(64);
    b.set(32, true);

    expect(b.size()).to.eql(64);
    expect(b.toggle(32).get(32)).to.be(false);
    expect(b.toggle(33).get(33)).to.be(true);
  });

  it('should report the correct size', function () {
    const b = new BitArray(224);
    b.set(200, true); // Math.floor(200 / 32) + 1 * 32;
    expect(b.size()).to.eql(224);
  });

  it('should count the individual on bits', function () {
    const b = new BitArray(72);

    b.set(32, true);
    b.set(70, true);
    b.set(1, true);
    b.set(12, true);

    expect(b.count()).to.eql(4);
  });

  it('should be able to compare bit arrays', function () {
    const a = new BitArray(224);
    const b = new BitArray(224);
    const c = new BitArray(224);
    const d = new BitArray(224);

    a.set(0, true);
    a.set(1, true);
    a.set(200, true);
    a.set(36, true);

    b.set(0, true);
    b.set(1, true);
    b.set(200, true);
    b.set(36, true);

    c.set(0, true);
    c.set(1, true);
    c.set(200, true);

    d.set(0, true);
    d.set(1, true);
    d.set(36, true);

    expect(a.equals(b)).to.be(true);
    expect(a.equals(c)).to.be(false);
    expect(a.equals(d)).to.be(false);
  });

  it('should copy a bit array', function () {
    const a = new BitArray(224);
    let b;

    a.set(0, true);
    a.set(1, true);
    a.set(200, true);
    a.set(36, true);

    b = a.copy();
    expect(a.toString()).to.eql(b.toString());
  });

  it('should negate bit arrays', function () {
    const b = new BitArray(64);
    let a;

    b.set(2, true);
    b.set(7, true);
    b.set(18, true);
    b.set(26, true);
    b.set(30, true);

    a = b.toString();
    a = a.replace(/0/g, 'x');
    a = a.replace(/1/g, '0');
    a = a.replace(/x/g, '1');
    b.not();

    expect(b.toString()).to.eql(a);
  });

  it('should or bit arrays', function () {
    const a = new BitArray(32);
    const b = new BitArray(32);

    a.set(0, true); //1110
    a.set(1, false);
    a.set(2, true);
    a.set(3, false);

    b.set(0, true);
    b.set(1, true);
    b.set(2, false);
    b.set(3, false);

    expect(a.or(b).toString()).to.eql('11100000000000000000000000000000');
  });

  it('should and bit arrays', function () {
    const a = new BitArray(32);
    const b = new BitArray(32);

    a.set(0, true);
    a.set(1, false);
    a.set(2, true);
    a.set(3, false);

    b.set(0, true);
    b.set(1, true);
    b.set(2, false);
    b.set(3, false);

    expect(a.and(b).toString()).to.eql('10000000000000000000000000000000');
  });

  it('should xor bit arrays', function () {
    const a = new BitArray(32);
    const b = new BitArray(32);

    a.set(0, true);
    a.set(1, false);
    a.set(2, true);
    a.set(3, false);

    b.set(0, true);
    b.set(1, true);
    b.set(2, false);
    b.set(3, false);

    expect(a.xor(b).toString()).to.eql('01100000000000000000000000000000');
  });
});
