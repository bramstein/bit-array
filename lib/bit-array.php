<?php
/**
 * Re-implementation of the bitarray.js into PHP equivalent
 * 
 * This implementation is based on bitarray.js created by Bram Stein
 * 
 * Bitarray.js copyright 2010 by Bram Stein
 * Bitarray.php class (c) 2011 by Pavel Ptacek (@foglcz;
 *      ptacek at animalgroup dot cz)
 * 
 * Licensed under the revised BSD License.
 * 
 * compatibility with bitarray.js v0.1.1
 * Methods from bitarray.js which has not been implemented:
 *   -> this.equals() -> achieved by $bitarr1 == $bitarr2
 *   -> this.toString() -> implemented __tostring() magic method instead
 *   -> this.forEach(fn, scope) -> implemented iterators instead
 *          -> use foreach($BitArray as $index => $bit)
 * 
 * This class implements iterator for the foreach loop.
 * This class implements Array acces -> hence $BitArray[$index] = true;
 * When serialized & unserialized the json serialization method is used.
 * 
 * Array Access notes:
 *  -> when you call unset($BitArray[$index]), it is the *same* as calling
 *      $BitArray[$index] = false (the class does NOT delete the bit from array)
 * 
 *  -> when you call isset($BitArray[$index]), it is the *same* as calling
 *      if($BitArray[$index] == true)
 * 
 *  -> When you set anything else then bool(false) using $BitArray[$index], it
 *     is treated as bool(true). Hence, all of the following does the same
 *          $BitArray[$index] = true;
 *          $BitArray[$index] = 1;
 *          $BitArray[$index] = 15683;
 *          $BitArray[$index] = "true";
 *          $BitArray[$index] = "this is some other string, which sets true";
 *
 *     however:
 *      $BitArray[$index] = 0; (<- integer) will set the false flag on the bit
 *     
 *     This is because the setting into array works internally via $this->set()
 * 
 * Due to the keywords of php, following methods has been renamed:
 *   -> this.or  ==> $this->bitOr
 *   -> this.not ==> $this->bitNot
 *   -> this.and ==> $this->bitAnd
 *   -> this.xor ==> $this->bitXor
 */
class BitArray implements Iterator, ArrayAccess, Serializable {
    /**
     * Internally store position for iterator
     */
    private $_iteratorPosition;
    
    /**
     * Values of the bitarray
     */
    protected $_values;
    
    /**
     * Initialize the bitarray with values (optional)
     * 
     * @param array|null $values 
     */
    public function __construct(array $values = array()) {
        $this->_values = $values;
    }
    
    /**
     * Returns a string representation of the bit array with bits in logical order
     * 
     * @return string
     */
    public function __tostring() {
        $str = '';
        foreach($this as $value) {
            if($value) {
                $str .= '1';
            }
            else {
                $str .= '0';
            }
        }
        
        return $str;
    }
    
    /**
     * Internally checks validity of array to prevent notices
     * 
     * @param int $i 
     * @return void
     */
    private function _checkIndex($i) {
        if(!isset($this->_values[$i])) {
            $this->_values[$i] = 0;
        }
    }
    
    /**
     * Returns total number of bits in this BitArray
     * 
     * @return int
     */
    public function size() {
        return count($this->_values) * 32;
    }
    
    /**
     * Sets the bit at index to a value (boolean)
     * 
     * @param int index the bit index
     * @param bool value the value to be set
     * @return BitArray 
     */
    public function set($index, $value) {
        $i = floor($index / 32);
        $this->_checkIndex($i);
        
        if($value) {
            $this->_values[$i] |= 1 << $index - $i * 32;
        }
        else {
            $this->_values[$i] &= ~(1 << $index - $i * 32); 
        }
        
        return $this;
    }
    
    /**
     * Toggles the bit at index. If the bit is on, it is turned off. Likewise, if the bit is off, it is turned on.
     * 
     * @param int $index 
     * @return BitArray
     */
    public function toggle($index) {
        $i = floor($index / 32);
        $this->_checkIndex($i);
        $this->_values[$i] ^= 1 << $index - $i * 32;
        return $this;
    }
    
