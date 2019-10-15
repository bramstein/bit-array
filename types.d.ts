declare module 'bit-array' {
  class BitArray {
    constructor(size: number, hex?: boolean)
    size(): number
    set(index: number, value: boolean): BitArray
    toggle(index: number): BitArray
    get(index: number): boolean
    reset(): BitArray
    copy(): BitArray
    equals(x: BitArray): boolean
    toJSON(): string
    toString(): string
    toBinaryString(): string
    toHexString(): string
    toArray(): boolean[]
    count(): number
    not(): BitArray
    or(x: BitArray): BitArray
    and(x: BitArray): BitArray
    xor(x: BitArray): BitArray
  }
}

export default BitArray