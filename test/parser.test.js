import { Parser } from '../src/parser.js'
import { Lexer } from '../src/lexer.js'
import Token from '../src/token.js'
import TokenType from '../src/tokenType.js'
import Expression from '../src/ast/Expression.ast.js'
import Module, { NodeType } from '../src/ast/Module.ast.js'

describe('Parser::init', () => {
    test('initializes correctly with a source string', () => {
        const program = 'a + b'
        const goal = {
            lexer: { text: program + '\0', line: 0, start: 1, position: 1 },
            currentToken: new Token(TokenType.ID, 'a', 0, 0),
        }

        const parser = new Parser(program)

        expect(parser).toEqual(goal)
    })

    test('initializes correctly with an initialized lexer', () => {
        const program = 'a + b'
        const goal = {
            lexer: { text: program + '\0', line: 0, start: 1, position: 1 },
            currentToken: new Token(TokenType.ID, 'a', 0, 0),
        }

        const lexer = new Lexer(program)
        const parser = new Parser(lexer)

        expect(parser).toEqual(goal)
    })
})

describe('Parser::match', () => {
    let parser

    beforeEach(() => {
        parser = new Parser()
    })

    test('returns false when token is null', () => {
        const token = null
        const type = TokenType.NUM

        expect(parser.match(token, type)).toBeFalsy()
    })

    test('returns false when types are not passed in', () => {
        const token = new Token(TokenType.NUM, '1', 0, 0)

        expect(parser.match(token)).toBeFalsy()
    })

    test('returns false when type is null', () => {
        const token = new Token(TokenType.NUM, '1', 0, 0)
        const types = null

        expect(parser.match(token, types)).toBeFalsy()
    })

    test('returns false when types is empty array', () => {
        const token = new Token(TokenType.NUM, '1', 0, 0)
        const types = []

        expect(parser.match(token, types)).toBeFalsy()
    })

    test('returns true when token type matches single token', () => {
        const token = new Token(TokenType.NUM, '1', 0, 0)
        const type = TokenType.NUM

        expect(parser.match(token, type)).toBeTruthy()
    })

    test('returns true when token type matches one in array of tokens', () => {
        const token = new Token(TokenType.NUM, '1', 0, 0)
        const types = [TokenType.NUM, TokenType.ID]

        expect(parser.match(token, types)).toBeTruthy()
    })

    test('returns true when token type matches non-first element in array of types', () => {
        const token = new Token(TokenType.NUM, '1', 0, 0)
        const types = [TokenType.ID, TokenType.BOOL, TokenType.NUM]

        expect(parser.match(token, types)).toBeTruthy()
    })

    test('returns false when token type does not match single type', () => {
        const token = new Token(TokenType.NUM, '1', 0, 0)
        const type = TokenType.BOOL

        expect(parser.match(token, type)).toBeFalsy()
    })

    test('returns false when token type does not match any element in array of types', () => {
        const token = new Token(TokenType.NUM, '1', 0, 0)
        const types = [TokenType.BOOL, TokenType.ID]

        expect(parser.match(token, types)).toBeFalsy()
    })
})

describe('Parser::consume', () => {
    let parser

    beforeEach(() => {
        parser = new Parser('a + b')
    })

    test('moves to next token if current token matches expected type', () => {
        const plus = new Token(TokenType.PLUS, '+', 0, 2)

        parser.consume(TokenType.ID)
        const nextToken = parser.currentToken

        expect(nextToken).toEqual(plus)
    })

    test('moves to next token if current token matches one of expected types', () => {
        const plus = new Token(TokenType.PLUS, '+', 0, 2)

        parser.consume([TokenType.NUM, TokenType.ID])
        const nextToken = parser.currentToken

        expect(nextToken).toEqual(plus)
    })

    test('throws error if current token does not match expected type', () => {
        expect(() => {
            parser.consume(TokenType.NUM)
        }).toThrowError()
    })

    test('throws error if current token does not match one of expected types', () => {
        expect(() => {
            parser.consume([TokenType.AND, TokenType.OR])
        }).toThrowError()
    })

    test('does nothing if matches NULLCHAR', () => {
        parser = new Parser('')
        const tokenBefore = parser.currentToken

        parser.consume(TokenType.NULLCHAR)
        const tokenAfter = parser.currentToken

        expect(tokenBefore).toEqual(tokenAfter)
    })

    test('throws error if current token is nullchar, but expecting other', () => {
        parser = new Parser('')

        expect(() => {
            parser.consume(TokenType.NUM)
        }).toThrowError()
    })
})

