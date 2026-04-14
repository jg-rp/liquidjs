import { Token } from './token'
import { FilterToken } from './filter-token'
import { TokenKind } from '../parser'
import { Expression } from '../render'
import { Liquid } from '../liquid'
import { Filter } from '../template'
import { assert } from '../util'

/**
 * value expression with optional filters
 * e.g.
 * {% assign foo="bar" | append: "coo" %}
 */
export class FilteredValueToken extends Token {
  public filters: Filter[];

  constructor (
    public initial: Expression,
    filters: FilterToken[],
    liquid: Liquid,
    public input: string,
    public begin: number,
    public end: number,
    public file?: string
  ) {
    super(TokenKind.FilteredValue, input, begin, end, file)
    this.filters = filters.map(token => new Filter(token, this.getFilter(liquid, token.name), liquid))
  }

  private getFilter (liquid: Liquid, name: string) {
    const impl = liquid.filters[name]
    assert(impl || !liquid.options.strictFilters, () => `undefined filter: ${name}`)
    return impl
  }
}
