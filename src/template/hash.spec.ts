import { toPromise } from '../util'
import { Hash } from './hash'
import { Context } from '../context'
import { Tokenizer } from '../parser'
import { Liquid } from '../liquid'

describe('Hash', function () {
  const liquid = new Liquid()

  it('should parse "reverse"', async function () {
    const hash = await toPromise(new Hash('reverse', liquid).render(new Context({ foo: 3 })))
    expect(hash).toHaveProperty('reverse')
    expect(hash.reverse).toBeTruthy()
  })
  it('should parse "num:foo"', async function () {
    const hash = await toPromise(new Hash('num:foo', liquid).render(new Context({ foo: 3 })))
    expect(hash.num).toBe(3)
  })
  it('should parse "num:3"', async function () {
    const hash = await toPromise(new Hash('num:3', liquid).render(new Context()))
    expect(hash.num).toBe(3)
  })
  it('should parse "num: arr[0]"', async function () {
    const hash = await toPromise(new Hash('num:3', liquid).render(new Context({ arr: [3] })))
    expect(hash.num).toBe(3)
  })
  it('should parse "num: 2.3"', async function () {
    const hash = await toPromise(new Hash('num:2.3', liquid).render(new Context()))
    expect(hash.num).toBe(2.3)
  })
  it('should parse "num:bar.coo"', async function () {
    const pending = new Hash('num:bar.coo', liquid).render(new Context({ bar: { coo: 3 } }))
    const hash = await toPromise(pending)
    expect(hash.num).toBe(3)
  })
  it('should parse "num1:2.3 reverse,num2:bar.coo\n num3: arr[0]"', async function () {
    const ctx = new Context({ bar: { coo: 3 }, arr: [4] })
    const hash = await toPromise(new Hash('num1:2.3 reverse,num2:bar.coo\n num3: arr[0]', liquid).render(ctx))
    expect(hash).toEqual({
      num1: 2.3,
      reverse: true,
      num2: 3,
      num3: 4
    })
  })
  it('should support custom separator', async function () {
    const hash = await toPromise(new Hash('num=2.3', liquid, '=').render(new Context()))
    expect(hash.num).toBe(2.3)
  })
  it('should accept an existing tokenizer', async function () {
    const tokenizer = new Tokenizer('a:1, b:2', liquid)
    const hash = await toPromise(new Hash(tokenizer, liquid).render(new Context()))
    expect(hash.a).toBe(1)
    expect(hash.b).toBe(2)
  })
})
