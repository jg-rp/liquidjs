import { Filter } from './filter'
import { Expression } from '../render'
import { Tokenizer } from '../parser'
import type { FilteredValueToken } from '../tokens'
import type { Liquid } from '../liquid'
import type { Context } from '../context'

export class Value {
  public readonly filters: Filter[] = []
  public readonly initial: Expression

  /**
   * @param input the value to be valuated, eg.: "foobar" | truncate: 3
   */
  public constructor (input: string | FilteredValueToken, liquid: Liquid) {
    const token: FilteredValueToken = typeof input === 'string'
      ? new Tokenizer(input, liquid, liquid.options.operators).readFilteredValue()
      : input
    this.initial = token.initial
    this.filters = token.filters
  }

  public * value (ctx: Context, lenient?: boolean): Generator<unknown, unknown, unknown> {
    lenient = lenient || (ctx.opts.lenientIf && this.filters.length > 0 && this.filters[0].name === 'default')
    let val = yield this.initial.evaluate(ctx, lenient)

    for (const filter of this.filters) {
      val = yield filter.render(val, ctx)
    }
    return val
  }
}
