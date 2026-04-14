import { Token } from './token'
import { LiteralToken } from './literal-token'
import { NumberToken } from './number-token'
import { RangeToken } from './range-token'
import { QuotedToken } from './quoted-token'
import { TokenKind } from '../parser'
import { FilteredValueToken } from './filtered-value-token'
import { PropToken } from './prop-token'

export class PropertyAccessToken extends Token {
  constructor (
    public variable: QuotedToken | RangeToken | LiteralToken | NumberToken | FilteredValueToken |undefined,
    public props: PropToken[],
    input: string,
    begin: number,
    end: number,
    file?: string
  ) {
    super(TokenKind.PropertyAccess, input, begin, end, file)
  }
}
