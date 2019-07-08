# `btc-bloomfilter`

> JavaScript / WASM implementation of BIP 37 - Connection Bloom filtering

## Usage

```js
var BloomFilter = require('btc-bloomfilter')

const tweak = BloomFilter.tweak()
const filter = new BloomFilter(1 << 13, 22, tweak)

filter.add(Buffer.from('some txid'))
filter.add(Buffer.from('some pubkey'))

filter.has(Buffer.from('some txid')) // true
```

## API

### `const filter = new BloomFilter(size, n, tweak)`

### `filter.add(buf)`

### `const bool = filter.has(buf)`

## Install

```sh
npm install btc-bloomfilter
```

## License

[ISC](LICENSE)
