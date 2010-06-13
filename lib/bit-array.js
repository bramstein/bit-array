var BitArray = exports.BitArray = function () {
	this.values = [];
};

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

BitArray.prototype.get = function (index) {
	var i = Math.floor(index / 32);
	return !!(this.values[i] & (1 << index - i * 32));
};

BitArray.prototype.clear = function (size, initialValue) {
	// TODO: should this maintain the size of the bit array?
	this.values = [];
	return this;
};

BitArray.prototype.copy = function () {
	var cp = new BitArray();
	cp.length = this.length;
	cp.values = [].concat(this.values);
	return cp;
};

BitArray.prototype.equals = function (x) {
	return false;
};

BitArray.prototype.toJSON = function () {
	return JSON.stringify(this.values);
};

BitArray.prototype.toString = function () {
	var len = this.values.length,
		i = 0, result = [], j = 0;

	for (; i < len; i += 1) {
		for (j = 0; j < 32; j += 1) {
			result.push(this.get(i * 32 + j) ? '1' : '0');
		}
	}
	return result.join('');
};

BitArray.prototype.valueOf = function () {
	return this.values;
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
not() // invert the bit array
or() // 
and
xor
encode() // returns a RLE encoded bit representation
decode(v) // parses a RLE encoded bit representation

*/
