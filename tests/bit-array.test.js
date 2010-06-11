var assert = require('assert'),
	bitArray = new (require('../lib/bit-array.js'))();

exports.testConstructor = function () {
	assert.ok(bitArray, 'Yup');
}

if (module === require.main) {
	require('test').run(exports);
}