    /**
     * Returns the value of the bit at index (boolean)
     * 
     * @param int $index 
     * @return bool
     */
    public function get($index) {
        $i = floor($index / 32);
        $this->_checkIndex($i);
        return (bool)($this->_values[$i] & (1 << ($index - $i * 32)));
    }
    
    /**
     * Resets the bitarray to empty one
     * 
     * @return BitArray
     */
    public function reset() {
        $this->_values = array();
        return $this;
    }
    
    /**
     * Returns a copy of this bit array
     * 
     * @return BitArray
     */
    public function &copy() {
        $copy = clone $this;
        return $copy;
    }
    
    /**
     * Returns JSON representation of this class
     * 
     * @return string
     */
    public function toJSON() {
        return json_encode($this->_values);
    }
    
    /**
     * Load the data into this bitarray from JSON
     * 
     * @return BitArray
     */
    public function fromJSON($jsonData) {
        $this->reset();
        $this->_values = json_decode($jsonData);
        return $this;
    }
    
    /**
     * Returns internal representation of the bit array
     * 
     * @return array
     */
    public function valueOf() {
        return $this->_values;
    }
    
    /**
     * Returns the array of false/true flags for each bit
     * 
     * @return array
     */
    public function toArray() {
        $return = array();
        foreach($this as $value) {
            $return[] = $value;
        }
        return $return;
    }
    
    /**
     * Return the total number of bits set to true in this BitArray
     * 
     * @return int
     */
    public function count() {
        $total = 0;
        
        foreach($this as $x) {
            // See: http://bits.stephan-brumme.com/countBits.html for an explanation
            $x  = $x - (($x >> 1) & 0x55555555);
            $x  = ($x & 0x33333333) + (($x >> 2) & 0x33333333);
            $x  = $x + ($x >> 4);
            $x &= 0xF0F0F0F;

            $total += (x * 0x01010101) >> 24;            
        }
        
        return $total;
    }
    
    /**
     * Inverts this bitarray
     * 
     * @return BitArray
     */
    public function bitNot() {
        foreach($this as $index => $value) {
            $this[$index] = ~$value;
        }
        
        return $this;
    }
    
    /**
     * Bitwise OR on the values of this BitArray using BitArray $x
     * 
     * @param BitArray $x
     * @return BitArray
     */
    public function bitOr(BitArray $x) {
        if($this->size() != $x->size()) {
            throw new Exception('Arguments must be of the same length');
        }
        
        foreach($this as $key => $value) {
            $this[$key] = $value | $x[$key];
        }
        
        return $this;
    }
    
    /**
     * Bitwise AND on the values of this BitArray using BitArray $x
     * 
     * @param BitArray $x
     * @return BitArray
     */
    public function bitAnd(BitArray $x) {
        if($this->size() != $x->size()) {
            throw new Exception('Arguments must be of the same length');
        }
        
        foreach($this as $key => $value) {
            $this[$key] = $value & $x[$key];
        }
        
        return $this;
    }    
    
    /**
     * Bitwise XOR on the values of this BitArray using BitArray $x
     * 
     * @param BitArray $x
     * @return BitArray
     */
    public function bitXor(BitArray $x) {
        if($this->size() != $x->size()) {
            throw new Exception('Arguments must be of the same length');
        }
        
        foreach($this as $key => $value) {
            $this[$key] = $value ^ $x[$key];
        }
        
        return $this;
    }        
    
    /*********************** ITERATOR INTERFACE METHODS ***********************/
    public function rewind() { $this->_iteratorPosition = 0; }
    public function current() { return $this->get($this->_iteratorPosition); }
    public function key() { return $this->_iteratorPosition; }
    public function next() { ++$this->_iteratorPosition; }
    public function valid() {
        if($this->_iteratorPosition < $this->size()) {
            return true;
        }
        
        return false;
    }

    /*********************** ITERATOR INTERFACE METHODS ***********************/
    public function offsetExists($offset) { return $this->get($offset); }
    public function offsetGet($offset) { return $this->get($offset); }
    public function offsetSet($offset, $value) { $this->set($offset, $value); }
    public function offsetUnset($offset) { $this->set($offset, false); }
    
    /********************** SERIALIZABLE INTERFACE METHODS *********************/
    public function serialize() { return $this->toJSON(); }
    public function unserialize($value) { $this->fromJSON($value); }
}