const test = require('tape')
const BloomFilter = require('.')

test('basic', function (assert) {
  const b1 = new BloomFilter(36000, 50, BloomFilter.tweak())

  b1.add(Buffer.from('hello world'))
  assert.ok(b1.has(Buffer.from('hello world')))

  const b2 = b1.clone()

  b2.add(Buffer.from('hello world!'))
  assert.ok(b2.has(Buffer.from('hello world!')))
  assert.notOk(b1.has(Buffer.from('hello world!')))
  assert.ok(b1.has(Buffer.from('hello world')))
  assert.ok(b2.has(Buffer.from('hello world')))

  assert.end()
})
