var assert = require('assert'),
	BitArray = require('../lib/bit-array.js');

exports.testConstructor = function () {
	assert.equal((new BitArray()).toString().length, 0, 'Empty bit array: toString()');
	assert.equal((new BitArray()).size(), 0, 'Empty bit array: size().');
};

exports.testValueConstructor = function () {
	var b = new BitArray([1610614016, 90112]);

//	b.set(10, true);
//	b.set(29, true);
//	b.set(30, true);
//	b.set(8, true);
//	b.set(45, true);
//	b.set(46, true);
//	b.set(48, true);

	assert.equal(b.toString(), '0000000010100000000000000000011000000000000001101000000000000000', 'BitArray([..])');
	
	var c = new BitArray([0xffffeeee, 0xddddcccc]);
	
	assert.equal(c.toHexString(), 'ffffeeeeddddcccc');
};

exports.testHexConstructor = function () {
  var binaryDeadBeef = '11011110101011011011111011101111';
	var b = new BitArray('deadbeef');

  // Note that the "logical order" returned by the BitArray type is reversed
  // from the "mathematical order" used to convert between representations.
	assert.equal(b.toString().split('').reverse().join(''), binaryDeadBeef, 'BitArray(0x...)');
	assert.equal(b.toBinaryString(), binaryDeadBeef, 'BitArray(0x...)');
	assert.equal(b.toHexString(), 'deadbeef', 'BitArray(0x...)');
	
	// Test zero-padding
	var c = new BitArray('c0ffeec0ffee').and(new BitArray('ffffffffff000000'));
	
	assert.equal(c.toHexString(), '0000c0ffee000000', 'BitArray(0x...)');
};

exports.testSimpleSet = function () {
	var b = new BitArray();

	b.set(31, true); // 0 | 1 << 30
	assert.equal(b.size(), 32, 'set(31, true).size()');
	assert.equal(b.toString(), '00000000000000000000000000000001', 'set(31, true).toString()');

	b.set(0, true); // 0 | 1 << 31 | 1 << 0
	assert.equal(b.size(), 32, 'set(31, true).set(0, true).size()');
	assert.equal(b.toString(), '10000000000000000000000000000001', 'set(31, true).set(0, true).toString()');

	b.set(15, true); // 0 | 1 << 31 | 1 << 0 | 1 << 15
	assert.equal(b.size(), 32, 'set(31, true).set(0, true).set(15, true).size()');
	assert.equal(b.toString(), '10000000000000010000000000000001', 'set(31, true).set(0, true).set(15, true).toString()');

	// Reset bit 15 to false
	b.set(15, false); // 0 | 1 << 31 | 1 << 0
	assert.equal(b.size(), 32, 'set(31, true).set(0, true).size()');
	assert.equal(b.toString(), '10000000000000000000000000000001', 'set(31, true).set(0, true).toString()');

	// Reset bit 0 to false
	b.set(0, false) // 0 | 1 << 31
	assert.equal(b.size(), 32, 'set(31, true).size()');
	assert.equal(b.toString(), '00000000000000000000000000000001', 'set(31, true).toString()');

	// Reset bit 31 to false
	b.set(31, false) // 0
	assert.equal(b.size(), 32, 'size()');
	assert.equal(b.toString(), '00000000000000000000000000000000', 'toString()');
};

exports.testArraySet = function () {
	var b = new BitArray();

	b.set(32, true);
	
	assert.equal(b.size(), 64, 'set(32, true).size()');
	assert.equal(b.toString(), '0000000000000000000000000000000010000000000000000000000000000000', 'set(32, true).toString()');
};

exports.testSimpleGet = function () {
	var b = new BitArray();
	b.set(0, true);
	b.set(4, true);
	b.set(31, true);

	assert.equal(b.get(0), true, 'set(0, true).get(0)');
	assert.equal(b.get(4), true, 'set(4, true).get(4)');
	assert.equal(b.get(31), true, 'set(31, true).get(31)');
};

exports.testArrayGet = function () {
	var b = new BitArray();
	b.set(32, true);

	assert.equal(b.size(), 64, 'set(32, true).size()');
	assert.equal(b.get(32), true, 'set(32, true).get(32)');
};

exports.testSimpleToggle = function () {
	var b = new BitArray();
	b.set(0, true);
	b.set(31, true);

	assert.equal(b.toggle(0).get(0), false, 'set(0, true).toggle(0).get(0)');
	assert.equal(b.toggle(4).get(4), true, 'toggle(4).get(4)');
	assert.equal(b.toggle(31).get(31), false, 'set(31, true).toggle(31).get(31)');
};

exports.testArrayToggle = function () {
	var b = new BitArray();
	b.set(32, true);

	assert.equal(b.size(), 64, 'set(32, true).size()');
	assert.equal(b.toggle(32).get(32), false, 'set(32, true).toggle(32).get(32)');
	assert.equal(b.toggle(33).get(33), true, 'toggle(33).get(33)');
};

exports.testSize = function () {
	var b = new BitArray();
	b.set(200, true); // Math.floor(200 / 32) + 1 * 32;
	assert.equal(b.size(), 224, 'size()');
};

exports.testBitCount = function () {
	var b = new BitArray();

	b.set(32, true);
	b.set(70, true);
	b.set(1, true);
	b.set(12, true);

	assert.equal(b.count(), 4, 'count()');
};

exports.testEquals = function () {
	var a = new BitArray(),
		b = new BitArray(),
		c = new BitArray(),
		d = new BitArray();

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

	assert.equal(a.equals(b), true, 'equals(true)');
	assert.equal(a.equals(c), false, 'equals(false)');
	assert.equal(a.equals(d), false, 'equals(length)');
};

exports.testCopy = function () {
	var a = new BitArray(),
		b;

	a.set(0, true);
	a.set(1, true);
	a.set(200, true);
	a.set(36, true);

	b = a.copy();
	assert.equal(a.toString(), b.toString(), 'copy()');
};

exports.testNot = function () {
	var b = new BitArray(),
		a;

	b.set(2, true);
	b.set(7, true);
	b.set(18, true);
	b.set(26, true);
	b.set(30, true);

	a = b.toString();
	a = a.replace(/0/g, 'x');
	a =	a.replace(/1/g, '0');
	a = a.replace(/x/g, '1');
	b.not();

	assert.equal(b.toString(), a);
};

exports.testOr = function () {
	var a = new BitArray(),
		b = new BitArray();

	a.set(0, true);//1110
	a.set(1, false);
	a.set(2, true);
	a.set(3, false);

	b.set(0, true);
	b.set(1, true);
	b.set(2, false);
	b.set(3, false);

	assert.equal(a.or(b).toString(), '11100000000000000000000000000000', 'or()');
};

exports.testAnd = function () {
	var a = new BitArray(),
		b = new BitArray();

	a.set(0, true);
	a.set(1, false);
	a.set(2, true);
	a.set(3, false);

	b.set(0, true);
	b.set(1, true);
	b.set(2, false);
	b.set(3, false);

	assert.equal(a.and(b).toString(), '10000000000000000000000000000000', 'and()');
};

exports.testXor = function () {
	var a = new BitArray(),
		b = new BitArray();

	a.set(0, true);
	a.set(1, false);
	a.set(2, true);
	a.set(3, false);

	b.set(0, true);
	b.set(1, true);
	b.set(2, false);
	b.set(3, false);

	assert.equal(a.xor(b).toString(), '01100000000000000000000000000000', 'xor()');
};

if (module === require.main) {
	require('test').run(exports);
}
