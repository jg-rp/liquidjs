import { IdentifierToken } from './identifier-token'
import { LiteralToken } from './literal-token'
import { NumberToken } from './number-token'
import { PropertyAccessToken } from './property-access-token'
import { QuotedToken } from './quoted-token'

export type PropToken = LiteralToken | QuotedToken | NumberToken | PropertyAccessToken |IdentifierToken
