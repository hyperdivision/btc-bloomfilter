var BloomFilter = require('.')

const tweak = BloomFilter.tweak()
const filter = new BloomFilter(1 << 13, 22, tweak)

filter.add(Buffer.from('some txid'))
filter.add(Buffer.from('some pubkey'))

console.log(filter.has(Buffer.from('some txid')))