describe('Parser::expression', () => {
    let parser

    beforeEach(() => {
        parser = new Parser()
    })

    test('parses number literal', () => {
        const program = '42'
        const goal = new Expression.Literal(
            new Token(TokenType.NUM, '42', 0, 0)
        )

        parser.init(program)
        const ast = parser.expression()

        expect(ast).toEqual(goal)
    })

    test('parses boolean literal', () => {
        const program = 'true'
        const goal = new Expression.Literal(
            new Token(TokenType.BOOL, 'true', 0, 0)
        )

        parser.init(program)
        const ast = parser.expression()

        expect(ast).toEqual(goal)
    })

    test('parses variable expression', () => {
        const program = '_myFoo'
        const goal = new Expression.Variable(
            new Token(TokenType.ID, '_myFoo', 0, 0)
        )

        parser.init(program)
        const ast = parser.expression()

        expect(ast).toEqual(goal)
    })

    test('parses unary expression', () => {
        const program = '- 42'
        const goal = new Expression.Unary(
            new Token(TokenType.MINUS, '-', 0, 0),
            new Expression.Literal(new Token(TokenType.NUM, '42', 0, 2))
        )

        parser.init(program)
        const ast = parser.expression()

        expect(ast).toEqual(goal)
    })

    test('parses binary expressions', () => {
        const program = '1 + 2'
        const goal = new Expression.Binary(
            new Expression.Literal(new Token(TokenType.NUM, '1', 0, 0)),
            new Token(TokenType.PLUS, '+', 0, 2),
            new Expression.Literal(new Token(TokenType.NUM, '2', 0, 4))
        )

        parser.init(program)
        const ast = parser.expression()

        expect(ast).toEqual(goal)
    })

    test('parses grouping expressions', () => {
        const program = '(1 + 2)'
        const goal = new Expression.Binary(
            new Expression.Literal(new Token(TokenType.NUM, '1', 0, 1)),
            new Token(TokenType.PLUS, '+', 0, 3),
            new Expression.Literal(new Token(TokenType.NUM, '2', 0, 5))
        )

        parser.init(program)
        const ast = parser.expression()

        expect(ast).toEqual(goal)
    })

    test('parses a sequence of binary expressions', () => {
        const program = '1 + 2 - 3'
        const goal = new Expression.Binary(
            new Expression.Binary(
                new Expression.Literal(new Token(TokenType.NUM, '1', 0, 0)),
                new Token(TokenType.PLUS, '+', 0, 2),
                new Expression.Literal(new Token(TokenType.NUM, '2', 0, 4))
            ),
            new Token(TokenType.MINUS, '-', 0, 6),
            new Expression.Literal(new Token(TokenType.NUM, '3', 0, 8))
        )

        parser.init(program)
        const ast = parser.expression()

        expect(ast).toEqual(goal)
    })

    test('correctly groups expression operations according to order of operations', () => {
        const program = '1 + 2 * 3'
        const goal = new Expression.Binary(
            new Expression.Literal(new Token(TokenType.NUM, '1', 0, 0)),
            new Token(TokenType.PLUS, '+', 0, 2),
            new Expression.Binary(
                new Expression.Literal(new Token(TokenType.NUM, '2', 0, 4)),
                new Token(TokenType.STAR, '*', 0, 6),
                new Expression.Literal(new Token(TokenType.NUM, '3', 0, 8))
            )
        )

        parser.init(program)
        const ast = parser.expression()

        expect(ast).toEqual(goal)
    })

    test('parses power expressions', () => {
        const program = 'n^2'
        const goal = new Expression.Power(
            new Expression.Variable(new Token(TokenType.ID, 'n', 0, 0)),
            new Expression.Literal(new Token(TokenType.NUM, '2', 0, 2))
        )

        parser.init(program)
        const ast = parser.expression()

        expect(ast).toEqual(goal)
    })

    test('parses logical expressions', () => {
        const program = 'true or false'
        const goal = new Expression.Logical(
            new Expression.Literal(new Token(TokenType.BOOL, 'true', 0, 0)),
            new Token(TokenType.OR, 'or', 0, 5),
            new Expression.Literal(new Token(TokenType.BOOL, 'false', 0, 8))
        )

        parser.init(program)
        const ast = parser.expression()

        expect(ast).toEqual(goal)
    })

    test('fun!', () => {
        const program =
            '1 + a * (_myFoo12 - a2) / 3 ^ -(2 +3) and false == true <=false'

        parser.init(program)
        const ast = parser.expression()

        // console.log(JSON.stringify(ast, null, 4))
    })
})

describe('Parser::module', () => {
    let parser

    beforeEach(() => {
        parser = new Parser()
    })

    test('parses an empty module', () => {
        const program = 'module {}'
        const goal = new Module.Module([])

        parser.init(program)
        const ast = parser.module()

        expect(ast).toEqual(goal)
    })

    test('parses module with a single function', () => {
        const program = `module { func add(a: int, b: int) { a + b } }`
        const goal = new Module.Module([
            new Module.Node(
                NodeType.FUNC,
                new Expression.FunctionDeclaration(
                    new Token(TokenType.ID, 'add', 0, 14),
                    [
                        new Expression.VariableDeclaration(
                            new Token(TokenType.ID, 'a', 0, 18),
                            new Token(TokenType.INT_T, 'int', 0, 21),
                            null
                        ),
                        new Expression.VariableDeclaration(
                            new Token(TokenType.ID, 'b', 0, 26),
                            new Token(TokenType.INT_T, 'int', 0, 29),
                            null
                        ),
                    ],
                    new Expression.Block([
                        new Expression.Binary(
                            new Expression.Variable(
                                new Token(TokenType.ID, 'a', 0, 36)
                            ),
                            new Token(TokenType.PLUS, '+', 0, 38),
                            new Expression.Variable(
                                new Token(TokenType.ID, 'b', 0, 40)
                            )
                        ),
                    ])
                )
            ),
        ])

        parser.init(program)
        const ast = parser.module()

        expect(ast).toEqual(goal)
    })
})
