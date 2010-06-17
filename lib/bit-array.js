
/**
 * Credits to:
 * http://bits.stephan-brumme.com/
 */

var BitArray = exports.BitArray = function () {
	this.values = [];
};

/**
 * Returns the total number of bits in this BitArray.
 */
BitArray.prototype.size = function () {
	return this.values.length * 32;
};

BitArray.prototype.set = function (index, value) {
	var i = Math.floor(index / 32);
	// Since "undefined | 1 << index" is equivalent to "0 | 1 << index" we do not need to initialise the
	// array explicitly here.
	if (value) {
		this.values[i] |= 1 << index - i * 32;
	} else {
		this.values[i] &= ~(1 << index - i * 32);
	}
	return this;
};

BitArray.prototype.toggle = function (index) {
	var i = Math.floor(index / 32);
	this.values[i] ^= 1 << index - i * 32;
	return this;
};

BitArray.prototype.get = function (index) {
	var i = Math.floor(index / 32);
	return !!(this.values[i] & (1 << index - i * 32));
};

/**
 * Resets the BitArray so that it is empty and can be re-used.
 */
BitArray.prototype.reset = function () {
	this.values = [];
	return this;
};

/**
 * Returns a copy of this BitArray.
 */
BitArray.prototype.copy = function () {
	var cp = new BitArray();
	cp.length = this.length;
	cp.values = [].concat(this.values);
	return cp;
};

/**
 * Returns true if this BitArray equals another.
 */
BitArray.prototype.equals = function (x) {
	return this.values.length === x.values.length &&
		this.values.every(function (value, index) {
		return value === x.values[index];
	});
};

BitArray.prototype.toJSON = function () {
	return JSON.stringify(this.values);
};

/**
 * Returns a string representation of the BitArray with bits
 * in logical order.
 */
BitArray.prototype.toString = function () {
	return this.toArray().map(function (value) {
		return value ? '1' : '0';
	}).join('');
};

BitArray.prototype.valueOf = function () {
	return this.values;
};

BitArray.prototype.toArray = function () {
	var result = [];
	this.forEach(function (value, index) {
		result.push(value);
	});
	return result;
};

/**
 * Returns the total number of bits set to one in this BitArray.
 */
BitArray.prototype.count = function () {
	var total = 0;

	// Not sure if the overhead of calling a method is a good idea here. Also, if
	// we remove the toggle method we could efficiently cache the number of bits
	// without calculating it on the fly.
	this.values.forEach(function (x) {
		// See: http://bits.stephan-brumme.com/countBits.html for an explanation
		x  = x - ((x >> 1) & 0x55555555);
		x  = (x & 0x33333333) + ((x >> 2) & 0x33333333);
		x  = x + (x >> 4);
		x &= 0xF0F0F0F;

		total += (x * 0x01010101) >> 24;
	});
	return total;
};

BitArray.prototype.forEach = function (fn, scope) {
	var i = 0, b = 0, index = 0,
		len = this.values.length,
		value, word;

	for (; i < len; i += 1) {
		word = this.values[i];
		for (b = 0; b < 32; b += 1) {
			value = (word & 1) !== 0;
			fn.call(scope, value, index, this);
			word = word >> 1;
			index += 1;
		}
	}
};

/*
members:
set(index) // sets the bit at index
clone() // returns a copy of the bit array
clear() // resets all bits to zero
equals(bitArray) // returns true if this bit array equals bitArray
get(index) // return the bit at index
toJSON() // returns a JSON representation of the bit array (canonical is an array of 32 bit integers)
toString // returns the bit representation of the bit array as a string.
toArray()

maybe:
indexOf()
lastIndexOf()
concat
reverse
invert
not() // invert the bit array
or() // 
and
xor
encode() // returns a RLE encoded bit representation
decode(v) // parses a RLE encoded bit representation

*/
