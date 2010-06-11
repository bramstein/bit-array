var BitArray = exports.BitArray = function () {
	this.length = 0;
	this.values = [];
};

BitArray.prototype.set = function (index, value) {
};

BitArray.prototype.get = function (index) {
	return false;
};

BitArray.prototype.clear = function () {
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
	return '';
};

BitArray.prototype.toString = function () {
	// TODO: this should probably receive some padding. Not sure how useful a binary
	// string representation is except for debugging.
	return this.values.reduce(function (previous, current) {
		return previous + current.toString(2);
	}, '');
};

BitArray.prototype.valueOf = function () {
	return this.values;
};

exports.decodeJSON = function () {
	return new BitArray();
};
