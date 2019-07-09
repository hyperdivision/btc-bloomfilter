const assert = require('nanoassert')
const murmur = require('murmur3hash-wasm')
const Bitfield = require('bitfield')
const sodium = require('sodium-native')
const VarInt = {
  encode () {
    this.encode.bytes = 0
  },
  encodingLength () {
    return 0
  }
} // require('bitcoin-consensus-encoding/var-int')

class BloomFilter {
  static tweak () {
    return sodium.randombytes_random()
  }

  constructor (size, n, tweak) {
    assert(size > 0 && size < 36001 && Number.isInteger(size), 'size must be a integer value between (0, 36000]')
    assert(n > 0 && n < 51 && Number.isInteger(n), 'n must be a integer value between (0, 50]')
    assert(Number.isInteger(tweak) && n >= 0 && n < 0xffffffff, 'tweak must be a valid uint32')
    this.bits = size * 8
    this.bitfield = new Bitfield(new Uint8Array(size))

    this.tweak = tweak
    this.n = n
    this._tweaks = new Uint32Array(n)
    for (var i = 0; i < this._tweaks.length; i++) {
      this._tweaks[i] = (i * 0xFBA4C795 + this.tweak)
    }
  }

  add (buf) {
    assert(buf instanceof Uint8Array, 'buf must be a Buffer or Uint8Array')
    this._tweaks.forEach(s => this.bitfield.set((murmur(buf, s) >>> 0) % this.bits))
    return this
  }

  has (buf) {
    assert(buf instanceof Uint8Array, 'buf must be a Buffer or Uint8Array')
    return this._tweaks.every(s => this.bitfield.get((murmur(buf, s) >>> 0) % this.bits))
  }

  clone () {
    const clone = new BloomFilter(1, 1, this.tweak)

    clone.bits = this.bits
    clone.bitfield = new Bitfield(new Uint8Array(this.bitfield.buffer))
    clone.tweak = this.tweak
    clone.n = this.n
    clone._tweaks = new Uint32Array(this._tweaks)

    return clone
  }

  encodingLength () {
    return VarInt.encodingLength(this.bitfield.buffer.byteLength) + this.bitfield.buffer.byteLength + 4 + 4 + 1
  }

  encode (buf, offset = 0) {
    if (buf == null) buf = Buffer.alloc(this.encodingLength())
    const view = new DataView(buf.buffer)
    VarInt.encode(this.bitfield.buffer.byteLength, buf, offset)
    offset += VarInt.encode.bytes
    buf.set(this.bitfield.buffer, offset)
    offset += this.bitfield.buffer.byteLength
    view.setUint32(offset, this.n, true)
    offset += 4
    view.setUint32(offset, this.tweak, true)
    offset += 4
    view.setUint8(offset, 0, true)
    offset += 1

    this.encode.bytes = offset
    return buf
  }
}

module.exports = BloomFilter
