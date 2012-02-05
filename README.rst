==============================
 JavaScript Bit Array Library
==============================
This library contains a JavaScript implementation of bit arrays. The library supports:

* getting, setting and toggling of individual bits
* iterating over each bit
* counting the number of "on" bits
* bitwise operations with other bit arrays such as OR, AND and XOR.
* serialization to and from JSON
* Browser, Node.js and Ender.js compatible

The bit array also grows automatically depending on your usage and is sparse. The following example shows how to set and get individual bits within the array::

    a = new BitArray();
    a.set(0, true);
    a.set(31, true);
    a.toString(); // "10000000000000000000000000000001"
    a.get(1); // false
    a.get(31); // true

Note that the array internally uses 32 bit integers and thus grows by 32 bits if necessary (Actually, JavaScript's number type is 64 bit, but only 32 bits can be addressed using bitwise operations.)

::

    a.set(32, true);
    a.toString(); // "1000000000000000000000000000000110000000000000000000000000000000"

API
===
The BitArray module has two constructors:

BitArray()
    Creates a new empty bit array.
BitArray([integer, ...])
    Creates a new bit array using the array of integers as internal representation.

The following instance methods are supported:

size()
    Returns the total number of bits in the BitArray.
set(index, boolean)
    Sets the bit at index to a value (boolean.)
get(index)
    Returns the value of the bit at index (boolean.)
toggle(index)
    Toggles the bit at index. If the bit is on, it is turned off. Likewise, if the bit is off it is turned on.
reset()
    Resets the BitArray so that it is empty and can be re-used.
copy()
    Returns a copy of this BitArray.
equals(other)
    Returns true if this BitArray equals another. Two BitArrays are considered equal if both have the same length and bit pattern.
toJSON()
    Returns the JSON representation of this BitArray.
toString()
    Returns a string representation of the BitArray with bits in logical order.
valueOf()
    Returns the internal representation of the BitArray.
toArray()
    Convert the BitArray to an Array of boolean values.
count()
    Returns the total number of bits set to 1 in this BitArray.
forEach(fn, scope)
    Iterate over each value in the BitArray.
not()
    Inverts this BitArray.
or(other)
    Bitwise OR on the values of this BitArray using BitArray `other`.
and(other)
    Bitwise AND on the values of this BitArray using BitArray `other`.
xor(other)
    Bitwise XOR on the values of this BitArray using BitArray `other`.

Installation
============
You can install the bit array module using npm::

> npm install bit-array

Alternatively you could just include `bit-array.js <lib/bit-array.js>`_ in your project.

License
=======
Licensed under the revised BSD License. Copyright 2010 Bram Stein. All rights reserved.

Ports
=====
https://github.com/foglcz/bit-array - PHP port by Pavel Ptacek
