# JavaScript Bit Array Library

## Bit-Array is deprecated. Please use <a href="https://github.com/infusion/BitSet.js" style="color: yellow;">BitSet.js</a>

This library contains a JavaScript implementation of bit arrays. The library supports:

* getting, setting and toggling of individual bits
* iterating over each bit
* counting the number of "on" bits
* bitwise operations with other bit arrays such as OR, AND and XOR.
* serialization to and from JSON
* Browser, Node.js and Ender.js compatible

The bit array is sparse. The following example shows how to set and get individual bits within the array:

    a = new BitArray(32);
    a.set(0, true);
    a.set(31, true);
    a.toString(); // "10000000000000000000000000000001"
    a.get(1); // false
    a.get(31); // true

Note that the array internally uses 32 bit integers (actually, JavaScript's number type is 64 bit, but only 32 bits can be addressed using bitwise operations,) so going beyond the given length throws an error:

    a.set(32, true); // throws an index of range exception

Even though bit arrays are not that useful in JavaScript, there is one place where they excel; encoding large boolean sets for transfer between the browser and server. A JSON representation of a bit array is much smaller than an actual boolean array.

## API

The BitArray module has two constructors:

<dl>
    <dt>BitArray(size)</dt>
    <dd>Creates a new empty bit array with the given size in bits.</dd>

    <dt>BitArray(size, hex)</dt>
    <dd>Creates a new bit array with the given size and using the hex string as value</dd>
</dl>

The following instance methods are supported:

<dl>
    <dt>size()</dt>
    <dd>Returns the total number of bits in the BitArray.</dd>

    <dt>set(index, boolean)</dt>
    <dd>Sets the bit at index to a value (boolean.)</dd>

    <dt>get(index)</dt>
    <dd>Returns the value of the bit at index (boolean.)</dd>

    <dt>toggle(index)</dt>
    <dd>Toggles the bit at index. If the bit is on, it is turned off. Likewise, if the bit is off it is turned on.</dd>

    <dt>reset()</dt>
    <dd>Resets the BitArray so that it is empty and can be re-used.</dd>

    <dt>copy()</dt>
    <dd>Returns a copy of this BitArray.</dd>

    <dt>equals(other)</dt>
    <dd>Returns true if this BitArray equals another. Two BitArrays are considered equal if both have the same length and bit pattern.</dd>

    <dt>toJSON()</dt>
    <dd>Returns the JSON representation of this BitArray.</dd>

    <dt>toString()</dt>
    <dd>Returns a string representation of the BitArray with bits in logical order.</dd>

    <dt>toHexString()</dt>
    <dd>Returns a hex representation of the BitArray.</dd>

    <dt>toArray()</dt>
    <dd>Convert the BitArray to an Array of boolean values.</dd>

    <dt>count()</dt>
    <dd>Returns the total number of bits set to 1 in this BitArray.</dd>

    <dt>not()</dt>
    <dd>Inverts this BitArray.</dd>

    <dt>or(other)</dt>
    <dd>Bitwise OR on the values of this BitArray using BitArray `other`.</dd>

    <dt>and(other)</dt>
    <dd>Bitwise AND on the values of this BitArray using BitArray `other`.</dd>

    <dt>xor(other)</dt>
    <dd>Bitwise XOR on the values of this BitArray using BitArray `other`.</dd>
</dl>

## Installation

You can install the bit array module using npm:

    > npm install bit-array

Alternatively you could just include [bit-array.js](lib/bit-array.js) in your project.

## License

Licensed under the revised BSD License. Copyright 2010-2012 Bram Stein. All rights reserved.

Ports
-----
https://github.com/foglcz/bit-array - PHP port by Pavel Ptacek
