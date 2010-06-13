var assert = require('assert'),
	bitArray = require('../lib/bit-array.js');

exports.testConstructor = function () {
	assert.equal(new bitArray.BitArray().toString().length, 0, 'Empty bit array: toString()');
	assert.equal(new bitArray.BitArray().size(), 0, 'Empty bit array: size().');
};

exports.testSimpleSet = function () {
	var b = new bitArray.BitArray();

	b.set(31, true); // 0 | 1 << 30
	assert.equal(b.size(), 32, 'set(31, true).size()');
	assert.equal(b.toString(), '00000000000000000000000000000001', 'set(31, true).toString()');

	b.set(0, true); // 0 | 1 << 30 | 1 << 0
	assert.equal(b.size(), 32, 'set(30, true).set(0, true).size()');
	assert.equal(b.toString(), '10000000000000000000000000000001', 'set(30, true).set(0, true).toString()');

	b.set(15, true); // 0 | 1 << 30 | 1 << 0 | 1 << 15
	assert.equal(b.size(), 32, 'set(30, true).set(0, true).set(15, true).size()');
	assert.equal(b.toString(), '10000000000000010000000000000001', 'set(30, true).set(0, true).set(15, true).toString()');

	// Reset bit 15 to false
	b.set(15, false); // 0 | 1 << 30 | 1 << 0
	assert.equal(b.size(), 32, 'set(30, true).set(0, true).size()');
	assert.equal(b.toString(), '10000000000000000000000000000001', 'set(30, true).set(0, true).toString()');

	// Reset bit 0 to false
	b.set(0, false) // 0 | 1 << 30
	assert.equal(b.size(), 32, 'set(30, true).size()');
	assert.equal(b.toString(), '00000000000000000000000000000001', 'set(30, true).toString()');

	// Reset bit 31 to false
	b.set(31, false) // 0
	assert.equal(b.size(), 32, 'size()');
	assert.equal(b.toString(), '00000000000000000000000000000000', 'toString()');
};

exports.testArraySet = function () {
	var b = new bitArray.BitArray();

	b.set(32, true);
	
	assert.equal(b.size(), 64, 'set(31, true).size()');
	assert.equal(b.toString(), '0000000000000000000000000000000010000000000000000000000000000000', 'set(31, true).toString()');
};

if (module === require.main) {
	require('test').run(exports);
}
