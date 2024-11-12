import { Value } from './value'
import { Template, TemplateImpl } from '../template'
import { Context } from '../context/context'
import { Emitter } from '../emitters/emitter'
import { OutputToken } from '../tokens/output-token'
import { Tokenizer } from '../parser'
import { Liquid } from '../liquid'
import { Filter } from './filter'
import { FilterToken } from '../tokens'
import { MetaNode } from './node'

export class Output extends TemplateImpl<OutputToken> implements Template {
  value: Value
  public constructor (token: OutputToken, liquid: Liquid) {
    super(token)
    const tokenizer = new Tokenizer(token.input, liquid.options.operators, token.file, token.contentRange)
    this.value = new Value(tokenizer.readFilteredValue(), liquid)
    const filters = this.value.filters
    const outputEscape = liquid.options.outputEscape
    if (!filters[filters.length - 1]?.raw && outputEscape) {
      const token = new FilterToken(toString.call(outputEscape), [], '', 0, 0)
      filters.push(new Filter(token, outputEscape, liquid))
    }
  }
  public * render (ctx: Context, emitter: Emitter): IterableIterator<unknown> {
    const val = yield this.value.value(ctx, false)
    emitter.write(val)
  }

  public node (): MetaNode {
    return {
      token: this.token,
      values: [this.value],
      children: [],
      blockScope: [],
      templateScope: []
    }
  }
}
